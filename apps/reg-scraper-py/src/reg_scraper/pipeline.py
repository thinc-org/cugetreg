from __future__ import annotations

import logging
from datetime import UTC, datetime

from reg_scraper.config import settings
from reg_scraper.exporters.json_exporter import JsonExporter
from reg_scraper.exporters.postgres_exporter import PostgresExporter
from reg_scraper.models import Course, ScraperStatus
from reg_scraper.processors.course_html_processor import CourseHtmlProcessor
from reg_scraper.processors.enrich_processor import EnrichProcessor
from reg_scraper.receivers.reg_chula_receiver import RegChulaReceiver

logger = logging.getLogger(__name__)


class ScraperPipeline:
    """
    Orchestrates Receivers -> Processors -> Exporters.

    Receiver:  requests Session fetches Reg Chula HTML
    Processor: Parse HTML + enrich with overrides/descriptions
    Exporter:  JSON file and/or PostgreSQL upsert
    """

    def __init__(self) -> None:
        self.html_processor = CourseHtmlProcessor()
        self.enrich_processor = EnrichProcessor()

    def _write_status(self, status: ScraperStatus) -> None:
        path = settings.resolve_path(settings.scraper_status_output)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(status.model_dump_json(indent=2), encoding="utf-8")

    def _build_exporters(self):
        exporters = []
        for name in settings.exporters:
            if name == "json":
                exporters.append(JsonExporter())
            elif name == "postgres":
                exporters.append(PostgresExporter())
            else:
                logger.warning("Unknown exporter: %s", name)
        return exporters

    def run(self) -> ScraperStatus:
        started = datetime.now(tz=UTC)
        status = ScraperStatus(status="running", started_at=started)
        self._write_status(status)

        all_courses: list[Course] = []
        failed = 0

        def on_progress(done: int, total: int, course_no: str) -> None:
            self._write_status(
                ScraperStatus(
                    status="running",
                    started_at=started,
                    courses_scraped=done,
                    courses_failed=failed,
                    message=f"Fetching {course_no} ({done}/{total})",
                )
            )

        try:
            for academic_year in settings.academic_years:
                for study_program in settings.study_programs:
                    for semester in settings.semesters:
                        logger.info(
                            "Scraping %s / semester %s / year %s (max_courses=%s)",
                            study_program,
                            semester,
                            academic_year,
                            settings.max_courses if settings.max_courses > 0 else "unlimited",
                        )
                        receiver = RegChulaReceiver(
                            study_program=study_program,  # type: ignore[arg-type]
                            academic_year=academic_year,
                            semester=semester,  # type: ignore[arg-type]
                            on_progress=on_progress,
                        )
                        raw_pages = receiver.receive()

                        parsed: list[Course] = []
                        for page in raw_pages:
                            try:
                                parsed.append(self.html_processor.process(page))
                            except Exception:  # noqa: BLE001
                                failed += 1
                                logger.exception("Failed parsing course %s", page.course_no)

                        all_courses.extend(self.enrich_processor.process(parsed))

            exporters = self._build_exporters()
            for exporter in exporters:
                exporter.export(all_courses)

            finished = datetime.now(tz=UTC)
            status = ScraperStatus(
                status="completed",
                started_at=started,
                finished_at=finished,
                courses_scraped=len(all_courses),
                courses_failed=failed,
                message=f"Exported {len(all_courses)} courses via {settings.exporters}",
            )
            self._write_status(status)
            return status
        except Exception as exc:  # noqa: BLE001
            status = ScraperStatus(
                status="failed",
                started_at=started,
                finished_at=datetime.now(tz=UTC),
                courses_scraped=len(all_courses),
                courses_failed=failed,
                message=str(exc),
            )
            self._write_status(status)
            raise
