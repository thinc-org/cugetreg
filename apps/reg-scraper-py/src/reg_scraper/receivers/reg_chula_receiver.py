from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Callable

import requests
import urllib3
from bs4 import BeautifulSoup

from reg_scraper.config import settings
from reg_scraper.models import RawCoursePage, Semester, StudyProgram
from reg_scraper.receivers.base import Receiver

urllib3.disable_warnings()

logger = logging.getLogger(__name__)

FORM_PATH = (
    "/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.QueryCourseScheduleNewServlet"
)
COURSE_LIST_PATH = (
    "/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet"
)
COURSE_DETAIL_PATH = (
    "/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseScheduleDtlNewServlet"
)

FACULTIES = [
    "01", "02", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
    "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
    "51", "53", "55", "56", "58",
]


def create_session() -> requests.Session:
    session = requests.Session()
    session.verify = False
    session.headers.update({"User-Agent": "Mozilla/5.0"})
    return session


def faculty_list_params(
    study_program: str, semester: str, academic_year: str, faculty: str
) -> dict[str, str]:
    return {
        "studyProgram": study_program,
        "semester": semester,
        "acadyearEfd": academic_year,
        "courseno": faculty,
        "coursename": "",
        "faculty": faculty,
        "examdate": "",
        "examstart": "",
        "examend": "",
        "coursetype": "0",
        "genedcode": "",
        "cursemester": semester,
        "curacadyear": academic_year,
        "acadyear": academic_year,
        "lang": "T",
        "activestatus": "ON",
        "download": "download",
    }


def course_list_params(
    course_no: str, study_program: str, semester: str, academic_year: str
) -> dict[str, str]:
    """Same as chula_final.py get_course_list params."""
    faculty = course_no[:2] if len(course_no) >= 2 else ""
    return {
        "studyProgram": study_program,
        "semester": semester,
        "acadyearEfd": academic_year,
        "courseno": course_no,
        "coursename": "",
        "faculty": faculty,
        "examdate": "",
        "examstart": "",
        "examend": "",
        "coursetype": "0",
        "genedcode": "",
        "cursemester": semester,
        "curacadyear": academic_year,
        "acadyear": academic_year,
        "lang": "T",
        "activestatus": "ON",
        "download": "download",
    }


def detail_params(course_no: str, study_program: str) -> dict[str, str]:
    """Detail link from Reg Chula only uses courseNo + studyProgram."""
    return {
        "courseNo": course_no,
        "studyProgram": study_program,
    }


def is_error_page(html: str) -> bool:
    return "#660000" not in html or "Table3" not in html


@dataclass
class RegChulaReceiver(Receiver[list[RawCoursePage]]):
    """
    Fetches Reg Chula HTML via requests Session (same flow as chula_final.py):
    1. Open form page (cookies)
    2. List search for course/semester (required before detail!)
    3. Detail fetch with courseNo + studyProgram only
    """

    study_program: StudyProgram
    academic_year: str
    semester: Semester
    course_nos: list[str] = field(default_factory=list)
    on_progress: Callable[[int, int, str], None] | None = None

    def _base(self) -> str:
        return settings.reg_chula_base_url.rstrip("/")

    def _init_session(self, session: requests.Session) -> None:
        session.get(f"{self._base()}{FORM_PATH}", timeout=30)

    def _search_course_list(self, session: requests.Session, course_no: str) -> bool:
        """Run list search for one course — sets session context for detail page."""
        response = session.get(
            f"{self._base()}{COURSE_LIST_PATH}",
            params=course_list_params(
                course_no, self.study_program, self.semester, self.academic_year
            ),
            timeout=30,
        )
        response.encoding = "tis-620"
        soup = BeautifulSoup(response.text, "html.parser")
        for anchor in soup.find_all("a", href=True):
            if "CourseScheduleDtlNewServlet" in anchor["href"]:
                if anchor.get_text(strip=True) == course_no:
                    return True
        return False

    def discover_course_nos(self, session: requests.Session) -> list[str]:
        base = self._base()
        course_nos: list[str] = []

        for faculty in FACULTIES:
            response = session.get(
                f"{base}{COURSE_LIST_PATH}",
                params=faculty_list_params(
                    self.study_program, self.semester, self.academic_year, faculty
                ),
                timeout=30,
            )
            response.encoding = "tis-620"
            soup = BeautifulSoup(response.text, "html.parser")

            for anchor in soup.find_all("a", href=True):
                href = anchor["href"]
                if "CourseScheduleDtlNewServlet" not in href:
                    continue
                text = anchor.get_text(strip=True)
                if text:
                    course_nos.append(text)

            logger.info("Faculty %s → %d courses so far", faculty, len(course_nos))

        unique = list(dict.fromkeys(course_nos))
        logger.info("Discovered %d unique courses", len(unique))
        return unique

    def fetch_course_html(self, session: requests.Session, course_no: str) -> str:
        base = self._base()
        last_error: Exception | None = None

        if not self._search_course_list(session, course_no):
            raise RuntimeError(
                f"Course {course_no} not found for "
                f"{self.study_program}/semester {self.semester}/{self.academic_year}. "
                f"Check SCRAPER_SEMESTERS and SCRAPER_ACADEMIC_YEARS in .env"
            )

        for attempt in range(settings.scraper_max_retries):
            try:
                response = session.get(
                    f"{base}{COURSE_DETAIL_PATH}",
                    params=detail_params(course_no, self.study_program),
                    timeout=30,
                )
                response.encoding = "tis-620"
                html = response.text
                if not html.strip():
                    raise ValueError("empty response")
                if is_error_page(html):
                    raise ValueError(
                        f"Reg Chula returned error page for {course_no} "
                        f"(semester {self.semester}, year {self.academic_year})"
                    )
                return html
            except Exception as exc:  # noqa: BLE001
                last_error = exc
                time.sleep(0.3 * (attempt + 1))

        raise RuntimeError(
            f"Failed to fetch course {course_no} after retries: {last_error}"
        )

    def receive(self) -> list[RawCoursePage]:
        session = create_session()
        pages: list[RawCoursePage] = []

        try:
            self._init_session(session)

            if settings.course_nos:
                self.course_nos = settings.course_nos
                logger.info("Using %d course numbers from SCRAPER_COURSE_NOS", len(self.course_nos))
            elif not self.course_nos:
                self.course_nos = self.discover_course_nos(session)

            if settings.max_courses > 0:
                self.course_nos = self.course_nos[: settings.max_courses]
                logger.info("Limited to first %d courses (SCRAPER_MAX_COURSES)", len(self.course_nos))

            total = len(self.course_nos)
            for index, course_no in enumerate(self.course_nos, start=1):
                logger.info("[%d/%d] Fetching %s", index, total, course_no)
                try:
                    html = self.fetch_course_html(session, course_no)
                except RuntimeError as exc:
                    logger.error("%s", exc)
                    continue

                pages.append(
                    RawCoursePage(
                        course_no=course_no,
                        study_program=self.study_program,
                        academic_year=self.academic_year,
                        semester=self.semester,
                        html=html,
                    )
                )
                if self.on_progress:
                    self.on_progress(index, total, course_no)
                time.sleep(settings.scraper_delay_ms / 1000)
        finally:
            session.close()

        return pages
