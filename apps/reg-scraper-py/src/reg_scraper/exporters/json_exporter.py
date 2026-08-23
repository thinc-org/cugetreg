from __future__ import annotations

import json
from typing import Any

from reg_scraper.config import settings
from reg_scraper.exporters.base import Exporter
from reg_scraper.models import ClassItem, Course, ExamPeriod, Section


def _exam_to_dict(exam: ExamPeriod | None) -> dict[str, Any] | None:
    if exam is None:
        return None
    return {
        "period": {
            "start": exam.period.start,
            "end": exam.period.end,
        },
        "date": exam.date,
    }


def _class_to_dict(cls: ClassItem) -> dict[str, Any]:
    return {
        "teachers": cls.teachers,
        "_id": None,
        "type": cls.type,
        "dayOfWeek": cls.dayOfWeek or "IA",
        "period": {
            "start": cls.period.start,
            "end": cls.period.end,
        },
        "building": cls.building,
        "room": cls.room,
    }


def _section_to_dict(section: Section) -> dict[str, Any]:
    return {
        "_id": None,
        "sectionNo": section.sectionNo,
        "closed": section.closed,
        "capacity": {
            "current": section.capacity.get("current", 0),
            "max": section.capacity.get("max", 0),
        },
        "note": section.note if section.note else None,
        "classes": [_class_to_dict(c) for c in section.classes],
        "genEdType": section.genEdType,
    }


def course_to_mongo_dump(course: Course) -> dict[str, Any]:
    """Mongo dump shape; fields we do not scrape are null."""
    credit: int | float = int(course.credit) if course.credit == int(course.credit) else course.credit

    return {
        "_id": None,
        "__v": None,
        "abbrName": course.abbrName,
        "academicYear": course.academicYear,
        "courseCondition": course.courseCondition or None,
        "courseDescEn": course.courseDescEn or None,
        "courseDescTh": course.courseDescTh or None,
        "courseNameEn": course.courseNameEn,
        "courseNameTh": course.courseNameTh,
        "courseNo": course.courseNo,
        "createdAt": None,
        "credit": credit,
        "creditHours": course.creditHours or None,
        "department": course.department or None,
        "faculty": course.faculty or None,
        "final": _exam_to_dict(course.final),
        "genEdType": course.genEdType,
        "midterm": _exam_to_dict(course.midterm),
        "sections": [_section_to_dict(s) for s in course.sections],
        "semester": course.semester,
        "studyProgram": course.studyProgram,
        "updatedAt": None,
    }


class JsonExporter(Exporter[list[Course]]):
    def export(self, courses: list[Course]) -> None:
        output_path = settings.resolve_path(settings.scraper_json_output)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        payload = [course_to_mongo_dump(course) for course in courses]

        output_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
