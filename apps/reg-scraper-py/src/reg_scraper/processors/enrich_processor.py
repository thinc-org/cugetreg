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
    """Applies CSV descriptions and overrides.json genEd types.

    Descriptions come from two sources and are merged **per language**: CUCIS (the
    CSV) first, then the GenEd site for whichever language CUCIS left blank. CUCIS
    prints "-" for a course it has no text for, and for GenEd courses it does that
    surprisingly often — in one language (2307206 Earth Sciences has Thai only,
    3404117 Introduction to Law English only) or in both (2604362 Personal
    Finance), while the GenEd site has both. Those used to export empty.
    """

    def __init__(self) -> None:
        self.descriptions: dict[str, dict[str, str]] = {}
        self.gened_descriptions: dict[str, dict[str, str]] = {}
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
                if not course_no:
                    continue
                gen_ed = item.get("genEdType") or item.get("gen_ed_type")
                if gen_ed:
                    self.overrides[course_no] = gen_ed
                desc_en = (item.get("descriptionEn") or "").strip()
                desc_th = (item.get("descriptionTh") or "").strip()
                if desc_en or desc_th:
                    self.gened_descriptions[course_no] = {
                        "courseDescEn": desc_en,
                        "courseDescTh": desc_th,
                    }
            logger.info(
                "Loaded %d GenEd overrides from %s (%d with description text)",
                len(self.overrides),
                overrides_path,
                len(self.gened_descriptions),
            )

    def _load_csv(self, path: Path) -> None:
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
        filled_from_gened = 0
        for course in courses:
            data = course.model_dump()
            desc = self.descriptions.get(course.courseNo) or {}
            gened_desc = self.gened_descriptions.get(course.courseNo) or {}
            if desc or gened_desc:
                for field in ("courseDescTh", "courseDescEn"):
                    text = desc.get(field) or ""
                    if not text and gened_desc.get(field):
                        text = gened_desc[field]
                        filled_from_gened += 1
                    data[field] = text

            gen_ed = self.overrides.get(course.courseNo, course.genEdType)
            data["genEdType"] = gen_ed

            sections = []
            for section in course.sections:
                section_data = section.model_dump()
                section_data["genEdType"] = gen_ed
                sections.append(section_data)
            data["sections"] = sections

            enriched.append(Course.model_validate(data))

        if filled_from_gened:
            logger.info(
                "Filled %d description field(s) from the GenEd site where CUCIS had none",
                filled_from_gened,
            )
        return enriched
