import argparse
import csv
import requests

parser = argparse.ArgumentParser()
parser.add_argument("-e", "--env", choices=['production', 'beta', 'dev'], required=True, help="environment to upload overrides to. Can be 'production', 'beta', or 'dev'.")
parser.add_argument("-f", "--file", required=True, help="sections file to upload overrides from")
parser.add_argument("-t", "--token", required=True, help='admin token to authenticate with')
args = vars(parser.parse_args())

env = args["env"]
sections_file = args["file"]
admin_token = args["token"]
match env:
  case "production":
    api_url = "https://cugetreg.com/_api/graphql"
  case "beta":
    api_url = "https://beta.cugetreg.com/_api/graphql"
  case "dev":
    api_url = "https://dev.cugetreg.com/_api/graphql"
  case _:
    raise Exception("Invalid environment")

with open(sections_file, mode="r", encoding="utf8") as csvFile:
  csvReader = csv.DictReader(csvFile)
  print("Connecting to", api_url)
  for row in csvReader:
    courseNo = row["courseNo"].strip()
    studyProgram = row["studyProgram"].strip()
    genEdType = row["genEdType"].strip()
    semester = row["semester"].strip()
    academicYear = row["academicYear"].strip()

    sectionGroups = row["sections"].strip().split(",")
    sections = []
    for sectionGroup in sectionGroups:
      if "-" in sectionGroup:
        sectionGroup = sectionGroup.split("-")
        for section in range(int(sectionGroup[0]), int(sectionGroup[1]) + 1):
          sections.append(str(section))
      else:
        sections.append(sectionGroup)
    headers = {
        "Authorization": f"Bearer {admin_token}",
        "Content-Type": "application/json"
    }
    data = {
      "query": """
        mutation createOrUpdateOverride($override: OverrideInput!) {
          createOrUpdateOverride(override: $override) {
            courseNo
            studyProgram
            semester
            academicYear
            genEd {
              genEdType
              sections
            }
          }
        }
      """,
      "variables": {
        "override": {
          "courseNo": courseNo,
          "studyProgram": studyProgram,
          "semester": semester,
          "academicYear": academicYear,
          "genEd": {
            "genEdType": genEdType,
            "sections": sections,
          }
        }
      }
    }
    print('Updating', courseNo, studyProgram, genEdType, sections, academicYear, semester)
    r = requests.post(api_url, headers=headers, json=data)
    if r.status_code != 200:
      print(f"ERROR ({courseNo}): {r.content}") 
      break
