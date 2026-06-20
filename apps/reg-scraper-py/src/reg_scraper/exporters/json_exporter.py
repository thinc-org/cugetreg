from __future__ import annotations

import json
from datetime import UTC, datetime

from reg_scraper.config import settings
from reg_scraper.exporters.base import Exporter
from reg_scraper.models import Course


class JsonExporter(Exporter[list[Course]]):
    """
    Writes courses.json compatible with packages/database seed (CourseSeed shape).
    Frontend/backend can also read this file before DB import.
    """

    def export(self, courses: list[Course]) -> None:
        output_path = settings.resolve_path(settings.scraper_json_output)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        now = datetime.now(tz=UTC).strftime("%Y-%m-%dT%H:%M:%S.000Z")
        payload = []
        for course in courses:
            item = course.model_dump(mode="json")
            item["createdAt"] = {"$date": now}
            item["updatedAt"] = {"$date": now}
            payload.append(item)

        output_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
