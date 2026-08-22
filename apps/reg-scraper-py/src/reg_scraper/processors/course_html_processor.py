from __future__ import annotations

import re
from datetime import datetime

from bs4 import BeautifulSoup

from reg_scraper.models import (
    ClassItem,
    Course,
    DayOfWeek,
    ExamPeriod,
    Period,
    RawCoursePage,
    Section,
    StudyProgram,
)
from reg_scraper.processors.base import Processor

THAI_MONTHS = {
    "มกราคม": 1,
    "กุมภาพันธ์": 2,
    "มีนาคม": 3,
    "เมษายน": 4,
    "พฤษภาคม": 5,
    "มิถุนายน": 6,
    "กรกฎาคม": 7,
    "สิงหาคม": 8,
    "กันยายน": 9,
    "ตุลาคม": 10,
    "พฤศจิกายน": 11,
    "ธันวาคม": 12,
    "ม.ค.": 1,
    "ก.พ.": 2,
    "มี.ค.": 3,
    "เม.ย.": 4,
    "พ.ค.": 5,
    "มิ.ย.": 6,
    "ก.ค.": 7,
    "ส.ค.": 8,
    "ก.ย.": 9,
    "ต.ค.": 10,
    "พ.ย.": 11,
    "ธ.ค.": 12,
}

MIDTERM_LABEL = "วันสอบกลางภาค"
FINAL_LABEL = "วันสอบปลายภาค"
CONDITION_LABEL = "เงื่อนไขรายวิชา"

_EXAM_RE = re.compile(
    r"(\d{1,2})\s+([^\s]+)\s+(\d{4})\s+เวลา\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})"
)
_NO_EXAM = ("TDF", "รอประกาศ", "TBA")


VALID_DAYS: set[str] = {"MO", "TU", "WE", "TH", "FR", "SA", "SU", "IA", "AR"}


def study_program_parser(value: str) -> StudyProgram:
    normalized = value.replace(" ", "")
    mapping = {
        "ทวิภาค": "S",
        "ตรีภาค": "T",
        "ทวิภาค-นานาชาติ": "I",
        "ทวิภาค–นานาชาติ": "I",
    }
    if normalized in mapping:
        return mapping[normalized]  # type: ignore[return-value]
    if "นานาชาติ" in value:
        return "I"
    return mapping.get(value, "S")  # type: ignore[return-value]


def parse_section_no(cell: str) -> str | None:
    """Extract section number; Reg Chula HTML sometimes merges cells into one string."""
    match = re.match(r"^(\d+)", cell.strip())
    return match.group(1) if match else None


def department_parser(value: str) -> str:
    match = re.search(r"\(([^)]+)\)", value)
    return match.group(1).strip() if match else value.strip()


def period_parser(value: str) -> Period:
    if value in {"IA", "AR"}:
        return Period(start=value, end=value)
    start, end = value.split("-", 1)
    if len(start) < 5:
        start = f"0{start}"
    if len(end) < 5:
        end = f"0{end}"
    return Period(start=start, end=end)


def capacity_parser(value: str) -> dict[str, int]:
    current, maximum = value.split("/", 1)
    return {"current": int(current), "max": int(maximum)}


def days_of_week_parser(value: str) -> list[DayOfWeek]:
    days = [day.strip() for day in value.split(" ") if day.strip()]
    for day in days:
        if day not in VALID_DAYS:
            raise ValueError(f"Invalid day of week: {day}")
    return days  # type: ignore[return-value]


def room_parser(value: str) -> str | None:
    return None if value == "IA" else value


def teachers_parser(value: str) -> list[str]:
    return [name.strip() for name in value.split(",") if name.strip()]


def note_parser(value: str) -> str | None:
    cleaned = re.sub(r"\s+", " ", value).strip()
    return cleaned or None


def exam_date_parser(value: str) -> ExamPeriod | None:
    """Parse one exam cell, e.g. "25 ก.ย. 2568 เวลา 8:30-11:30 น."."""
    value = re.sub(r"\s+", " ", value or "").strip()
    if not value or any(marker in value for marker in _NO_EXAM):
        return None

    match = _EXAM_RE.search(value)
    if match is None:
        return None

    day, month_name, year_be, start, end = match.groups()
    month = THAI_MONTHS.get(month_name.strip())
    if month is None:
        return None

    date = datetime(int(year_be) - 543, month, int(day))
    return ExamPeriod(
        period=period_parser(f"{start}-{end}"),
        date=date.strftime("%Y-%m-%dT00:00:00.000Z"),
    )


def exam_dates_parser(soup: BeautifulSoup) -> tuple[ExamPeriod | None, ExamPeriod | None]:
    """Read midterm/final from the exam table by their labels, not by position."""
    table = soup.select_one("#Table4")
    text = (table or soup).get_text(" ", strip=True)

    midterm_at = text.find(MIDTERM_LABEL)
    final_at = text.find(FINAL_LABEL)
    if midterm_at < 0 and final_at < 0:
        return None, None

    def value_after(label_at: int, label: str, stop: int) -> str:
        if label_at < 0:
            return ""
        chunk = text[label_at:stop] if stop > label_at else text[label_at:]
        return chunk[len(label):].lstrip(" :")

    midterm_text = value_after(midterm_at, MIDTERM_LABEL, final_at)
    final_text = value_after(final_at, FINAL_LABEL, -1)
    return exam_date_parser(midterm_text), exam_date_parser(final_text)


def course_condition_parser(soup: BeautifulSoup, fallback: str = "") -> str:
    """Read "เงื่อนไขรายวิชา :" from its label; "-" means the course has none."""
    for font in soup.find_all("font"):
        if CONDITION_LABEL not in font.get_text():
            continue
        value = font.find_next_sibling("font", attrs={"color": "#660000"})
        if value is None and font.parent is not None:
            value = font.parent.find("font", attrs={"color": "#660000"})
        if value is not None:
            return re.sub(r"\s+", " ", value.get_text(strip=True)).strip()
    return fallback


class CourseHtmlProcessor(Processor[RawCoursePage, Course]):
    """Parses Reg Chula course detail HTML into a Course model."""

    def process(self, page: RawCoursePage) -> Course:
        soup = BeautifulSoup(page.html, "html.parser")

        list1 = [
            re.sub(r"\s+", " ", font.get_text(strip=True))
            for font in soup.select('font[face="Tahoma,Verdana,Arial,Helvetica"][color="#660000"]')
        ]
        if not list1:
            raise ValueError(f"Cannot parse course header for {page.course_no}")

        course_no = list1[0]
        abbr_name = list1[1]
        course_name_en = list1[2]
        credit = float(list1[3]) if list1[3].replace(".", "", 1).isdigit() else 0.0
        credit_hours = list1[4] + (list1[5] if len(list1) > 5 else "")
        course_condition = course_condition_parser(
            soup, fallback=list1[6] if len(list1) > 6 else ""
        )
        faculty = course_no[:2]

        list2 = [
            font.get_text(strip=True)
            for font in soup.select('font[face="MS Sans Serif"][color="#660000"]')
        ]
        study_program = study_program_parser(list2[0]) if list2 else page.study_program
        course_name_th = list2[1] if len(list2) > 1 else ""
        department = department_parser(list2[2]) if len(list2) > 2 else ""
        midterm, final = exam_dates_parser(soup)

        sections: list[Section] = []
        current = Section(
            sectionNo="0",
            closed=True,
            capacity={"current": 0, "max": 0},
        )

        table = soup.select_one("#Table3")
        if table is None:
            raise ValueError(f"Missing schedule table for {page.course_no}")

        rows = table.find_all("tr")
        for idx, row in enumerate(rows):
            if idx < 2:
                continue
            cells = [re.sub(r"\s+", " ", td.get_text(strip=True)) for td in row.find_all("td")]
            if len(cells) < 2:
                continue

            section_no = parse_section_no(cells[1])
            is_section = section_no is not None
            offset = 1 if is_section else 0

            if is_section:
                closed = cells[0] != ""
                if section_no != current.sectionNo:
                    if current.sectionNo != "0":
                        sections.append(current)
                    current = Section(
                        sectionNo=section_no,
                        closed=closed,
                        capacity=capacity_parser(cells[9]) if len(cells) > 9 else {"current": 0, "max": 0},
                        note=note_parser(cells[8]) if len(cells) > 8 else None,
                    )

            type_ = cells[offset + 1] if len(cells) > offset + 1 else "LECT"
            days_raw = cells[offset + 2] if len(cells) > offset + 2 else ""
            period_raw = cells[offset + 3] if len(cells) > offset + 3 else "IA"
            building = room_parser(cells[offset + 4]) if len(cells) > offset + 4 else None
            room = room_parser(cells[offset + 5]) if len(cells) > offset + 5 else None
            teachers = teachers_parser(cells[offset + 6]) if len(cells) > offset + 6 else []
            period = period_parser(period_raw)

            try:
                days = days_of_week_parser(days_raw)
            except ValueError:
                current.classes.append(
                    ClassItem(
                        type=type_,
                        period=period,
                        building=building,
                        room=room,
                        teachers=teachers,
                    )
                )
            else:
                for day in days:
                    current.classes.append(
                        ClassItem(
                            type=type_,
                            dayOfWeek=day,
                            period=period,
                            building=building,
                            room=room,
                            teachers=teachers,
                        )
                    )

        if current.sectionNo != "0":
            sections.append(current)

        return Course(
            courseNo=course_no,
            abbrName=abbr_name,
            courseNameEn=course_name_en,
            courseNameTh=course_name_th,
            faculty=faculty,
            department=department,
            credit=credit,
            creditHours=credit_hours,
            courseCondition=course_condition,
            studyProgram=study_program,
            academicYear=page.academic_year,
            semester=page.semester,
            midterm=midterm,
            final=final,
            sections=sections,
        )
