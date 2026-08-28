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
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any, Callable, Iterable
from urllib.parse import quote

import requests

from reg_scraper.config import settings

logger = logging.getLogger(__name__)

CHECKPOINT_NAME = "cucis_checkpoint.jsonl"
GAPFILL_CHECKPOINT_NAME = "cucis_gapfill_checkpoint.jsonl"

ENG_PATH = "search.asp"
THAI_PATH = "searchthai.asp"

# A single-course lookup is two CUCIS searches, ~2.5 s each — used to log the
# gap-fill phase an ETA, not to time anything out.
LOOKUP_SECONDS = 5.0
# Enough failed lookups in a row to call it an outage rather than bad luck.
MAX_LOOKUP_ERRORS = 5
# Enough courses missing from CUCIS in a row to be worth a look.
MISS_STREAK_WARNING = 20

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


def merge_rows(eng: dict[str, str], thai: dict[str, str]) -> dict[str, str]:
    """One CSV-shaped row from the English and Thai listings of a course."""
    return {
        "code": eng.get("code") or thai.get("code", ""),
        "name_en": eng.get("name", ""),
        "name_th": thai.get("name", ""),
        "desc_en": eng.get("desc", ""),
        "desc_th": thai.get("desc", ""),
        "credit": eng.get("credit") or thai.get("credit", ""),
        "condition": eng.get("condition") or thai.get("condition", ""),
        "course_abb": eng.get("course_abb") or thai.get("course_abb", ""),
    }


def _parse_timestamp(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


@dataclass
class CucisReceiver:
    on_progress: Callable[[int, int], None] | None = None

    def _base(self) -> str:
        return settings.cucis_base_url.rstrip("/")

    def _search_url(self, path: str, page: int = 1, keys: str = "") -> str:
        return f"{self._base()}/{path}?Page={page}&Keys={quote(keys)}&Fac=allfac&Se=Courses"

    def _eng_url(self, page: int) -> str:
        return self._search_url(ENG_PATH, page=page)

    def _thai_url(self, page: int) -> str:
        return self._search_url(THAI_PATH, page=page)

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
            merged.append(merge_rows(eng, thai or {}))
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
        if fresh:
            for path in (self.checkpoint, self.gapfill_checkpoint):
                if path.exists():
                    logger.info("--fresh: removing %s", path)
                    path.unlink()

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

    # --- Gap fill ---------------------------------------------------------
    # The catalogue crawl is keyed by page number, so a course CUCIS published
    # after the last full crawl is invisible to it — and courses keep appearing
    # in Reg Chula through the add-drop period. search.asp also takes a course
    # code in Keys and answers with that one course, so those are filled in with
    # one lookup each instead of re-crawling 1490 pages.

    @property
    def gapfill_checkpoint(self) -> Path:
        return settings.checkpoint_path(GAPFILL_CHECKPOINT_NAME)

    def _gapfill_records(self) -> dict[str, dict[str, Any]]:
        """Latest record per course code — a re-probe supersedes an older miss."""
        records: dict[str, dict[str, Any]] = {}
        if not self.gapfill_checkpoint.exists():
            return records
        with self.gapfill_checkpoint.open(encoding="utf-8") as handle:
            for line in handle:
                try:
                    record = json.loads(line)
                except Exception:  # noqa: BLE001 - truncated final line
                    continue
                code = record.get("code")
                if code:
                    records[code] = record
        return records

    def gapfill_rows(self) -> list[dict[str, Any]]:
        """Everything the gap fill has found, in the same shape as a crawled row."""
        rows = [
            record["row"]
            for record in self._gapfill_records().values()
            if record.get("found") and record.get("row")
        ]
        rows.sort(key=lambda row: row["code"])
        return rows

    def pending_gaps(self, course_nos: Iterable[str]) -> list[str]:
        """Codes still worth a lookup: never probed, or missed long enough ago
        that CUCIS may have catalogued them since.

        A course can reach Reg Chula days before CUCIS lists it, so a miss is
        remembered — otherwise every run re-probes the same courses forever —
        but not permanently, or the description would never arrive.
        """
        records = self._gapfill_records()
        retry_days = settings.scraper_descriptions_gapfill_retry_days
        now = datetime.now(tz=UTC)

        pending: list[str] = []
        for course_no in course_nos:
            record = records.get(course_no)
            if record is None:
                pending.append(course_no)
                continue
            if record.get("found"):
                continue  # its row is already in the CSV
            if retry_days <= 0:
                continue
            checked_at = _parse_timestamp(record.get("checked_at"))
            if checked_at is None or now - checked_at >= timedelta(days=retry_days):
                pending.append(course_no)
        return pending

    def _exact_row(self, url: str, course_no: str) -> dict[str, str] | None:
        # Keys is a substring match, and an unknown code is answered with an
        # unrelated row rather than nothing (Keys=0000000 returns 2746648), so
        # only an exact code match counts as a hit.
        for row in parse_page(self._fetch(url)):
            if row["code"] == course_no:
                return row
        return None

    def lookup_course(self, course_no: str) -> dict[str, str] | None:
        delay = settings.cucis_delay_ms / 1000
        eng = self._exact_row(self._search_url(ENG_PATH, keys=course_no), course_no)
        time.sleep(delay)
        thai = self._exact_row(self._search_url(THAI_PATH, keys=course_no), course_no)
        time.sleep(delay)
        if eng is None and thai is None:
            return None
        return merge_rows(eng or {}, thai or {})

    def fill_gaps(self, course_nos: list[str]) -> list[dict[str, Any]]:
        """Look up each course by code, recording misses as well as hits."""
        self.gapfill_checkpoint.parent.mkdir(parents=True, exist_ok=True)
        found: list[dict[str, Any]] = []
        total = len(course_nos)
        errors = 0
        misses = 0

        with self.gapfill_checkpoint.open("a", encoding="utf-8") as handle:
            for index, course_no in enumerate(course_nos, start=1):
                try:
                    row = self.lookup_course(course_no)
                except Exception as exc:  # noqa: BLE001
                    # No record written, so the course stays pending for next run.
                    errors += 1
                    logger.warning("Gap fill: %s lookup failed (%s)", course_no, exc)
                    if errors >= MAX_LOOKUP_ERRORS:
                        logger.warning(
                            "Gap fill: %d lookups in a row failed — CUCIS looks "
                            "unreachable, stopping the phase",
                            errors,
                        )
                        break
                    continue
                errors = 0

                record: dict[str, Any] = {
                    "code": course_no,
                    "found": row is not None,
                    "checked_at": datetime.now(tz=UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
                }
                if row is not None:
                    record["row"] = row
                    found.append(row)
                    misses = 0
                else:
                    misses += 1
                handle.write(json.dumps(record, ensure_ascii=False) + "\n")
                handle.flush()

                logger.info(
                    "Gap fill %d/%d %s -> %s",
                    index,
                    total,
                    course_no,
                    "found" if row else "not in CUCIS",
                )
                if misses == MISS_STREAK_WARNING:
                    logger.warning(
                        "Gap fill: %d courses in a row were not in CUCIS — check "
                        "%s still answers a Keys=<course no> search",
                        misses,
                        self._base(),
                    )
                if self.on_progress:
                    self.on_progress(index, total)

        return found
