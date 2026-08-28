"""Writes the course-description CSV that EnrichProcessor reads.

Raw CUCIS field names match none of the aliases EnrichProcessor looks up, so the
renaming happens here.
"""

from __future__ import annotations

import csv
import logging
from pathlib import Path
from typing import Any

from reg_scraper.config import settings
from reg_scraper.exporters.base import Exporter

logger = logging.getLogger(__name__)

FIELDNAMES = [
    "course_no",
    "description_thai",
    "description",
    "name_th",
    "name_en",
    "credit",
    "condition",
    "abbr_name",
]


def cucis_row_to_csv_row(row: dict[str, Any]) -> dict[str, str]:
    return {
        "course_no": (row.get("code") or "").strip(),
        "description_thai": (row.get("desc_th") or "").strip(),
        "description": (row.get("desc_en") or "").strip(),
        "name_th": (row.get("name_th") or "").strip(),
        "name_en": (row.get("name_en") or "").strip(),
        "credit": (row.get("credit") or "").strip(),
        "condition": (row.get("condition") or "").strip(),
        "abbr_name": (row.get("course_abb") or "").strip(),
    }


class CsvDescExporter(Exporter[list[dict[str, Any]]]):
    @staticmethod
    def path() -> Path:
        return settings.resolve_path(settings.course_desc_path)

    @classmethod
    def existing_course_nos(cls) -> set[str]:
        """Every course already in the CSV, description text or not."""
        path = cls.path()
        if not path.exists():
            return set()
        with path.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            return {
                (row.get("course_no") or "").strip()
                for row in reader
                if (row.get("course_no") or "").strip()
            }

    def append(self, rows: list[dict[str, Any]]) -> int:
        """Add rows the CSV does not have yet, leaving the rest of it untouched.

        Rewriting the file instead would mean rebuilding all ~29.7k rows from the
        crawl checkpoint, which is not always the one on disk.
        """
        path = self.path()
        if not path.exists() or path.stat().st_size == 0:
            self.export(rows)
            return len(rows)

        seen = self.existing_course_nos()
        written = 0
        # The BOM export() wrote is already at the start of the file; utf-8-sig
        # here would emit a second one mid-file and corrupt the next course_no.
        with path.open("a", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=FIELDNAMES)
            for row in rows:
                csv_row = cucis_row_to_csv_row(row)
                course_no = csv_row["course_no"]
                if not course_no or course_no in seen:
                    continue
                seen.add(course_no)
                writer.writerow(csv_row)
                written += 1

        logger.info("Appended %d course descriptions -> %s", written, path)
        return written

    def export(self, rows: list[dict[str, Any]]) -> None:
        output_path = self.path()
        output_path.parent.mkdir(parents=True, exist_ok=True)

        seen: set[str] = set()
        written = 0
        # BOM so Excel shows Thai correctly
        with output_path.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.DictWriter(handle, fieldnames=FIELDNAMES)
            writer.writeheader()
            for row in rows:
                csv_row = cucis_row_to_csv_row(row)
                course_no = csv_row["course_no"]
                if not course_no or course_no in seen:
                    continue
                seen.add(course_no)
                writer.writerow(csv_row)
                written += 1

        logger.info("Wrote %d course descriptions -> %s", written, output_path)
