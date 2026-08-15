from __future__ import annotations

from datetime import datetime

import psycopg
from cuid2 import cuid_wrapper

from reg_scraper.config import settings
from reg_scraper.exporters.base import Exporter
from reg_scraper.models import Course

generate_cuid = cuid_wrapper()

SEMESTER_MAP = {"1": "FIRST", "2": "SECOND", "3": "SUMMER"}


def map_semester(raw: str) -> str:
    return SEMESTER_MAP.get(raw, raw)


def map_day_of_week(raw: str) -> str:
    return "IR" if raw == "IA" else raw


def grading_type(credit_hours: str) -> str:
    return "SU" if "S/U" in (credit_hours or "") else "LETTER"


def parse_exam_period(period: dict | None) -> tuple[datetime | None, datetime | None]:
    if not period:
        return None, None
    start_raw = period["period"]["start"]
    end_raw = period["period"]["end"]
    if start_raw in {"IA", "AR"} or end_raw in {"IA", "AR"}:
        return None, None
    date_str = period["date"].split("T")[0]
    year, month, day = map(int, date_str.split("-"))
    start_h, start_m = map(int, start_raw.split(":"))
    end_h, end_m = map(int, end_raw.split(":"))
    start = datetime(year, month, day, start_h, start_m)
    end = datetime(year, month, day, end_h, end_m)
    return start, end


class PostgresExporter(Exporter[list[Course]]):
    """Upserts scraped courses into mvp1-dev PostgreSQL schema (Prisma)."""

    def export(self, courses: list[Course]) -> None:
        with psycopg.connect(settings.database_url) as conn:
            with conn.cursor() as cur:
                for course in courses:
                    self._upsert_course(cur, course)
            conn.commit()

    def _upsert_course(self, cur: psycopg.Cursor, course: Course) -> None:
        semester = map_semester(course.semester)
        academic_year = int(course.academicYear)

        cur.execute(
            """
            INSERT INTO course_info (
              course_no, abbr_name, course_name_en, course_name_th,
              course_desc_en, course_desc_th, faculty, department, credit, credit_hours,
              study_program, academic_year, semester, grading_type
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (course_no) DO UPDATE SET
              abbr_name = EXCLUDED.abbr_name,
              course_name_en = EXCLUDED.course_name_en,
              course_name_th = EXCLUDED.course_name_th,
              course_desc_en = EXCLUDED.course_desc_en,
              course_desc_th = EXCLUDED.course_desc_th,
              faculty = EXCLUDED.faculty,
              department = EXCLUDED.department,
              credit = EXCLUDED.credit,
              credit_hours = EXCLUDED.credit_hours,
              study_program = EXCLUDED.study_program,
              academic_year = EXCLUDED.academic_year,
              semester = EXCLUDED.semester,
              grading_type = EXCLUDED.grading_type
            """,
            (
                course.courseNo,
                course.abbrName,
                course.courseNameEn,
                course.courseNameTh,
                course.courseDescEn or None,
                course.courseDescTh or None,
                course.faculty,
                course.department,
                str(course.credit),
                course.creditHours,
                course.studyProgram,
                academic_year,
                semester,
                grading_type(course.creditHours),
            ),
        )

        midterm_start, midterm_end = parse_exam_period(
            course.midterm.model_dump() if course.midterm else None
        )
        final_start, final_end = parse_exam_period(
            course.final.model_dump() if course.final else None
        )

        cur.execute(
            """
            SELECT id FROM course
            WHERE study_program = %s AND academic_year = %s AND semester = %s AND course_no = %s
            """,
            (
                course.studyProgram,
                academic_year,
                semester,
                course.courseNo,
            ),
        )
        existing = cur.fetchone()
        course_values = (
            course.courseCondition or None,
            midterm_start,
            midterm_end,
            final_start,
            final_end,
            course.genEdType,
        )

        if existing:
            course_id = existing[0]
            cur.execute(
                """
                UPDATE course SET
                  course_condition = %s,
                  midterm_start = %s,
                  midterm_end = %s,
                  final_start = %s,
                  final_end = %s,
                  gen_ed_type = %s,
                  updated_at = NOW()
                WHERE id = %s
                """,
                (*course_values, course_id),
            )
        else:
            course_id = generate_cuid()
            cur.execute(
                """
                INSERT INTO course (
                  id, study_program, academic_year, semester, course_no,
                  course_condition, midterm_start, midterm_end, final_start, final_end, gen_ed_type
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    course_id,
                    course.studyProgram,
                    academic_year,
                    semester,
                    course.courseNo,
                    *course_values,
                ),
            )

        cur.execute(
            "DELETE FROM course_class WHERE section_id IN (SELECT id FROM course_section WHERE course_id = %s)",
            (course_id,),
        )
        cur.execute("DELETE FROM course_section WHERE course_id = %s", (course_id,))

        for section in course.sections:
            section_id = generate_cuid()
            cur.execute(
                """
                INSERT INTO course_section (
                  id, course_id, section_no, closed, regis, max, note, gen_ed_type
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    section_id,
                    course_id,
                    int(section.sectionNo),
                    section.closed,
                    section.capacity["current"],
                    section.capacity["max"],
                    section.note,
                    section.genEdType,
                ),
            )

            for cls in section.classes:
                if cls.dayOfWeek is None:
                    continue
                cur.execute(
                    """
                    INSERT INTO course_class (
                      id, section_id, type, day_of_week, period_start, period_end,
                      building, room, professors
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        generate_cuid(),
                        section_id,
                        cls.type,
                        map_day_of_week(cls.dayOfWeek),
                        cls.period.start,
                        cls.period.end,
                        cls.building,
                        cls.room,
                        cls.teachers or [],
                    ),
                )
