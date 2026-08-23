from __future__ import annotations

import logging
from datetime import UTC, datetime
from itertools import groupby

from reg_scraper.config import settings
from reg_scraper.exporters.csv_desc_exporter import CsvDescExporter
from reg_scraper.exporters.json_exporter import JsonExporter
from reg_scraper.exporters.overrides_exporter import OverridesExporter
from reg_scraper.exporters.postgres_exporter import PostgresExporter
from reg_scraper.models import Course, ScrapeTarget, ScraperStatus
from reg_scraper.processors.course_html_processor import CourseHtmlProcessor
from reg_scraper.processors.enrich_processor import EnrichProcessor
from reg_scraper.receivers.cucis_receiver import CucisReceiver
from reg_scraper.receivers.gened_receiver import GenEdReceiver
from reg_scraper.receivers.reg_chula_receiver import RegChulaCheckpoint, RegChulaReceiver

logger = logging.getLogger(__name__)


class ScraperPipeline:
    """Orchestrates Receivers -> Processors -> Exporters."""

    def __init__(self) -> None:
        self.html_processor = CourseHtmlProcessor()

    def _should_run_side_input(self, mode: str, output: str, label: str) -> bool:
        if mode == "never":
            return False
        if mode == "always":
            return True

        path = settings.resolve_path(output)
        if not path.exists() or path.stat().st_size == 0:
            logger.info("%s: %s missing or empty -> scraping (mode=auto)", label, path)
            return True
        logger.info(
            "%s: reusing %s (mode=auto; set mode=always or delete the file to refresh)",
            label,
            path,
        )
        return False

    def run_descriptions(self, fresh: bool = False) -> int:
        logger.info("=== Course description phase (CUCIS) ===")
        rows = CucisReceiver().scrape(fresh=fresh)
        CsvDescExporter().export(rows)
        return len(rows)

    def run_gened(self, fresh: bool = False) -> int:
        logger.info("=== GenEd override phase (gened.chula.ac.th) ===")
        rows = GenEdReceiver().scrape(fresh=fresh)
        OverridesExporter().export(rows)
        return len(rows)

    def _run_side_inputs(self, started: datetime) -> None:
        if self._should_run_side_input(
            settings.scraper_descriptions_mode, settings.course_desc_path, "Descriptions"
        ):
            self._write_status(
                ScraperStatus(
                    status="running",
                    started_at=started,
                    message="Scraping course descriptions (CUCIS)",
                )
            )
            self.run_descriptions()

        if self._should_run_side_input(
            settings.scraper_gened_mode, settings.overrides_path, "GenEd overrides"
        ):
            self._write_status(
                ScraperStatus(
                    status="running",
                    started_at=started,
                    message="Scraping GenEd overrides (gened.chula.ac.th)",
                )
            )
            self.run_gened()

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

    def _discover_targets(
        self, started: datetime, checkpoint: RegChulaCheckpoint
    ) -> list[ScrapeTarget]:
        combos = [
            (academic_year, study_program, semester)
            for academic_year in settings.academic_years
            for study_program in settings.study_programs
            for semester in settings.semesters
        ]
        total_combos = len(combos)
        targets: list[ScrapeTarget] = []

        logger.info("=== Discovery phase (%d combinations) ===", total_combos)
        self._write_status(
            ScraperStatus(
                status="running",
                started_at=started,
                message=f"Discovering courses (0/{total_combos} combinations)",
            )
        )

        for index, (academic_year, study_program, semester) in enumerate(combos, start=1):
            logger.info(
                "Discovering %s / semester %s / year %s (%d/%d)",
                study_program,
                semester,
                academic_year,
                index,
                total_combos,
            )
            receiver = RegChulaReceiver(
                study_program=study_program,  # type: ignore[arg-type]
                academic_year=academic_year,
                semester=semester,  # type: ignore[arg-type]
                checkpoint=checkpoint,
            )
            course_nos = receiver.discover()
            for course_no in course_nos:
                targets.append(
                    ScrapeTarget(
                        course_no=course_no,
                        study_program=study_program,  # type: ignore[arg-type]
                        academic_year=academic_year,
                        semester=semester,  # type: ignore[arg-type]
                    )
                )

            self._write_status(
                ScraperStatus(
                    status="running",
                    started_at=started,
                    courses_total=len(targets),
                    message=(
                        f"Discovering courses ({index}/{total_combos} combinations, "
                        f"{len(targets)} found so far)"
                    ),
                )
            )

        logger.info("Discovery complete: %d courses to scrape", len(targets))
        return targets

    def _fetch_pages(
        self,
        targets: list[ScrapeTarget],
        started: datetime,
        checkpoint: RegChulaCheckpoint,
    ) -> None:
        """Fetch every detail page into the checkpoint."""
        total_targets = len(targets)
        scraped = checkpoint.page_count()

        def on_progress(_done: int, _total: int, course_no: str) -> None:
            nonlocal scraped
            scraped += 1
            self._write_status(
                ScraperStatus(
                    status="running",
                    started_at=started,
                    courses_total=total_targets,
                    courses_scraped=scraped,
                    message=f"Fetching {course_no} ({scraped}/{total_targets})",
                )
            )

        def combo_key(target: ScrapeTarget) -> tuple[str, str, str]:
            return (target.study_program, target.academic_year, target.semester)

        for (study_program, academic_year, semester), group in groupby(
            sorted(targets, key=combo_key), key=combo_key
        ):
            group_targets = list(group)
            logger.info(
                "Scraping %s / semester %s / year %s (%d courses)",
                study_program,
                semester,
                academic_year,
                len(group_targets),
            )
            receiver = RegChulaReceiver(
                study_program=study_program,  # type: ignore[arg-type]
                academic_year=academic_year,
                semester=semester,  # type: ignore[arg-type]
                on_progress=on_progress,
                checkpoint=checkpoint,
            )
            for _page in receiver.iter_fetch(
                [target.course_no for target in group_targets]
            ):
                pass

    def _parse_pages(
        self,
        started: datetime,
        checkpoint: RegChulaCheckpoint,
        enrich_processor: EnrichProcessor,
        courses_total: int,
    ) -> tuple[list[Course], int]:
        logger.info("=== Parsing phase ===")
        self._write_status(
            ScraperStatus(
                status="running",
                started_at=started,
                courses_total=courses_total,
                message="Parsing scraped pages",
            )
        )

        parsed: list[Course] = []
        failed = 0
        for page in checkpoint.iter_pages():
            try:
                parsed.append(self.html_processor.process(page))
            except Exception:  # noqa: BLE001
                failed += 1
                logger.exception("Failed parsing course %s", page.course_no)

        logger.info("Parsed %d courses (%d failed)", len(parsed), failed)
        return enrich_processor.process(parsed), failed

    def run(self, fresh: bool = False, rebuild: bool = False) -> ScraperStatus:
        started = datetime.now(tz=UTC)
        status = ScraperStatus(status="running", started_at=started)
        self._write_status(status)

        checkpoint = RegChulaCheckpoint(
            academic_year=settings.academic_years[0],
            semester=settings.semesters[0],
        )

        all_courses: list[Course] = []
        failed = 0

        try:
            self._run_side_inputs(started)
            # after the side inputs, so it picks up the files they just wrote
            enrich_processor = EnrichProcessor()

            if rebuild:
                logger.info("--rebuild: exporting from the checkpoint, no network calls")
                total_targets = checkpoint.page_count()
                if total_targets == 0:
                    raise RuntimeError(
                        f"--rebuild needs a checkpoint, but {checkpoint.pages_path} "
                        f"is empty or missing. Run a normal scrape first."
                    )
            else:
                checkpoint.prepare(fresh=fresh)
                targets = self._discover_targets(started, checkpoint)
                total_targets = len(targets)

                self._write_status(
                    ScraperStatus(
                        status="running",
                        started_at=started,
                        courses_total=total_targets,
                        message=f"Found {total_targets} courses. Starting scrape...",
                    )
                )
                logger.info("=== Scraping phase (%d courses) ===", total_targets)
                self._fetch_pages(targets, started, checkpoint)

            all_courses, failed = self._parse_pages(
                started, checkpoint, enrich_processor, total_targets
            )

            for exporter in self._build_exporters():
                exporter.export(all_courses)

            if not rebuild:
                checkpoint.clear()

            finished = datetime.now(tz=UTC)
            status = ScraperStatus(
                status="completed",
                started_at=started,
                finished_at=finished,
                courses_total=total_targets,
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
        finally:
            checkpoint.close()
