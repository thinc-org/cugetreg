import unittest
from unittest.mock import Mock, patch

import requests

from reg_scraper.receivers import reg_chula_receiver as receiver_module


def detail(course, *, term="ภาคการศึกษาต้น", year="2568", program="ทวิภาค"):
    return (
        f"ปีการศึกษา {year}/{term}"
        f'<FONT COLOR="#660000" FACE="MS Sans Serif">{program}</FONT>'
        f'<FONT COLOR="#660000" FACE="Tahoma,Verdana,Arial,Helvetica">{course}</FONT>'
        '<TABLE ID="Table3"></TABLE>'
    )


class RegChulaSessionTests(unittest.TestCase):
    def fetch(self, detail_responses):
        session = Mock(spec=requests.Session)
        responses = iter(detail_responses)
        calls = []

        def get(url, *, params=None, timeout):
            if url.endswith(receiver_module.FORM_PATH):
                calls.append("form")
                return Mock(text="")
            if url.endswith(receiver_module.COURSE_LIST_PATH):
                course = params["courseno"]
                calls.append(f"search:{course}")
                return Mock(text=f'<a href="CourseScheduleDtlNewServlet">{course}</a>')
            self.assertTrue(url.endswith(receiver_module.COURSE_DETAIL_PATH))
            calls.append(f"detail:{params['courseNo']}")
            response = next(responses)
            if isinstance(response, Exception):
                raise response
            return Mock(text=response)

        session.get.side_effect = get
        receiver = receiver_module.RegChulaReceiver("S", "2568", "1")
        with patch.object(receiver_module, "create_session", return_value=session), patch.object(
            receiver_module.time, "sleep"
        ):
            pages = receiver.fetch(["2110101", "2301107"])
        session.close.assert_called_once()
        return calls, pages

    def test_searches_once_then_uses_direct_detail(self):
        calls, pages = self.fetch([detail("2110101"), detail("2301107")])
        self.assertEqual(calls, ["form", "search:2110101", "detail:2110101", "detail:2301107"])
        self.assertEqual([page.course_no for page in pages], ["2110101", "2301107"])

    def test_retries_direct_failure_or_wrong_page_after_search(self):
        for wrong in (
            requests.Timeout(), "invalid page", detail("2110101"),
            detail("2301107", term="ภาคการศึกษาปลาย"),
            detail("2301107", year="2569"), detail("2301107", program="ตรีภาค"),
        ):
            with self.subTest(response=wrong):
                expected = detail("2301107")
                calls, pages = self.fetch([detail("2110101"), wrong, expected])
                self.assertEqual(calls[-3:], ["detail:2301107", "search:2301107", "detail:2301107"])
                self.assertEqual(pages[-1].html, expected)

    def test_keeps_searching_if_first_page_has_no_readable_scope(self):
        calls, pages = self.fetch(['#660000 <TABLE ID="Table3">', detail("2301107")])
        self.assertEqual(calls[-2:], ["search:2301107", "detail:2301107"])
        self.assertEqual(len(pages), 2)
