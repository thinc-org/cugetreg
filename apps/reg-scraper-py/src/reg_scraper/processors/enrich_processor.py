from __future__ import annotations

import csv
import json
import logging
from pathlib import Path

from reg_scraper.config import settings
from reg_scraper.models import Course, GenEdType
from reg_scraper.processors.base import Processor

logger = logging.getLogger(__name__)


class EnrichProcessor(Processor[list[Course], list[Course]]):
    """
    Applies optional CSV descriptions and overrides.json genEd metadata.
    Mirrors V1 OverrideService behaviour.
    """

    def __init__(self) -> None:
        self.descriptions: dict[str, dict[str, str]] = {}
        self.overrides: dict[str, GenEdType] = {}
        self._load_sources()

    def _load_sources(self) -> None:
        desc_path = settings.course_desc_path.strip()
        if desc_path:
            path = settings.resolve_path(desc_path)
            if path.exists():
                self._load_csv(path)
                logger.info("Loaded %d course descriptions from %s", len(self.descriptions), path)
            else:
                logger.warning("COURSE_DESC_PATH not found: %s (descriptions will be empty)", path)

        overrides_path = settings.resolve_path(settings.overrides_path)
        if overrides_path.exists():
            raw = json.loads(overrides_path.read_text(encoding="utf-8"))
            for item in raw:
                course_no = item.get("courseNo") or item.get("course_no")
                gen_ed = item.get("genEdType") or item.get("gen_ed_type")
                if course_no and gen_ed:
                    self.overrides[course_no] = gen_ed

    def _load_csv(self, path: Path) -> None:
        """
        V1 CSV format (course_chula_full.csv):
          course_no, description_thai, description
        """
        with path.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                course_no = row.get("course_no") or row.get("courseNo")
                if not course_no:
                    continue
                desc_th = (
                    row.get("description_thai")
                    or row.get("courseDescTh")
                    or row.get("description_th")
                    or ""
                )
                desc_en = (
                    row.get("description")
                    or row.get("courseDescEn")
                    or row.get("description_en")
                    or ""
                )
                if desc_th.strip() in {"", "-"}:
                    desc_th = ""
                if desc_en.strip() in {"", "-"}:
                    desc_en = ""
                if desc_th or desc_en:
                    self.descriptions[course_no] = {
                        "courseDescTh": desc_th,
                        "courseDescEn": desc_en,
                    }

    def process(self, courses: list[Course]) -> list[Course]:
        enriched: list[Course] = []
        for course in courses:
            data = course.model_dump()
            desc = self.descriptions.get(course.courseNo)
            if desc:
                data["courseDescTh"] = desc.get("courseDescTh", "")
                data["courseDescEn"] = desc.get("courseDescEn", "")

            gen_ed = self.overrides.get(course.courseNo, course.genEdType)
            data["genEdType"] = gen_ed

            sections = []
            for section in course.sections:
                section_data = section.model_dump()
                section_data["genEdType"] = gen_ed
                sections.append(section_data)
            data["sections"] = sections

            enriched.append(Course.model_validate(data))
        return enriched
