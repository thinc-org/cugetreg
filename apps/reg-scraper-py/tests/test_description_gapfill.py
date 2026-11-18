"""Offline regression checks: python -m unittest discover -s tests -v."""

import csv
import json
import tempfile
import unittest
from datetime import UTC, datetime
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from reg_scraper.config import settings
from reg_scraper.exporters.csv_desc_exporter import FIELDNAMES, CsvDescExporter
from reg_scraper.pipeline import ScraperPipeline
from reg_scraper.receivers.cucis_receiver import CucisReceiver


class DescriptionGapfillTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        root = Path(temporary.name)
        self.csv_path = root / "descriptions.csv"
        config = patch.multiple(
            settings,
            course_desc_path=str(self.csv_path),
            scraper_checkpoint_dir=str(root),
            scraper_descriptions_mode="auto",
            scraper_descriptions_gapfill=True,
        )
        config.start()
        self.addCleanup(config.stop)
        network = patch(
            "requests.sessions.Session.request",
            side_effect=AssertionError("Regression tests must not use the network"),
        )
        network.start()
        self.addCleanup(network.stop)
        self.row = {
            "code": "2110101",
            "desc_th": "Thai description",
            "desc_en": "English description",
        }

    def checkpoint_hit(self):
        CucisReceiver().gapfill_checkpoint.write_text(
            json.dumps({"code": self.row["code"], "found": True, "row": self.row})
            + "\n",
            encoding="utf-8",
        )

    def read_rows(self):
        with self.csv_path.open(encoding="utf-8-sig", newline="") as handle:
            return list(csv.DictReader(handle))

    def test_append_preserves_languages_and_deduplicates(self):
        exporter = CsvDescExporter()
        exporter.export([{"code": "2301101"}])
        self.assertEqual(exporter.append([self.row, self.row]), 1)
        self.assertEqual(exporter.append([self.row]), 0)
        rows = self.read_rows()
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[1]["description_thai"], "Thai description")
        self.assertEqual(rows[1]["description"], "English description")

    def test_append_rejects_incompatible_headers_without_changing_file(self):
        reordered = FIELDNAMES.copy()
        reordered[1], reordered[2] = reordered[2], reordered[1]
        for header in (reordered, FIELDNAMES[:-1], FIELDNAMES + ["extra"]):
            with self.subTest(header=header):
                with self.csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
                    writer = csv.writer(handle)
                    writer.writerow(header)
                original = self.csv_path.read_bytes()
                with self.assertRaisesRegex(ValueError, "exact column order"):
                    CsvDescExporter().append([self.row])
                self.assertEqual(self.csv_path.read_bytes(), original)

    def test_append_initializes_empty_csv(self):
        self.csv_path.touch()
        self.assertEqual(CsvDescExporter().existing_course_nos(), set())
        self.assertEqual(CsvDescExporter().append([self.row]), 1)
        self.assertEqual(self.read_rows()[0]["course_no"], self.row["code"])

    def test_pipeline_restores_checkpoint_hit_without_refetching(self):
        self.checkpoint_hit()
        CsvDescExporter().export([{"code": "2301101"}])
        courses = [SimpleNamespace(courseNo=self.row["code"])]
        with patch.object(CucisReceiver, "fill_gaps") as fetch:
            pipeline = ScraperPipeline()
            pipeline._fill_description_gaps(courses, datetime.now(tz=UTC))
            pipeline._fill_description_gaps(courses, datetime.now(tz=UTC))
            fetch.assert_not_called()
        rows = self.read_rows()
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[1]["description"], "English description")

    def test_pipeline_restores_checkpoint_when_csv_is_missing(self):
        self.checkpoint_hit()
        with patch.object(CucisReceiver, "fill_gaps") as fetch:
            ScraperPipeline()._fill_description_gaps(
                [SimpleNamespace(courseNo=self.row["code"])], datetime.now(tz=UTC)
            )
            fetch.assert_not_called()
        self.assertEqual(self.read_rows()[0]["description"], "English description")

    def test_pipeline_rejects_bad_header_before_lookup(self):
        self.csv_path.write_text("course_no,description,description_thai\n")
        with patch.object(CucisReceiver, "fill_gaps") as fetch:
            with self.assertRaisesRegex(ValueError, "exact column order"):
                ScraperPipeline()._fill_description_gaps(
                    [SimpleNamespace(courseNo=self.row["code"])], datetime.now(tz=UTC)
                )
            fetch.assert_not_called()


if __name__ == "__main__":
    unittest.main()
