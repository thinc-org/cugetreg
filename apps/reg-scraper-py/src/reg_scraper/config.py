from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_APP_ROOT = Path(__file__).resolve().parents[2]
_ENV_FILE = _APP_ROOT / ".env"

SideInputMode = Literal["auto", "always", "never"]

GENED_FALLBACK_CHOICES = {"NO", "SC", "SO", "HU", "IN", "GENED", "SKIP"}

SEMESTER_TO_DIGIT = {
    "FIRST": "1",
    "SECOND": "2",
    "SUMMER": "3",
    "1": "1",
    "2": "2",
    "3": "3",
}
DIGIT_TO_SEMESTER = {"1": "FIRST", "2": "SECOND", "3": "SUMMER"}
SEMESTER_NAMES = ("FIRST", "SECOND", "SUMMER")

_LEGACY_ENV = {
    "SCRAPER_ACADEMIC_YEARS": "SCRAPER_ACADEMIC_YEAR",
    "SCRAPER_SEMESTERS": "SCRAPER_SEMESTER",
}


def _warn_legacy_env() -> None:
    import logging
    import os

    env_file_text = _ENV_FILE.read_text(encoding="utf-8") if _ENV_FILE.exists() else ""
    for old, new in _LEGACY_ENV.items():
        if os.environ.get(old) is not None or f"{old}=" in env_file_text:
            logging.getLogger(__name__).warning(
                "%s is no longer read — rename it to %s (it is being ignored)",
                old,
                new,
            )


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE) if _ENV_FILE.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )
    scraper_academic_year: str = "2568"
    scraper_semester: str = "FIRST"
    scraper_study_programs: str = "S,T,I"
    scraper_batch_size: int = 25
    scraper_delay_ms: int = 500
    scraper_max_retries: int = 10
    scraper_exporters: str = "json,postgres"
    scraper_course_nos: str = ""
    scraper_max_courses: int = 0

    course_desc_path: str = "data/course_desc.csv"
    overrides_path: str = "../../apps/core/bin/overrides.json"

    scraper_json_output: str = "../../apps/core/bin/courses.json"
    scraper_status_output: str = "../../apps/reg-scraper-py/data/scraper-status.json"

    database_url: str = "postgresql://admin:cugetreg@localhost:5432/cugetreg"

    reg_chula_base_url: str = "https://cas.reg.chula.ac.th"

    scraper_descriptions_mode: SideInputMode = "auto"
    scraper_gened_mode: SideInputMode = "auto"

    scraper_checkpoint_dir: str = "data/checkpoints"

    cucis_base_url: str = "http://cucis.academic.chula.ac.th/search/"
    cucis_total_pages: int = 1490
    cucis_delay_ms: int = 300

    gened_base_url: str = "https://gened.chula.ac.th/api"
    gened_delay_ms: int = 200
    gened_fallback_type: str = "GENED"

    @field_validator("gened_fallback_type")
    @classmethod
    def _check_gened_fallback(cls, value: str) -> str:
        normalized = value.strip().upper()
        if normalized not in GENED_FALLBACK_CHOICES:
            raise ValueError(
                f"GENED_FALLBACK_TYPE={value!r} is invalid. "
                f"Use one of {sorted(GENED_FALLBACK_CHOICES)}."
            )
        return normalized

    @field_validator("scraper_semester")
    @classmethod
    def _check_semester(cls, value: str) -> str:
        normalized = value.strip().upper()
        if normalized not in SEMESTER_TO_DIGIT:
            raise ValueError(
                f"SCRAPER_SEMESTER={value!r} is invalid. "
                f"Use one of {sorted(SEMESTER_NAMES)}."
            )
        return normalized

    @property
    def academic_years(self) -> list[str]:
        return [self.scraper_academic_year.strip()]

    @property
    def study_programs(self) -> list[str]:
        return [p.strip() for p in self.scraper_study_programs.split(",") if p.strip()]

    @property
    def semesters(self) -> list[str]:
        return [SEMESTER_TO_DIGIT[self.scraper_semester]]

    @property
    def semester_name(self) -> str:
        return DIGIT_TO_SEMESTER[SEMESTER_TO_DIGIT[self.scraper_semester]]

    @property
    def exporters(self) -> list[str]:
        return [e.strip() for e in self.scraper_exporters.split(",") if e.strip()]

    @property
    def course_nos(self) -> list[str]:
        if not self.scraper_course_nos.strip():
            return []
        return [c.strip() for c in self.scraper_course_nos.split(",") if c.strip()]

    @property
    def max_courses(self) -> int:
        return self.scraper_max_courses

    def resolve_path(self, relative: str) -> Path:
        return (_APP_ROOT / relative).resolve()

    def checkpoint_path(self, name: str) -> Path:
        return self.resolve_path(f"{self.scraper_checkpoint_dir}/{name}")


settings = Settings()
_warn_legacy_env()
