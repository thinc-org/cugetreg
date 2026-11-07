"""GenEd course types and descriptions from https://www.gened.chula.ac.th.

Feeds overrides.json, which is what actually decides gen_ed_type in the
database. The list endpoint has no stable sort — paging repeats rows and drops
others — so we ask for every course in a single page.

That one list response also carries each course's descriptionEn/descriptionTh,
which CUCIS is missing for a fair number of GenEd courses (in one or both
languages), so they are harvested here and used to fill the gaps. Only the
GenEd *area* needs the per-course call — categoryTypes is not in the listing.
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

# Description fields the listing carries; refreshed every run at no request cost.
DESC_FIELDS = ("descriptionEn", "descriptionTh")


def listed_descriptions(entry: dict[str, Any]) -> dict[str, str]:
    return {field: (entry.get(field) or "").strip() for field in DESC_FIELDS}


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

    def list_courses(self) -> list[dict[str, Any]]:
        probe = self._fetch_json(f"{self._base()}/search-courses?page=1&limit=1")
        total = probe.get("totalRecords", 0)
        time.sleep(settings.gened_delay_ms / 1000)

        data = self._fetch_json(f"{self._base()}/search-courses?page=1&limit={total}")
        entries = [course for course in data["data"] if course.get("courseNumber")]
        logger.info("%d GenEd courses listed (API reports %d)", len(entries), total)
        if len(entries) < total:
            logger.warning("GenEd list is short by %d courses", total - len(entries))
        return entries

    def list_course_numbers(self) -> list[str]:
        return [entry["courseNumber"] for entry in self.list_courses()]

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

    def records(self) -> dict[str, dict[str, Any]]:
        """Latest record per course — a later line supersedes an earlier one, which
        is how a description added to an already-fetched course takes effect."""
        records: dict[str, dict[str, Any]] = {}
        if not self.checkpoint.exists():
            return records
        with self.checkpoint.open(encoding="utf-8") as handle:
            for line in handle:
                try:
                    record = json.loads(line)
                except Exception:  # noqa: BLE001 - truncated final line
                    continue
                if record.get("courseNo"):
                    records[record["courseNo"]] = record
        return records

    def completed_courses(self) -> set[str]:
        return set(self.records())

    def rows_from_checkpoint(self) -> list[dict[str, str]]:
        rows = [
            {
                "courseNo": record["courseNo"],
                "genEdType": record["genEdType"],
                **{field: record.get(field, "") for field in DESC_FIELDS},
            }
            for record in self.records().values()
            if record.get("genEdType")
        ]
        rows.sort(key=lambda row: row["courseNo"])
        return rows

    def scrape(self, fresh: bool = False) -> list[dict[str, str]]:
        self.checkpoint.parent.mkdir(parents=True, exist_ok=True)
        if fresh and self.checkpoint.exists():
            logger.info("--fresh: removing %s", self.checkpoint)
            self.checkpoint.unlink()

        done = self.records()
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

        entries = self.list_courses()
        total = len(entries)
        delay = settings.gened_delay_ms / 1000
        fetched = refreshed = 0

        with self.checkpoint.open("a", encoding="utf-8") as handle:
            for index, entry in enumerate(entries, start=1):
                code = entry["courseNumber"]
                record = done.get(code)
                descriptions = listed_descriptions(entry)

                if record is None:
                    # The area (categoryTypes) is the only thing the listing lacks.
                    row = self._scrape_course(code) | descriptions
                    fetched += 1
                    logger.info(
                        "GenEd %d/%d %s -> %s",
                        index,
                        total,
                        row["courseNo"],
                        row["genEdType"],
                    )
                elif any(
                    descriptions[f] and descriptions[f] != record.get(f, "")
                    for f in DESC_FIELDS
                ):
                    # Text arrived or changed since this course was fetched. It
                    # rides along with the listing, so no request here. An *empty*
                    # listing field never overwrites text already stored: a renamed
                    # API field or a half-filled response would otherwise blank
                    # every description in one run.
                    row = {
                        **record,
                        **{f: descriptions[f] or record.get(f, "") for f in DESC_FIELDS},
                    }
                    refreshed += 1
                else:
                    continue

                handle.write(json.dumps(row, ensure_ascii=False) + "\n")
                handle.flush()
                if self.on_progress:
                    self.on_progress(index, total)
                if record is None:
                    time.sleep(delay)

        if refreshed:
            logger.info("Refreshed descriptions for %d already-known course(s)", refreshed)
        rows = self.rows_from_checkpoint()
        with_desc = sum(1 for row in rows if row["descriptionEn"] or row["descriptionTh"])
        logger.info(
            "GenEd: %d new, %d total, %d with a description from the GenEd site",
            fetched,
            len(rows),
            with_desc,
        )
        return rows
