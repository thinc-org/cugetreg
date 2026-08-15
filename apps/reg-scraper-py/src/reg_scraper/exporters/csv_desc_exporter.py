"""Writes the course-description CSV that EnrichProcessor reads.

Raw CUCIS field names match none of the aliases EnrichProcessor looks up, so the
renaming happens here.
"""

from __future__ import annotations

import csv
import logging
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
    def export(self, rows: list[dict[str, Any]]) -> None:
        output_path = settings.resolve_path(settings.course_desc_path)
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
