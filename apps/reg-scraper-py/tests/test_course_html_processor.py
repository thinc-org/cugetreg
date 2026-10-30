import unittest

from reg_scraper.processors.course_html_processor import department_parser


class DepartmentParserTests(unittest.TestCase):
    def test_preserves_nested_international_program_parentheses(self):
        department = "สาขาวิชาวิศวกรรมหุ่นยนต์และปัญญาประดิษฐ์(นานาชาติ)"
        source = f"คณะวิศวกรรมศาสตร์\xa0(\xa0{department}\xa0)"
        self.assertEqual(department_parser(source), department)

    def test_preserves_multiple_nested_levels(self):
        self.assertEqual(
            department_parser("Faculty (Department (Program (International)))"),
            "Department (Program (International))",
        )

    def test_extracts_ordinary_department(self):
        self.assertEqual(
            department_parser("คณะวิศวกรรมศาสตร์ ( ภาควิชาวิศวกรรมคอมพิวเตอร์ )"),
            "ภาควิชาวิศวกรรมคอมพิวเตอร์",
        )

    def test_stops_at_matching_outer_parenthesis(self):
        self.assertEqual(
            department_parser("Faculty (Department (International)) (Other note)"),
            "Department (International)",
        )

    def test_keeps_department_without_parentheses(self):
        self.assertEqual(
            department_parser("  ภาควิชาวิศวกรรมคอมพิวเตอร์  "),
            "ภาควิชาวิศวกรรมคอมพิวเตอร์",
        )

    def test_keeps_incomplete_groups_without_truncating(self):
        for source in ("Faculty (Department", "Faculty (Department (International)"):
            with self.subTest(source=source):
                self.assertEqual(department_parser(source), source)

    def test_handles_empty_value(self):
        self.assertEqual(department_parser(""), "")


if __name__ == "__main__":
    unittest.main()
