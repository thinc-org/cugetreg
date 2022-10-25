import os
from bs4 import BeautifulSoup
import requests
import csv
import argparse
import pathlib

s = requests.Session()

COURSE_SEARCH_URL = "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet"
def fetch_html_course_search(gened_code: int, study_program: str):
  # fetch once to receive cookies
  s.get(COURSE_SEARCH_URL, verify=False)

  html = s.get(COURSE_SEARCH_URL, params={
    "studyProgram": study_program,
    "semester": semester,
    "acadyear": academic_year,
    "submit.x": "38",
    "genedcode": gened_code
  }, verify=False).text
  return BeautifulSoup(html, features="html.parser")

parser = argparse.ArgumentParser()
parser.add_argument("-sp", "--study-programs", nargs="+", choices=['S', 'I'], required=True, help="filters study program: S for Semester, I for International. Can specify multiple programs.")
parser.add_argument("-s", "--semester", choices=['1', '2', '3'], required=True, help="filters semester: 1, 2, or 3")
parser.add_argument("-y", "--academic-year", required=True, help='filters academic year e.g. 2563')
args = vars(parser.parse_args())

study_programs = args["study_programs"]
semester = args["semester"]
academic_year = args["academic_year"]
GENED_NAME = ["", "SO", "HU", "SC", "IN"]

output_dir = os.path.join(os.path.dirname(__file__), 'output')
os.makedirs(output_dir, exist_ok=True)
with open(f"{output_dir}/gened_courses.csv", mode="w", encoding="utf8") as outFile:
  writer = csv.DictWriter(outFile, fieldnames=["courseNo","abbrName","genEdType","studyProgram","academicYear","semester","sections"])
  writer.writeheader()
  for study_program in study_programs:
    for gened_code in range(1, 5):
      soup = fetch_html_course_search(gened_code, study_program)
      table = soup.find("table", { "id": "Table4" })
      for row in table.findChildren("tr"):
        fontList = row.find_all("font")
        if len(fontList) == 0:
          continue
        course_no, _, abbr_name = fontList
        course_no = course_no.text.strip()
        abbr_name = abbr_name.text.strip()
        print(course_no, abbr_name, GENED_NAME[gened_code], study_program, academic_year, semester)
        writer.writerow({
          "courseNo": course_no,
          "abbrName": abbr_name,
          "genEdType": GENED_NAME[gened_code],
          "studyProgram": study_program,
          "academicYear": academic_year,
          "semester": semester,
          "sections": ""
        })
  outFile.write("") # newline EOF
