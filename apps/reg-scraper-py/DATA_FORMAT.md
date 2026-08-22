# Scraper output — data format

This document describes **what the scraper produces** and how backend/frontend teams can use it.  
The scraper does **not** call your API — it writes files and/or PostgreSQL rows that your apps read.

---

## Quick start for integrators

| I want to… | Do this |
|------------|---------|
| Inspect scraped data without a DB | Run scraper with `SCRAPER_EXPORTERS=json`, open `apps/core/bin/courses.json` |
| Load data into the mvp1 database | Set `SCRAPER_EXPORTERS=postgres` (or `json,postgres`) with the same `DATABASE_URL` as `apps/core` |
| Check if a scrape finished | Read `apps/reg-scraper-py/data/scraper-status.json` |
| See live progress in the UI | Open http://localhost:5173/scraper (reads status file) |

Run from repo root: `pnpm scraper:run`

---

## Output files

| File | Env var | Description |
|------|---------|-------------|
| `apps/core/bin/courses.json` | `SCRAPER_JSON_OUTPUT` | Full scrape result — array of course objects |
| `apps/reg-scraper-py/data/scraper-status.json` | `SCRAPER_STATUS_OUTPUT` | Run status + progress counters |

Both paths are configurable in `apps/reg-scraper-py/.env`.

**Important:** JSON and Postgres are written **only when the full run completes**.
Stopping mid-run (Ctrl+C) does not save partial export — but the pages already
fetched are kept in a checkpoint, so re-running resumes rather than restarting.
See "Resuming an interrupted scrape" in [`README.md`](./README.md).

---

## Status file (`scraper-status.json`)

```json
{
  "status": "completed",
  "started_at": "2026-06-06T01:41:51.469635Z",
  "finished_at": "2026-06-06T01:42:07.503066Z",
  "courses_total": 20,
  "courses_scraped": 20,
  "courses_failed": 0,
  "message": "Exported 20 courses via ['json']"
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `status` | `"idle"` \| `"running"` \| `"completed"` \| `"failed"` | Current run state |
| `courses_total` | int | Courses discovered for this run (after filters) |
| `courses_scraped` | int | Successfully parsed courses |
| `courses_failed` | int | Courses that failed to parse/fetch |
| `message` | string | Human-readable detail (progress or error) |

During `running`, `message` looks like `Fetching 2301108 (5/20)`.

---

## Course JSON shape

Top-level: **array of course objects**.  
Schema source of truth: `src/reg_scraper/models.py` (`Course`, `Section`, `ClassItem`).

### Course fields

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `courseNo` | string | `"0123104"` | Reg course number |
| `abbrName` | string | `"UNIV THAI READING"` | Short English name |
| `courseNameEn` | string | | Full English name |
| `courseNameTh` | string | | Full Thai name |
| `courseDescEn` | string | | From optional CSV, not Reg HTML |
| `courseDescTh` | string | | From optional CSV |
| `faculty` | string | `"01"` | Faculty code |
| `department` | string | | Department name (Thai) |
| `credit` | number | `3.0` | Credit units |
| `creditHours` | string | `"LECT 1.0 CR + …"` | Used to infer grading type in DB |
| `courseCondition` | string | `"-"` | Prerequisite text, e.g. `"PRER 2110215 AND 2110335 OR C.F."`. `"-"` is Reg Chula's own "no condition" placeholder, not a parse failure |
| `studyProgram` | `"S"` \| `"T"` \| `"I"` | `"S"` | S=ทวิภาค, T=ตรีภาค, I=นานาชาติ |
| `academicYear` | string | `"2568"` | Buddhist era year |
| `semester` | `"1"` \| `"2"` \| `"3"` | `"2"` | 1=ภาคต้น, 2=ภาคปลาย, 3=ฤดูร้อน |
| `genEdType` | `"NO"` \| `"SC"` \| `"SO"` \| `"HU"` \| `"IN"` | | GenEd category |
| `midterm` | object \| null | | See exam object below |
| `final` | object \| null | | See exam object below |
| `sections` | array | | Section list |
| `createdAt` | `{ "$date": "…" }` | | Export timestamp (JSON only) |
| `updatedAt` | `{ "$date": "…" }` | | Export timestamp (JSON only) |

### Exam object

```json
{
  "period": { "start": "13:00", "end": "15:00" },
  "date": "2026-03-15T00:00:00.000Z"
}
```

`date` is the Reg Chula Buddhist-era date converted to Gregorian
(`25 ก.ย. 2568` → `2025-09-25`), at midnight; the time of day lives in `period`,
zero-padded (`8:30` → `"08:30"`).

`midterm` / `final` are `null` when Reg Chula has not published that exam yet —
it shows `TDF (รอประกาศ)`, which is the majority of courses until the exam
timetable is out. `null` for **every** course in a run is not expected; that was
a parser bug (only full month names like `กันยายน` were recognised, never the
abbreviated `ก.ย.` the site actually prints) and is fixed.

### Section fields

| Field | Type | Notes |
|-------|------|-------|
| `sectionNo` | string | e.g. `"1"`, `"2"` |
| `closed` | boolean | Section closed for registration |
| `note` | string \| null | e.g. GenEd tag |
| `genEdType` | string | Usually same as course |
| `capacity.current` | int | Current registered (`regis` in DB) |
| `capacity.max` | int | Maximum seats |
| `classes` | array | Time/room rows |

### Class fields

| Field | Type | Notes |
|-------|------|-------|
| `type` | string | `LECT`, `PRAC`, `LAB`, etc. |
| `dayOfWeek` | string \| null | `MO`…`SU`, `AR`, `IA` (internet/async) |
| `period.start` | string | `"16:00"` or `"IA"` for async |
| `period.end` | string | `"17:00"` |
| `building` | string \| null | |
| `room` | string \| null | |
| `teachers` | string[] | Professor codes/names |

---

## PostgreSQL mapping (postgres exporter)

> ⚠️ **The built-in postgres exporter does not currently work.** `course`,
> `course_section` and `course_class` all declare `updated_at TIMESTAMP(3) NOT
> NULL` with no database default (Prisma fills `@updatedAt` client-side), and
> the exporter omits the column on every INSERT — so it fails on a not-null
> violation. Use the JSON output until this is fixed.
>
> If you are writing your own loader with raw SQL rather than Prisma, you hit
> the same thing: **set `created_at` / `updated_at` explicitly.**

The table below is still the intended mapping, and is accurate as a reference
for any loader reading `courses.json`.

| JSON / scraper | DB table.column | Transform |
|----------------|-----------------|-----------|
| `courseNo`, names, credit, … | `course_info.*` | Upsert by `course_no` |
| `studyProgram`, `academicYear`, `semester`, … | `course.*` | One row per program × year × semester × courseNo |
| `semester` `"1"`/`"2"`/`"3"` | `course.semester` | → `FIRST` / `SECOND` / `SUMMER` |
| `sections[].sectionNo` | `course_section.section_no` | int |
| `capacity.current` / `max` | `course_section.regis` / `max` | |
| `classes[].dayOfWeek` | `course_class.day_of_week` | `IA` → `IR` |
| `classes[].period` | `course_class.period_start` / `period_end` | |
| `classes[].teachers` | `course_class.professors` | text array |
| `creditHours` contains `S/U` | `course_info.grading_type` | → `SU`, else `LETTER` |

After export, `apps/core` serves courses via its existing API — **no scraper changes needed on the API side**.

---

## Enum reference

**studyProgram**

| Value | Meaning |
|-------|---------|
| `S` | ทวิภาค (regular) |
| `T` | ตรีภาค |
| `I` | นานาชาติ (international) |

**semester** (scraper JSON)

| Value | DB value |
|-------|----------|
| `1` | `FIRST` |
| `2` | `SECOND` |
| `3` | `SUMMER` |

**genEdType**

| Value | Meaning |
|-------|---------|
| `NO` | Not GenEd |
| `SC` | Science |
| `SO` | Social |
| `HU` | Humanities |
| `IN` | Interdisciplinary |
| `GENED` | GenEd, area not published by gened.chula.ac.th (~87 courses) |

> ⚠️ **`GENED` needs migration `20260815000000_add_gened_type`.** It was added to
> the `gen_ed_type` Postgres enum, `schema.prisma`, `mapGenEdType()` and
> `packages/zod-schemas`. Writing it to a database that has not applied that
> migration fails with an invalid enum value.
>
> To avoid it entirely, set `GENED_FALLBACK_TYPE` to a concrete area
> (`SC`/`SO`/`HU`/`IN`) or `SKIP`, then re-run `python -m reg_scraper gened
> --rebuild` — no re-scrape needed.

GenEd type comes from `overrides.json`, keyed by `courseNo`. It is applied to
both the course and every one of its sections.

---

## Minimal example (one course)

See `apps/core/bin/courses.json` after a run, or this abbreviated shape:

```json
{
  "courseNo": "0123104",
  "abbrName": "UNIV THAI READING",
  "courseNameEn": "UNIVERSITY LEVEL OF THAI READING",
  "courseNameTh": "การอ่านภาษาไทยระดับอุดมศึกษา",
  "studyProgram": "S",
  "academicYear": "2568",
  "semester": "2",
  "genEdType": "NO",
  "sections": [{
    "sectionNo": "1",
    "closed": false,
    "capacity": { "current": 31, "max": 60 },
    "classes": [{
      "type": "LECT",
      "dayOfWeek": "WE",
      "period": { "start": "16:00", "end": "17:00" },
      "building": "MAHIT",
      "room": "401",
      "teachers": ["PLL"]
    }]
  }]
}
```

---

## TypeScript / Python types

- **Python:** `from reg_scraper.models import Course` — Pydantic models match JSON exactly.
- **TypeScript:** Read JSON as-is, or infer types from the field tables above. No shared package yet — `courses.json` is the contract.

---

## Scrape scope (what goes into the files)

Controlled by `.env`:

A run is scoped by **two** variables. Study program is not one of them — every
run scrapes ทวิภาค + ตรีภาค + นานาชาติ (`S`, `T`, `I`) together.

| Variable | Example | Effect |
|----------|---------|--------|
| `SCRAPER_ACADEMIC_YEAR` | `2568` | One Buddhist era year |
| `SCRAPER_SEMESTER` | `FIRST` | `FIRST` / `SECOND` / `SUMMER` (`1`/`2`/`3` also accepted) |

So `SCRAPER_ACADEMIC_YEAR=2568` + `SCRAPER_SEMESTER=FIRST` produces every course
offered in all three programs for 2568 semester 1, as one `courses.json` array.
Distinguish them by each course's own `studyProgram` field.

Testing / advanced (omit in deployment):

| Variable | Example | Effect |
|----------|---------|--------|
| `SCRAPER_STUDY_PROGRAMS` | `I` | Narrow to some programs. Default `S,T,I` |
| `SCRAPER_COURSE_NOS` | `2301108,2301107` | Only these courses (skips faculty discovery) |
| `SCRAPER_MAX_COURSES` | `20` | Cap per program (`0` = no limit) |

> `SCRAPER_MAX_COURSES` applies **per study program**, not per run — with the
> default three programs, `20` yields up to 60 courses.
