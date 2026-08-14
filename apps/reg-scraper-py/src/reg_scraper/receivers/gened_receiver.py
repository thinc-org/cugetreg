"""GenEd course types from https://www.gened.chula.ac.th.

Feeds overrides.json, which is what actually decides gen_ed_type in the
database. The list endpoint has no stable sort — paging repeats rows and drops
others — so we ask for every course in a single page.
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable

import requests

from reg_scraper.config import settings

logger = logging.getLogger(__name__)

CHECKPOINT_NAME = "gened_checkpoint.jsonl"

# The "Categories" group on a course page holds the four GenEd areas.
CATEGORY_GROUP_ID = 6
GENED_TYPES = {
    "science-mathematic": "SC",
    "social science": "SO",
    "humanities": "HU",
    "interdisciplinary": "IN",
}
# Used when a course has no category in that group.
UNKNOWN_AREA = "GENED"


@dataclass
class GenEdReceiver:
    on_progress: Callable[[int, int], None] | None = None

    def _base(self) -> str:
        return settings.gened_base_url.rstrip("/")

    @property
    def checkpoint(self) -> Path:
        return settings.checkpoint_path(CHECKPOINT_NAME)

    def _fetch_json(self, url: str, tries: int = 4) -> Any:
        last_error: str | None = None
        for attempt in range(tries):
            try:
                response = requests.get(url, timeout=60)
                if response.status_code == 200:
                    return response.json()
                last_error = f"status={response.status_code}"
            except Exception as exc:  # noqa: BLE001
                last_error = repr(exc)
            time.sleep(2 * (attempt + 1))
        raise RuntimeError(f"Failed to fetch {url}: {last_error}")

    def list_course_numbers(self) -> list[str]:
        probe = self._fetch_json(f"{self._base()}/search-courses?page=1&limit=1")
        total = probe.get("totalRecords", 0)
        time.sleep(settings.gened_delay_ms / 1000)

        data = self._fetch_json(f"{self._base()}/search-courses?page=1&limit={total}")
        codes = [course["courseNumber"] for course in data["data"]]
        logger.info("%d GenEd courses listed (API reports %d)", len(codes), total)
        if len(codes) < total:
            logger.warning("GenEd list is short by %d courses", total - len(codes))
        return codes

    @staticmethod
    def gened_type(course: dict[str, Any]) -> str:
        for category in course.get("categoryTypes") or []:
            group = category.get("category") or {}
            if group.get("id") != CATEGORY_GROUP_ID:
                continue
            code = GENED_TYPES.get((category.get("title") or "").strip().lower())
            if code:
                return code
        return UNKNOWN_AREA

    def _scrape_course(self, code: str) -> dict[str, str]:
        course = self._fetch_json(f"{self._base()}/courses/{code}")["data"]
        return {
            "courseNo": course.get("courseNumber", code),
            "genEdType": self.gened_type(course),
        }

    def completed_courses(self) -> set[str]:
        done: set[str] = set()
        if not self.checkpoint.exists():
            return done
        with self.checkpoint.open(encoding="utf-8") as handle:
            for line in handle:
                try:
                    done.add(json.loads(line)["courseNo"])
                except Exception:  # noqa: BLE001 - truncated final line
                    pass
        return done

    def rows_from_checkpoint(self) -> list[dict[str, str]]:
        if not self.checkpoint.exists():
            return []
        rows: list[dict[str, str]] = []
        seen: set[str] = set()
        with self.checkpoint.open(encoding="utf-8") as handle:
            for line in handle:
                try:
                    record = json.loads(line)
                except Exception:  # noqa: BLE001
                    continue
                if record["courseNo"] in seen:
                    continue
                seen.add(record["courseNo"])
                rows.append(
                    {"courseNo": record["courseNo"], "genEdType": record["genEdType"]}
                )
        rows.sort(key=lambda row: row["courseNo"])
        return rows

    def scrape(self, fresh: bool = False) -> list[dict[str, str]]:
        self.checkpoint.parent.mkdir(parents=True, exist_ok=True)
        if fresh and self.checkpoint.exists():
            logger.info("--fresh: removing %s", self.checkpoint)
            self.checkpoint.unlink()

        done = self.completed_courses()
        if done:
            modified = time.strftime(
                "%Y-%m-%d %H:%M", time.localtime(self.checkpoint.stat().st_mtime)
            )
            logger.info(
                "Resuming from checkpoint (last modified %s, %d courses done). "
                "Re-run with --fresh to discard it and refetch everything.",
                modified,
                len(done),
            )

        codes = self.list_course_numbers()
        total = len(codes)
        delay = settings.gened_delay_ms / 1000

        with self.checkpoint.open("a", encoding="utf-8") as handle:
            for index, code in enumerate(codes, start=1):
                if code in done:
                    continue
                row = self._scrape_course(code)
                handle.write(json.dumps(row, ensure_ascii=False) + "\n")
                handle.flush()
                logger.info(
                    "GenEd %d/%d %s -> %s", index, total, row["courseNo"], row["genEdType"]
                )
                if self.on_progress:
                    self.on_progress(index, total)
                time.sleep(delay)

        return self.rows_from_checkpoint()
