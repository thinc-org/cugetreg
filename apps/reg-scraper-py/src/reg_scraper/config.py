from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_APP_ROOT = Path(__file__).resolve().parents[2]
_ENV_FILE = _APP_ROOT / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE) if _ENV_FILE.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )
    scraper_academic_years: str = "2568"
    scraper_study_programs: str = "S,T,I"
    scraper_semesters: str = "1,2"
    scraper_batch_size: int = 25
    scraper_delay_ms: int = 500
    scraper_max_retries: int = 10
    scraper_exporters: str = "json,postgres"
    scraper_course_nos: str = ""
    scraper_max_courses: int = 0

    course_desc_path: str = ""
    overrides_path: str = "../../packages/database/data/overrides.json"

    scraper_json_output: str = "../../packages/database/data/courses.json"
    scraper_status_output: str = "../../packages/database/data/scraper-status.json"

    database_url: str = "postgresql://cugetreg:cugetreg@localhost:5432/cugetreg"

    reg_chula_base_url: str = "https://cas.reg.chula.ac.th"

    @property
    def academic_years(self) -> list[str]:
        return [y.strip() for y in self.scraper_academic_years.split(",") if y.strip()]

    @property
    def study_programs(self) -> list[str]:
        return [p.strip() for p in self.scraper_study_programs.split(",") if p.strip()]

    @property
    def semesters(self) -> list[str]:
        return [s.strip() for s in self.scraper_semesters.split(",") if s.strip()]

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


settings = Settings()
