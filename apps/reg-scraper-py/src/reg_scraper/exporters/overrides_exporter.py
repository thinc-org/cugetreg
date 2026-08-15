"""Writes overrides.json — the GenEd map read by EnrichProcessor and
apps/core/bin/migrate_course.ts.

Courses listed as GenEd with no area are recorded as "GENED"; GENED_FALLBACK_TYPE
can fold them into a concrete area or drop them with SKIP.
"""

from __future__ import annotations

import json
import logging
from collections import Counter
from typing import Any

from reg_scraper.config import settings
from reg_scraper.exporters.base import Exporter
from reg_scraper.receivers.gened_receiver import UNKNOWN_AREA

logger = logging.getLogger(__name__)

VALID_TYPES = {"NO", "SC", "SO", "HU", "IN", "GENED"}


class OverridesExporter(Exporter[list[dict[str, Any]]]):
    def export(self, rows: list[dict[str, Any]]) -> None:
        output_path = settings.resolve_path(settings.overrides_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        fallback = settings.gened_fallback_type
        payload: list[dict[str, str]] = []
        counts: Counter[str] = Counter()
        dropped = 0

        for row in rows:
            course_no = str(row.get("courseNo") or "").strip()
            gen_ed = str(row.get("genEdType") or "").strip().upper()
            if not course_no:
                continue

            if gen_ed == UNKNOWN_AREA and fallback != UNKNOWN_AREA:
                if fallback == "SKIP":
                    dropped += 1
                    continue
                gen_ed = fallback

            if gen_ed not in VALID_TYPES:
                logger.warning(
                    "Dropping %s: unmappable genEdType %r (valid: %s)",
                    course_no,
                    gen_ed,
                    sorted(VALID_TYPES),
                )
                dropped += 1
                continue

            payload.append({"courseNo": course_no, "genEdType": gen_ed})
            counts[gen_ed] += 1

        payload.sort(key=lambda item: item["courseNo"])
        output_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        unknown = sum(1 for row in rows if str(row.get("genEdType", "")).upper() == UNKNOWN_AREA)
        if unknown:
            if fallback == UNKNOWN_AREA:
                action = f"kept as {UNKNOWN_AREA}"
            elif fallback == "SKIP":
                action = "dropped"
            else:
                action = f"mapped to {fallback}"
            logger.info("%d courses had no GenEd area -> %s", unknown, action)
        if dropped:
            logger.info("%d courses left out of overrides.json", dropped)
        logger.info(
            "Wrote %d GenEd overrides -> %s (%s)",
            len(payload),
            output_path,
            ", ".join(f"{key}={value}" for key, value in sorted(counts.items())) or "empty",
        )
