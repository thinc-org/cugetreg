from __future__ import annotations

import argparse
import logging
import sys

from reg_scraper.pipeline import ScraperPipeline


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


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="CU Get Reg v2 Reg Chula scraper (Receivers/Processors/Exporters)",
    )
    parser.add_argument(
        "command",
        choices=["scrape"],
        help="Pipeline command",
    )
    args = parser.parse_args(argv)
    configure_logging()

    if args.command == "scrape":
        raise SystemExit(run_scrape())


if __name__ == "__main__":
    main(sys.argv[1:])
