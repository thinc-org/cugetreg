import argparse
import csv
import requests

parser = argparse.ArgumentParser()
parser.add_argument(
    "-e",
    "--envs",
    nargs="+",
    choices=["production", "beta", "dev", "local"],
    required=True,
    help="environments to upload overrides to. Can be 'production', 'beta', 'dev' or 'local'. Can specify multiple environments.",
)
parser.add_argument(
    "-f", "--file", required=True, help="csv override file to import from"
)
parser.add_argument(
    "-t", "--token", required=True, help="admin token to authenticate with"
)
parser.add_argument(
    "-p", "--port", required=False, default="3333", help="localhost port"
)
args = vars(parser.parse_args())

envs: list[str] = args["envs"]
sections_file: str = args["file"]
admin_token: str = args["token"]
local_port: str = args["port"]
api_urls = {
    "production": "https://cugetreg.com/_api/graphql",
    "beta": "https://beta.cugetreg.com/_api/graphql",
    "dev": "https://dev.cugetreg.com/_api/graphql",
    "local": "http://localhost:"+local_port+"/_api/graphql",
}
for env in envs:
    if env not in ["production", "beta", "dev", "local"]:
        raise Exception("Invalid environment: " + env)
    print("Uploading overrides to", api_urls[env])

with open(sections_file, mode="r", encoding="utf-8-sig") as csvFile:
    csvReader = csv.DictReader(csvFile)
    for row in csvReader:
        courseNo = row["courseNo"].strip()
        genEdType = row["genEdType"].strip()

        headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": "application/json",
        }
        data = {
            "query": """
        mutation createOrUpdateOverride($override: OverrideInput!) {
          createOrUpdateOverride(override: $override) {
            courseNo
            genEdType
          }
        }
      """,
            "variables": {
                "override": {
                    "courseNo": courseNo,
                    "genEdType": genEdType,
                }
            },
        }
        print(
            f"{envs} Updating",
            courseNo,
            genEdType,
        )
        for env in envs:
            r = requests.post(api_urls[env], headers=headers, json=data)
            if r.status_code != 200:
                raise Exception(f"HTTPError {env} ({courseNo}): {r.content}")
