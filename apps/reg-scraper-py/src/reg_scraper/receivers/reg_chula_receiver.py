from __future__ import annotations

import base64
import gzip
import json
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Iterator, TextIO

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

DISCOVERY_CHECKPOINT_NAME = "regchula_discovery_checkpoint.jsonl"
PAGES_CHECKPOINT_NAME = "regchula_pages_checkpoint.jsonl"

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
    return {
        "courseNo": course_no,
        "studyProgram": study_program,
    }


def is_error_page(html: str) -> bool:
    return "#660000" not in html or "Table3" not in html


def _pack_html(html: str) -> str:
    return base64.b64encode(gzip.compress(html.encode("utf-8"), 6)).decode("ascii")


def _unpack_html(packed: str) -> str:
    return gzip.decompress(base64.b64decode(packed)).decode("utf-8")


@dataclass
class RegChulaCheckpoint:
    """Resume files for the Reg Chula phase — see README, "Resuming an interrupted scrape"."""

    academic_year: str
    semester: str
    _pages_handle: TextIO | None = field(default=None, init=False, repr=False)

    @property
    def discovery_path(self) -> Path:
        return settings.checkpoint_path(DISCOVERY_CHECKPOINT_NAME)

    @property
    def pages_path(self) -> Path:
        return settings.checkpoint_path(PAGES_CHECKPOINT_NAME)

    def prepare(self, fresh: bool = False) -> None:
        self.discovery_path.parent.mkdir(parents=True, exist_ok=True)

        if fresh:
            if self._exists():
                logger.info("--fresh: discarding the Reg Chula checkpoint")
            self.clear()
            return

        if not self._exists():
            return

        age_hours = (time.time() - self._modified_at()) / 3600
        ttl = settings.scraper_regchula_checkpoint_ttl_hours
        if ttl > 0 and age_hours > ttl:
            logger.info(
                "Reg Chula checkpoint is %.1f h old (TTL %d h) — discarding it and "
                "scraping fresh. Raise SCRAPER_REGCHULA_CHECKPOINT_TTL_HOURS to keep "
                "older checkpoints.",
                age_hours,
                ttl,
            )
            self.clear()
            return

        pages = self.page_count()
        logger.info(
            "Resuming the Reg Chula checkpoint (last written %s, %.1f h ago, "
            "%d course pages already fetched). Re-run with --fresh to discard it.",
            time.strftime("%Y-%m-%d %H:%M", time.localtime(self._modified_at())),
            age_hours,
            pages,
        )

    def clear(self) -> None:
        self.close()
        for path in (self.discovery_path, self.pages_path):
            path.unlink(missing_ok=True)

    def close(self) -> None:
        if self._pages_handle is not None:
            self._pages_handle.close()
            self._pages_handle = None

    def _exists(self) -> bool:
        return self.discovery_path.exists() or self.pages_path.exists()

    def _modified_at(self) -> float:
        return max(
            path.stat().st_mtime
            for path in (self.discovery_path, self.pages_path)
            if path.exists()
        )

    def _in_scope(self, record: dict) -> bool:
        return (
            record.get("academic_year") == self.academic_year
            and record.get("semester") == self.semester
        )

    def _read(self, path: Path) -> Iterator[dict]:
        if not path.exists():
            return
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                try:
                    record = json.loads(line)
                except Exception:  # noqa: BLE001 - truncated final line after a kill
                    continue
                if self._in_scope(record):
                    yield record

    def discovered_course_nos(self, study_program: str) -> list[str] | None:
        for record in self._read(self.discovery_path):
            if record.get("study_program") == study_program:
                return list(record.get("course_nos") or [])
        return None

    def record_discovery(self, study_program: str, course_nos: list[str]) -> None:
        self.discovery_path.parent.mkdir(parents=True, exist_ok=True)
        with self.discovery_path.open("a", encoding="utf-8") as handle:
            handle.write(
                json.dumps(
                    {
                        "study_program": study_program,
                        "academic_year": self.academic_year,
                        "semester": self.semester,
                        "course_nos": course_nos,
                    },
                    ensure_ascii=False,
                )
                + "\n"
            )
            handle.flush()

    def completed_course_nos(self, study_program: str) -> set[str]:
        return {
            record["course_no"]
            for record in self._read(self.pages_path)
            if record.get("study_program") == study_program and record.get("course_no")
        }

    def page_count(self) -> int:
        return sum(1 for _ in self._read(self.pages_path))

    def record_page(self, page: RawCoursePage) -> None:
        if self._pages_handle is None:
            self.pages_path.parent.mkdir(parents=True, exist_ok=True)
            self._pages_handle = self.pages_path.open("a", encoding="utf-8")
        self._pages_handle.write(
            json.dumps(
                {
                    "course_no": page.course_no,
                    "study_program": page.study_program,
                    "academic_year": page.academic_year,
                    "semester": page.semester,
                    "html_gz": _pack_html(page.html),
                },
                ensure_ascii=False,
            )
            + "\n"
        )
        self._pages_handle.flush()

    def iter_pages(self) -> Iterator[RawCoursePage]:
        seen: set[tuple[str, str]] = set()
        for record in self._read(self.pages_path):
            key = (record.get("study_program", ""), record.get("course_no", ""))
            if not key[1] or key in seen:
                continue
            seen.add(key)
            html = record.get("html_gz")
            yield RawCoursePage(
                course_no=record["course_no"],
                study_program=record["study_program"],
                academic_year=record["academic_year"],
                semester=record["semester"],
                html=_unpack_html(html) if html else record.get("html", ""),
            )


@dataclass
class RegChulaReceiver(Receiver[list[RawCoursePage]]):
    """Open the form page for cookies, run a list search, then fetch details."""

    study_program: StudyProgram
    academic_year: str
    semester: Semester
    course_nos: list[str] = field(default_factory=list)
    on_progress: Callable[[int, int, str], None] | None = None
    checkpoint: RegChulaCheckpoint | None = None

    def _base(self) -> str:
        return settings.reg_chula_base_url.rstrip("/")

    def _init_session(self, session: requests.Session) -> None:
        session.get(f"{self._base()}{FORM_PATH}", timeout=30)

    def _search_course_list(self, session: requests.Session, course_no: str) -> bool:
        """The list search sets the session context the detail page needs."""
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

    def discover(self) -> list[str]:
        if self.checkpoint is not None:
            cached = self.checkpoint.discovered_course_nos(self.study_program)
            if cached is not None:
                logger.info(
                    "Discovery for %s reused from checkpoint (%d courses)",
                    self.study_program,
                    len(cached),
                )
                self.course_nos = cached
                return cached

        session = create_session()
        try:
            self._init_session(session)

            if settings.course_nos:
                course_nos = list(settings.course_nos)
                logger.info(
                    "Using %d course numbers from SCRAPER_COURSE_NOS", len(course_nos)
                )
            else:
                course_nos = self.discover_course_nos(session)

            if settings.max_courses > 0:
                course_nos = course_nos[: settings.max_courses]
                logger.info(
                    "Limited to first %d courses (SCRAPER_MAX_COURSES)", len(course_nos)
                )

            self.course_nos = course_nos
            if self.checkpoint is not None:
                self.checkpoint.record_discovery(self.study_program, course_nos)
            return course_nos
        finally:
            session.close()

    def iter_fetch(self, course_nos: list[str] | None = None) -> Iterator[RawCoursePage]:
        """Yield one page at a time, checkpointing each before handing it on."""
        course_nos = course_nos if course_nos is not None else self.course_nos
        done = (
            self.checkpoint.completed_course_nos(self.study_program)
            if self.checkpoint is not None
            else set()
        )
        pending = [course_no for course_no in course_nos if course_no not in done]

        total = len(course_nos)
        index = total - len(pending)
        if index:
            logger.info(
                "%d/%d courses for %s already in the checkpoint — fetching the remaining %d",
                index,
                total,
                self.study_program,
                len(pending),
            )

        session = create_session()
        consecutive_failures = 0
        limit = settings.scraper_max_consecutive_failures
        try:
            self._init_session(session)

            for course_no in pending:
                index += 1
                logger.info("[%d/%d] Fetching %s", index, total, course_no)
                try:
                    html = self.fetch_course_html(session, course_no)
                except RuntimeError as exc:
                    logger.error("%s", exc)
                    consecutive_failures += 1
                    if 0 < limit <= consecutive_failures:
                        raise RuntimeError(
                            f"Aborting: {consecutive_failures} courses in a row failed "
                            f"to fetch — Reg Chula looks unreachable. "
                            f"{index - consecutive_failures}/{total} courses are saved "
                            f"in the checkpoint; re-run to resume from there."
                        ) from exc
                    continue
                consecutive_failures = 0

                page = RawCoursePage(
                    course_no=course_no,
                    study_program=self.study_program,
                    academic_year=self.academic_year,
                    semester=self.semester,
                    html=html,
                )
                if self.checkpoint is not None:
                    self.checkpoint.record_page(page)
                yield page

                if self.on_progress:
                    self.on_progress(index, total, course_no)
                time.sleep(settings.scraper_delay_ms / 1000)
        finally:
            session.close()

    def fetch(self, course_nos: list[str] | None = None) -> list[RawCoursePage]:
        return list(self.iter_fetch(course_nos))

    def receive(self) -> list[RawCoursePage]:
        return self.fetch(self.discover())
