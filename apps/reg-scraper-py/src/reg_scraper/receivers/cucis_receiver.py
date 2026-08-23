"""Course descriptions from CUCIS (http://cucis.academic.chula.ac.th).

Reg Chula pages have no description text, so it comes from the Office of
Academic Affairs catalogue instead — English (search.asp) and Thai
(searchthai.asp) listings merged by course code.
"""

from __future__ import annotations

import json
import logging
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable

import requests

from reg_scraper.config import settings

logger = logging.getLogger(__name__)

CHECKPOINT_NAME = "cucis_checkpoint.jsonl"

_TAG = re.compile(r"<[^>]+>")
_WS = re.compile(r"\s+")

# Old ASP tables — cells are picked out by their fixed bgcolor + width attrs.
_RE_CODE = re.compile(r'bgcolor="#ffffff"[^>]*width="100">\s*<font[^>]*>\s*(.*?)\s*&nbsp;', re.S)
_RE_NAME = re.compile(r'bgcolor="#ffffff"[^>]*width="190">\s*<font[^>]*>\s*(.*?)\s*&nbsp;', re.S)
_RE_ABB = re.compile(r'bgcolor="#ffffff"[^>]*width="170">\s*<font[^>]*>\s*(.*?)\s*&nbsp;', re.S)
# Credit and Condition share width="90", so matches interleave credit, condition.
_RE_C90 = re.compile(r'bgcolor="#ffffff"[^>]*width="90">\s*<font[^>]*>\s*(.*?)\s*&nbsp;', re.S)
# English uses colspan=4, Thai colspan=3.
_RE_DESC = re.compile(r'colspan=\d+[^>]*width="540">\s*<font[^>]*>\s*(.*?)\s*&nbsp;', re.S)


def _clean(text: str) -> str:
    return _WS.sub(" ", _TAG.sub("", text)).strip()


def parse_page(html: str) -> list[dict[str, str]]:
    codes = [_clean(x) for x in _RE_CODE.findall(html)]
    names = [_clean(x) for x in _RE_NAME.findall(html)]
    abbs = [_clean(x) for x in _RE_ABB.findall(html)]
    descs = [_clean(x) for x in _RE_DESC.findall(html)]
    c90 = [_clean(x) for x in _RE_C90.findall(html)]
    credits = c90[0::2]
    conditions = c90[1::2]

    count = min(len(codes), len(names), len(descs), len(credits), len(conditions))
    return [
        {
            "code": codes[i],
            "name": names[i],
            "desc": descs[i],
            "credit": credits[i],
            "condition": conditions[i],
            "course_abb": abbs[i] if i < len(abbs) else "",
        }
        for i in range(count)
    ]


@dataclass
class CucisReceiver:
    on_progress: Callable[[int, int], None] | None = None

    def _base(self) -> str:
        return settings.cucis_base_url.rstrip("/")

    def _eng_url(self, page: int) -> str:
        return f"{self._base()}/search.asp?Page={page}&Keys=&Fac=allfac&Se=Courses"

    def _thai_url(self, page: int) -> str:
        return f"{self._base()}/searchthai.asp?Page={page}&Keys=&Fac=allfac&Se=Courses"

    @property
    def checkpoint(self) -> Path:
        return settings.checkpoint_path(CHECKPOINT_NAME)

    def _fetch(self, url: str, tries: int = 4) -> str:
        last_error: str | None = None
        for attempt in range(tries):
            try:
                response = requests.get(url, timeout=90)
                response.encoding = "cp874"
                if response.status_code == 200 and len(response.text) > 2000:
                    return response.text
                last_error = f"status={response.status_code} len={len(response.text)}"
            except Exception as exc:  # noqa: BLE001
                last_error = repr(exc)
            time.sleep(2 * (attempt + 1))
        raise RuntimeError(f"Failed to fetch {url}: {last_error}")

    def _scrape_page(self, page: int) -> list[dict[str, str]]:
        delay = settings.cucis_delay_ms / 1000
        eng_rows = parse_page(self._fetch(self._eng_url(page)))
        time.sleep(delay)
        thai_rows = parse_page(self._fetch(self._thai_url(page)))
        time.sleep(delay)

        thai_by_code = {row["code"]: row for row in thai_rows}

        merged = []
        for index, eng in enumerate(eng_rows):
            thai = thai_by_code.get(eng["code"])
            if thai is None and index < len(thai_rows):  # fall back to position
                thai = thai_rows[index]
            thai = thai or {}
            merged.append(
                {
                    "code": eng["code"],
                    "name_en": eng["name"],
                    "name_th": thai.get("name", ""),
                    "desc_en": eng["desc"],
                    "desc_th": thai.get("desc", ""),
                    "credit": eng["credit"],
                    "condition": eng["condition"],
                    "course_abb": eng["course_abb"],
                }
            )
        return merged

    def completed_pages(self) -> set[int]:
        done: set[int] = set()
        if not self.checkpoint.exists():
            return done
        with self.checkpoint.open(encoding="utf-8") as handle:
            for line in handle:
                try:
                    done.add(json.loads(line)["page"])
                except Exception:  # noqa: BLE001 - truncated final line
                    pass
        return done

    def rows_from_checkpoint(self) -> list[dict[str, Any]]:
        if not self.checkpoint.exists():
            return []
        records = []
        with self.checkpoint.open(encoding="utf-8") as handle:
            for line in handle:
                try:
                    records.append(json.loads(line))
                except Exception:  # noqa: BLE001
                    pass
        records.sort(key=lambda record: record["page"])
        return [row for record in records for row in record["rows"]]

    def scrape(self, fresh: bool = False) -> list[dict[str, Any]]:
        self.checkpoint.parent.mkdir(parents=True, exist_ok=True)
        if fresh and self.checkpoint.exists():
            logger.info("--fresh: removing %s", self.checkpoint)
            self.checkpoint.unlink()

        done = self.completed_pages()
        total = settings.cucis_total_pages
        if done:
            modified = time.strftime(
                "%Y-%m-%d %H:%M", time.localtime(self.checkpoint.stat().st_mtime)
            )
            logger.info(
                "Resuming from checkpoint (last modified %s, %d/%d pages done). "
                "Re-run with --fresh to discard it and refetch everything.",
                modified,
                len(done),
                total,
            )

        with self.checkpoint.open("a", encoding="utf-8") as handle:
            for page in range(1, total + 1):
                if page in done:
                    continue
                rows = self._scrape_page(page)
                handle.write(
                    json.dumps({"page": page, "rows": rows}, ensure_ascii=False) + "\n"
                )
                handle.flush()
                logger.info("CUCIS page %d/%d (%d courses)", page, total, len(rows))
                if self.on_progress:
                    self.on_progress(page, total)

        return self.rows_from_checkpoint()
