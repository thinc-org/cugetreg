import argparse
import csv
import requests

parser = argparse.ArgumentParser()
parser.add_argument(
    "-e",
    "--envs",
    nargs="+",
    choices=["production", "beta", "dev"],
    required=True,
    help="environments to upload overrides to. Can be 'production', 'beta', or 'dev'. Can specify multiple environments.",
)
parser.add_argument(
    "-f", "--file", required=True, help="sections file to upload overrides from"
)
parser.add_argument(
    "-t", "--token", required=True, help="admin token to authenticate with"
)
args = vars(parser.parse_args())

envs: list[str] = args["envs"]
sections_file: str = args["file"]
admin_token: str = args["token"]
api_urls = {
    "production": "https://cugetreg.com/_api/graphql",
    "beta": "https://beta.cugetreg.com/_api/graphql",
    "dev": "https://dev.cugetreg.com/_api/graphql",
}
for env in envs:
    if env not in ["production", "beta", "dev"]:
        raise Exception("Invalid environment: " + env)
    print("Uploading overrides to", api_urls[env])

with open(sections_file, mode="r", encoding="utf8") as csvFile:
    csvReader = csv.DictReader(csvFile)
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
            "Content-Type": "application/json",
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
                    },
                }
            },
        }
        print(
            f"{envs} Updating",
            courseNo,
            studyProgram,
            genEdType,
            sections,
            academicYear,
            semester,
        )
        for env in envs:
            r = requests.post(api_urls[env], headers=headers, json=data)
            if r.status_code != 200:
                raise Exception(f"HTTPError {env} ({courseNo}): {r.content}")
