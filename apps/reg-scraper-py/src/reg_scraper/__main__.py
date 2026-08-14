from __future__ import annotations

import argparse
import logging
import sys

from reg_scraper.exporters.csv_desc_exporter import CsvDescExporter
from reg_scraper.exporters.overrides_exporter import OverridesExporter
from reg_scraper.pipeline import ScraperPipeline
from reg_scraper.receivers.cucis_receiver import CucisReceiver
from reg_scraper.receivers.gened_receiver import GenEdReceiver


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )


def run_scrape() -> int:
    pipeline = ScraperPipeline()
    status = pipeline.run()
    print(status.model_dump_json(indent=2))
    return 0 if status.status == "completed" else 1


def run_descriptions(fresh: bool, rebuild: bool) -> int:
    if rebuild:
        rows = CucisReceiver().rows_from_checkpoint()
        CsvDescExporter().export(rows)
        return 0
    ScraperPipeline().run_descriptions(fresh=fresh)
    return 0


def run_gened(fresh: bool, rebuild: bool) -> int:
    if rebuild:
        rows = GenEdReceiver().rows_from_checkpoint()
        OverridesExporter().export(rows)
        return 0
    ScraperPipeline().run_gened(fresh=fresh)
    return 0


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="CU Get Reg v2 Reg Chula scraper (Receivers/Processors/Exporters)",
    )
    parser.add_argument(
        "command",
        choices=["scrape", "descriptions", "gened"],
        help=(
            "scrape = course schedules (runs descriptions/gened first per "
            "SCRAPER_*_MODE); descriptions = CUCIS course descriptions CSV; "
            "gened = GenEd overrides.json"
        ),
    )
    parser.add_argument(
        "--fresh",
        action="store_true",
        help="Discard the checkpoint and refetch from scratch (descriptions/gened only)",
    )
    parser.add_argument(
        "--rebuild",
        action="store_true",
        help="Rebuild the output file from the existing checkpoint without any network calls",
    )
    args = parser.parse_args(argv)
    configure_logging()

    if args.command == "scrape":
        if args.fresh or args.rebuild:
            parser.error("--fresh/--rebuild apply to 'descriptions' and 'gened' only")
        raise SystemExit(run_scrape())
    if args.command == "descriptions":
        raise SystemExit(run_descriptions(args.fresh, args.rebuild))
    if args.command == "gened":
        raise SystemExit(run_gened(args.fresh, args.rebuild))


if __name__ == "__main__":
    main(sys.argv[1:])
