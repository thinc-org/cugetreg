import unittest

from reg_scraper.exporters.postgres_exporter import normalize_class_period


class ClassPeriodTests(unittest.TestCase):
    def test_matches_importer_corrections(self):
        cases = (
            (("17:00", "12:00"), ("12:00", "17:00")),
            (("80:00", "11:00"), ("08:00", "11:00")),
            (("90:00", "08:00"), ("08:00", "09:00")),
            (("07:00", "90:00"), ("07:00", "09:00")),
            (("08:00", "11:00"), ("08:00", "11:00")),
            (("IA", "IA"), ("IA", "IA")),
            (("AR", "AR"), ("AR", "AR")),
        )
        for original, expected in cases:
            with self.subTest(period=original):
                self.assertEqual(normalize_class_period(*original), expected)
