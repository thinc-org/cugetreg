# CU Get Reg — Course Scraper (`reg-scraper-py`) on `mvp1-dev-scrapper`

> **PR reviewers:** [`docs/PR_SETUP.md`](../../docs/PR_SETUP.md)
> **Backend / frontend devs:** [`DATA_FORMAT.md`](./DATA_FORMAT.md) — output files, JSON fields, DB mapping

Python scraper for **Chulalongkorn University Reg Chula** course schedules.
Pulls live schedule data from `cas.reg.chula.ac.th`, processes it, and writes to **JSON** (`apps/core/bin/courses.json`) and/or **PostgreSQL** (same DB as `apps/core`).

---

## For other devs (read this first)

You **do not** need to change scraper code to use the data.

| Need | File / action |
|------|----------------|
| Sample + field reference | [`DATA_FORMAT.md`](./DATA_FORMAT.md) |
| All courses as JSON | `apps/core/bin/courses.json` (after `pnpm scraper:run`) |
| Data in DB for API | `SCRAPER_EXPORTERS=postgres` + same `DATABASE_URL` as `apps/core` |
| Is scrape done? | `apps/reg-scraper-py/data/scraper-status.json` |

Scraper JSON uses `semester: "1"|"2"|"3"`. Postgres exporter maps to `FIRST`/`SECOND`/`SUMMER` automatically.

---

## What it does

| Does | Does not |
|------|----------|
| Course list discovery (28 faculties) | Scrape course descriptions (needs separate CSV — see below) |
| Section / class schedule, room, time | User reviews or ratings |
| Seat capacity (regis/max) | Guarantee concurrent runs never overlap unless deployed via the CronJob below (local CLI runs have no lock) |
| Exam dates (midterm/final) when present | Replace v1 NestJS scraper in production yet |
| Upsert into v2 PostgreSQL schema | |

Runs on a schedule (daily) as a Kubernetes `CronJob` when deployed via `cugetregv2-gitops` — see [Deployment](#deployment). Locally it's still manual CLI (`pnpm scraper:run`).

**Data source:** [Reg Chula](https://cas.reg.chula.ac.th) — same HTML pages students use to search courses.

**Not scraped:** Long Thai/English course descriptions. V1 loads those from `course_chula_full.csv` (Office of Academic Affairs / GenEd data). This scraper can merge that CSV if you set `COURSE_DESC_PATH`.

---

## Architecture: Receivers → Processors → Exporters

```mermaid
flowchart TB
    subgraph Input
        REG[Reg Chula HTML]
        CSV[course_chula_full.csv optional]
        OVR[overrides.json optional]
    end

    subgraph Receiver
        R[RegChulaReceiver<br/>requests + session cookies]
    end

    subgraph Processor
        P1[CourseHtmlProcessor<br/>BeautifulSoup]
        P2[EnrichProcessor<br/>CSV + overrides]
    end

    subgraph Exporter
        E1[JsonExporter]
        E2[PostgresExporter]
    end

    subgraph Output
        JSON[courses.json]
        STATUS[scraper-status.json]
        PG[(PostgreSQL)]
    end

    REG --> R --> P1 --> P2
    CSV --> P2
    OVR --> P2
    P2 --> E1 --> JSON
    P2 --> E2 --> PG
    P2 -.-> STATUS
```

| Layer | File | Responsibility |
|-------|------|----------------|
| **Receiver** | `receivers/reg_chula_receiver.py` | HTTP session, faculty discovery, per-course HTML fetch |
| **Processor** | `processors/course_html_processor.py` | Parse HTML → structured `Course` object |
| **Processor** | `processors/enrich_processor.py` | Attach descriptions (CSV) and GenEd overrides (JSON) |
| **Exporter** | `exporters/json_exporter.py` | Write `courses.json` |
| **Exporter** | `exporters/postgres_exporter.py` | Upsert into Drizzle/PostgreSQL tables |
| **Orchestrator** | `pipeline.py` | Runs the full flow; writes status file |

---

## How scraping works (step by step)

1. **Open form page** — get session cookies from Reg Chula.
2. **Discovery** (unless `SCRAPER_COURSE_NOS` is set) — for each of **28 faculty codes**, call `CourseListNewServlet` and collect course numbers from detail links.
3. **Limit** — if `SCRAPER_MAX_COURSES > 0`, keep only the first N course numbers.
4. **Per course:**
   - List search for that course (required — Reg Chula needs this before detail).
   - Fetch detail page (`courseNo` + `studyProgram` only).
   - Append the page to the checkpoint (see [Resuming an interrupted scrape](#resuming-an-interrupted-scrape)).
5. **Parse** — read the checkpoint back and turn each page into a `Course`
   (`#Table3` → sections/classes/capacity, `#Table4` → exam dates).
6. **Enrich** — merge CSV descriptions and `overrides.json` GenEd types.
7. **Export** — write JSON and/or PostgreSQL **only when the full run completes** (not incrementally).

> **Important:** Stopping mid-run (Ctrl+C) does **not** save partial results to
> DB/JSON — but the pages already fetched *are* in the checkpoint, so re-running
> resumes instead of starting over.

---

## Resuming an interrupted scrape

A full scrape takes **~2 hours**, all of it waiting on `cas.reg.chula.ac.th`. If
that on-prem server goes down (or the pod is evicted, or you hit Ctrl+C) the run
picks up where it stopped instead of refetching everything.

Two files under `SCRAPER_CHECKPOINT_DIR`, same append-only JSONL idea as the
CUCIS/GenEd checkpoints:

| File | Holds |
|------|-------|
| `regchula_discovery_checkpoint.jsonl` | The course numbers found per study program — skips re-running faculty discovery |
| `regchula_pages_checkpoint.jsonl` | Every detail page already fetched, gzipped (~3.7 KB/course, so ~75 MB for a full scrape) |

Both are flushed after every record, so a `kill -9` loses at most the line in
flight, and a truncated final line is skipped on read. Every record carries the
year + semester it was scraped for, so a checkpoint written for another scrape
scope is ignored rather than reused.

One page record per line:

```json
{"course_no": "2110101", "study_program": "S", "academic_year": "2568",
 "semester": "1", "html_gz": "H4sIAA..."}
```

`html_gz` is the detail page gzipped then base64'd. The pages are ~24 KB of
repetitive table markup, which compresses to about 12% — hence the ~3.7 KB per
course. The scraping phase writes only to this file and the parsing phase reads
it back one line at a time, so a full run never holds more than one page of HTML
in memory.

**When the checkpoint is thrown away:**

| Trigger | Why |
|---------|-----|
| The run exports successfully | Its work is safely out; the next run starts clean |
| It is older than `SCRAPER_REGCHULA_CHECKPOINT_TTL_HOURS` (default `12`) | Reg Chula seat counts change daily — yesterday's pages must not be served as today's data. Matters most for the deployed CronJob, whose `SCRAPER_CHECKPOINT_DIR` lives on a PersistentVolume |
| `--fresh` | You asked for it |

**Outage detection:** one unreachable course is logged and skipped, but
`SCRAPER_MAX_CONSECUTIVE_FAILURES` (default `20`) failures in a row is treated as
Reg Chula being down — the run stops with `"status": "failed"` and *keeps* the
checkpoint, rather than exporting a mostly-empty dataset over good data.

```powershell
python -m reg_scraper scrape             # resumes if a fresh checkpoint exists
python -m reg_scraper scrape --fresh     # discard the checkpoint, scrape from scratch
python -m reg_scraper scrape --rebuild   # re-parse + re-export the checkpoint, zero network calls
```

`--rebuild` is the fast way to re-apply a parser or exporter change to pages you
already paid two hours to fetch; it leaves the checkpoint in place so you can run
it repeatedly.

---

## Parsing the detail page

Reg Chula's HTML is generated by a late-90s servlet: no classes, no ids on most
elements, everything styled with `<font color>` inside nested tables. Two fields
need care.

### Exam dates (`#Table4`)

The table prints both dates as free text after their labels:

```
วันสอบกลางภาค : 25 ก.ย. 2568 เวลา 8:30-11:30 น.    วันสอบปลายภาค : TDF (รอประกาศ)
```

Two things to know before touching `exam_dates_parser()`:

- **Months are abbreviated.** The page writes `ก.ย.`, never `กันยายน`, so
  `THAI_MONTHS` has to carry both forms. A lookup miss here silently produces
  `null` for every course, which is exactly what happened before.
- **Read by label, not by position.** An unannounced exam renders as
  `TDF (รอประกาศ)` and is split across a different number of `<font>` tags than
  a real date, so indexing into the flat font list puts the values under the
  wrong label as soon as one exam is announced and the other is not. The parser
  slices `#Table4`'s text between `วันสอบกลางภาค` and `วันสอบปลายภาค` instead.

`TDF` / `รอประกาศ` becomes `null`. Dates are Buddhist era and get converted
(`2568` → `2025`); the time of day goes to `period`, zero-padded.

### Course condition

`เงื่อนไขรายวิชา :` is read from its label, taking the sibling `<font>` in the
same cell. Values look like `PRER 2110215 AND 2110335 OR C.F.`, `COREQ 2603712`
or `JUNIOR STANDING`.

**`-` is not a parse failure** — it is what Reg Chula itself prints for a course
with no prerequisite, and it is the majority of courses. `apps/core` already
treats `-`, `''` and `NULL` alike in its `noPrereq` filter
(`prisma/sql/getCourseList.sql`).

---

## Outputs

### 1. `apps/core/bin/courses.json`

Path controlled by `SCRAPER_JSON_OUTPUT`. Array of course objects — see [`DATA_FORMAT.md`](./DATA_FORMAT.md) for every field.

**Example (abbreviated):**

```json
{
  "courseNo": "0201107",
  "abbrName": "LRN STUD ACT",
  "courseNameEn": "LEARNING THROUGH STUDENT ACTIVITIES",
  "courseNameTh": "การเรียนรู้ผ่านกิจกรรมนิสิต",
  "courseDescEn": "",
  "courseDescTh": "",
  "faculty": "02",
  "department": "ศูนย์การศึกษาทั่วไป",
  "credit": 3.0,
  "creditHours": "LECT 1.0 CR + NL36 2.0 CR(...)",
  "courseCondition": "-",
  "studyProgram": "I",
  "academicYear": "2568",
  "semester": "2",
  "genEdType": "NO",
  "midterm": null,
  "final": null,
  "sections": [
    {
      "sectionNo": "2",
      "closed": false,
      "note": "GENED-IN",
      "genEdType": "NO",
      "capacity": { "current": 15, "max": 10 },
      "classes": [
        {
          "type": "LECT",
          "dayOfWeek": "TH",
          "period": { "start": "13:00", "end": "14:00" },
          "building": "MAHIT",
          "room": "407",
          "teachers": ["SWM"]
        }
      ]
    }
  ],
  "createdAt": { "$date": "2026-06-06T01:42:07.000Z" },
  "updatedAt": { "$date": "2026-06-06T01:42:07.000Z" }
}
```

**Use:** Inspect locally, write import scripts, or pair with postgres export. Backend serves DB data via existing `apps/core` API.

---

### 2. `apps/reg-scraper-py/data/scraper-status.json`

Path controlled by `SCRAPER_STATUS_OUTPUT`. Updated during and after each run.

```json
{
  "status": "completed",
  "started_at": "2026-06-06T01:41:51.469635Z",
  "finished_at": "2026-06-06T01:42:07.503066Z",
  "courses_total": 20,
  "courses_scraped": 20,
  "courses_failed": 0,
  "message": "Exported 20 courses via ['json', 'postgres']"
}
```

| `status` | Meaning |
|----------|---------|
| `running` | Scrape in progress (`message` shows e.g. `Fetching 2301108 (5/20)`) |
| `completed` | Finished and exported |
| `failed` | Error (see `message`) |
| `idle` | No run yet (default file) |

**Use:** Web app reads this at `/scraper` and `/api/scraper/status`.

---

### 3. PostgreSQL tables

When `SCRAPER_EXPORTERS` includes `postgres`. Uses `DATABASE_URL`.

| Table | Content |
|-------|---------|
| `course_info` | Static metadata per `course_no` (names, credit, faculty) |
| `course` | One row per course × study program × semester × year |
| `course_section` | Sections with capacity, closed, note |
| `course_class` | Class times (day, period, room, professors) |

**Use:** `apps/core` Prisma API reads these tables — no scraper changes needed on the API side.

See [`DATA_FORMAT.md`](./DATA_FORMAT.md) for JSON → column mapping.

---

## Configuration (`.env`)

Config file: `apps/reg-scraper-py/.env` (loaded automatically from any working directory). Copy `.env.example` and edit — the example ships with `SCRAPER_MAX_COURSES=20` + `SCRAPER_EXPORTERS=postgres`, a small test run against a real Postgres DB rather than a full scrape.

### Scrape scope

`SCRAPER_ACADEMIC_YEAR` and `SCRAPER_SEMESTER` are the whole deployed configuration. Every run covers ทวิภาค + ตรีภาค + นานาชาติ (`S`, `T`, `I`) together.

| Variable | Example | Description |
|----------|---------|-------------|
| `SCRAPER_ACADEMIC_YEAR` | `2568` | One Buddhist era year |
| `SCRAPER_SEMESTER` | `SECOND` | `FIRST` / `SECOND` / `SUMMER` (`1`/`2`/`3` also accepted) |
| `SCRAPER_STUDY_PROGRAMS` | `S,T,I` | **Local testing only.** Omit in deployment — every sync covers all three |
| `SCRAPER_COURSE_NOS` | *(empty)* | Specific course IDs (`2301108,2301107`). Empty = discover all courses from 28 faculties |
| `SCRAPER_MAX_COURSES` | `20` | Limit after discovery. `0` = no limit (~8000+ for I/sem2) |
| `SCRAPER_EXPORTERS` | `json,postgres` | `json`, `postgres`, or both |

`.env.example` defaults to `SCRAPER_MAX_COURSES=20` + `SCRAPER_EXPORTERS=postgres` — a small test scrape into a real Postgres DB. For a full scrape (every course, all three study programs), set `SCRAPER_MAX_COURSES=0`. This is also what the gitops-deployed CronJob uses in production — see [Deployment](#deployment) below.

### Rate limiting

| Variable | Example | Description |
|----------|---------|-------------|
| `SCRAPER_BATCH_SIZE` | `25` | Courses per discovery batch |
| `SCRAPER_DELAY_MS` | `300` | Delay between each course fetch (ms) |
| `SCRAPER_MAX_RETRIES` | `10` | Retries per course detail page before giving up |
| `SCRAPER_MAX_CONSECUTIVE_FAILURES` | `20` | Courses that may fail back-to-back before the run aborts and keeps its checkpoint. `0` = never abort |
| `CUCIS_DELAY_MS` | `300` | Delay between description catalogue pages (ms) |
| `GENED_DELAY_MS` | `200` | Delay between GenEd API calls (ms) |

### Side inputs

| Variable | Example | Description |
|----------|---------|-------------|
| `SCRAPER_DESCRIPTIONS_MODE` | `auto` | `auto` / `always` / `never` — whether to scrape descriptions |
| `SCRAPER_GENED_MODE` | `auto` | `auto` / `always` / `never` — whether to scrape GenEd types |
| `COURSE_DESC_PATH` | `data/course_desc.csv` | Description CSV from `cucis.academic.chula.ac.th` (~29.7k courses, 1490 pages) — written by `descriptions`, read by enrich |
| `CUCIS_TOTAL_PAGES` | `1490` | Description catalogue page count |
| `OVERRIDES_PATH` | `../../apps/core/bin/overrides.json` | GenEd types from `gened.chula.ac.th`. Read by the scraper **and** by `apps/core/bin/migrate_course.ts`, which is what actually sets `gen_ed_type` |
| `GENED_FALLBACK_TYPE` | `GENED` | The GenEd site lists some courses with no area. `GENED` keeps that as-is (it is a real `GenEdType`); `NO`/`SC`/`SO`/`HU`/`IN` folds them into an area, `SKIP` omits them |
| `SCRAPER_CHECKPOINT_DIR` | `data/checkpoints` | Resume files for the Reg Chula scrape **and** both side scrapers |
| `SCRAPER_REGCHULA_CHECKPOINT_TTL_HOURS` | `12` | How long a Reg Chula checkpoint stays resumable — see [Resuming an interrupted scrape](#resuming-an-interrupted-scrape). `0` = never expire |

### Outputs

| Variable | Example | Description |
|----------|---------|-------------|
| `SCRAPER_JSON_OUTPUT` | `../../apps/core/bin/courses.json` | Course JSON destination |
| `SCRAPER_STATUS_OUTPUT` | `../../apps/reg-scraper-py/data/scraper-status.json` | Progress / result file |
| `DATABASE_URL` | `postgresql://admin:cugetreg@localhost:5432/cugetreg` | Same as `apps/core/.env` — only needed when `SCRAPER_EXPORTERS` includes `postgres` |

**Common mistake:** `SCRAPER_MAX_COURSES=20` limits how many courses to fetch.
`SCRAPER_COURSE_NOS=20` would try to scrape course number `"20"` — wrong variable.

---

## Setup & run

### 1. Install scraper

```powershell
cd apps/reg-scraper-py
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
copy .env.example .env
```

### 2. Start PostgreSQL (apps/core)

```powershell
cd apps/core
docker compose up -d
copy .env.example .env
pnpm prisma migrate dev
pnpm codegen
```

### 3. Run scraper

```powershell
# from repo root (after pip install -e . in apps/reg-scraper-py):
pnpm scraper:run
```

Quick test (20 courses) — set in `apps/reg-scraper-py/.env`:

```env
SCRAPER_MAX_COURSES=20
SCRAPER_EXPORTERS=json,postgres
```

### 4. Run mvp1 stack

```powershell
# terminal 1 — API
cd apps/core
pnpm dev

# terminal 2 — frontend
cd apps/cugetreg
copy .env.example .env
pnpm dev
```

| URL | What you see |
|-----|--------------|
| http://localhost:5173/ | Course search (reads from `GET /api/v1/courses`) |
| http://localhost:5173/scraper | Scraper status |
| http://localhost:3000/api/v1/courses?studyProgram=S&academicYear=2568&semester=SECOND&limit=5 | Raw API |

---

## Deployment

Ships as a Docker image (`apps/reg-scraper-py/Dockerfile`, `python:3.12-slim`) built by the `reg-scraper` job in `.github/workflows/build-deploy.yaml`. Unlike `web`/`api`, its build context is this directory, not the monorepo root — it has no dependency on the pnpm workspace.

A `v2-beta` push builds it, pushes its image, and bumps its tag in the gitops `beta` overlay automatically, same as `web`/`api` — no separate trigger needed. A tagged GitHub Release (`gh release create reg-scraper@1.0.0 --target v2-prod`, see `cugetregv2-gitops`'s README, "Cutting a prod release") is the equivalent path for `v2-prod`.

In `cugetregv2-gitops`, `reg-scraper/` deploys it as a Kubernetes **`CronJob`** (`0 2 * * *`, daily), not a long-running server — the container runs one full scrape and exits `0` on success. A `PersistentVolumeClaim` mounted at `/data` keeps `overrides.json`, `course_desc.csv`, and the CUCIS checkpoint across runs, so `SCRAPER_GENED_MODE=auto`/`SCRAPER_DESCRIPTIONS_MODE=auto` only pay their one-time scrape cost on the very first run — every scheduled run after that reuses the persisted files.

**Concurrency:** `kubectl create job --from=cronjob/reg-scraper ...` (a manual/on-demand trigger) bypasses the CronJob controller entirely, so the CronJob's `concurrencyPolicy: Forbid` has no effect on it — a manual trigger fired mid-scheduled-run would otherwise race the same Postgres `DELETE`+`INSERT` cycle and the same PVC files. `entrypoint.sh` guards against this directly with a `flock` on `/data/.lock` (fd 9 — this image's `/bin/sh` is `dash`, which rejects the more common fd "200" convention): a second run skips immediately (exit `0`, logged, not treated as a failure) if the lock is already held, rather than queuing or racing.

**Production run scope:** the deployed secret sets `SCRAPER_MAX_COURSES=0` (every course, unlike the `20` used for local testing) and `SCRAPER_EXPORTERS=postgres` only (no `courses.json` — nothing reads it once data's in Postgres).

The `/scraper` status page above only works locally — it reads `scraper-status.json` off the local filesystem, which isn't reachable from the deployed `web` pod (different pod, no shared volume with the CronJob's PVC). Not yet wired up for the deployed CronJob.

---

## Full pipeline diagram

```
Reg Chula (cas.reg.chula.ac.th)
        │
        ▼
  reg-scraper-py scrape
        │
        ├──► courses.json          (backup / seed input)
        ├──► scraper-status.json   (progress / result)
        └──► PostgreSQL            (course_info, course, course_section, course_class)
                    │
                    ▼
              apps/core API (:3000)  ← existing backend, unchanged by scraper
                    │
                    ▼
              apps/cugetreg (:5173)
                    │
                    ├── /  (course search via API)
                    └── /scraper (status file)
```

---

## Side inputs: descriptions and GenEd

Reg Chula HTML has neither course descriptions nor GenEd classification, so two
extra scrapers fill those in. Both are built in and both resume from a
checkpoint, so an interrupted run never starts over.

| Command | Source | Writes | Consumed by |
|---------|--------|--------|-------------|
| `python -m reg_scraper descriptions` | `cucis.academic.chula.ac.th` (~29.7k courses, 1490 pages) | `COURSE_DESC_PATH` CSV | `EnrichProcessor` → `courseDescTh/En` |
| `python -m reg_scraper gened` | `gened.chula.ac.th` API (520 courses) | `OVERRIDES_PATH` JSON | `EnrichProcessor` **and** `apps/core/bin/migrate_course.ts` |

`python -m reg_scraper scrape` runs both first, according to their mode:

| Mode | Behaviour |
|------|-----------|
| `auto` *(default)* | Scrape only if the output file is missing or empty |
| `always` | Scrape every run — resumes from the checkpoint |
| `never` | Skip; use whatever file is on disk |

Flags — the same two work on all three commands, each against that command's own
checkpoint:

```powershell
python -m reg_scraper gened --fresh     # delete the checkpoint, refetch everything
python -m reg_scraper gened --rebuild   # rewrite the output from the checkpoint, no network
```

> `always` **resumes from the checkpoint**: courses added since the last run are
> fetched, but courses already in the checkpoint are never re-checked. If a
> course changed its GenEd area, or a description was edited, only `--fresh`
> will pick that up.

**GenEd areas:** 87 of the 520 courses are listed as GenEd without an area.
`GENED` is a real `GenEdType` (Postgres enum, zod, Prisma), so those are written
through as-is by default. `GENED_FALLBACK_TYPE` can fold them into a concrete
area (`SC`/`SO`/`HU`/`IN`) or drop them with `SKIP`.

> Requires the `20260815000000_add_gened_type` migration. Run
> `pnpm prisma migrate dev` **before** `bin/migrate.sh`, or the insert fails on
> an invalid enum value.

**Descriptions:** the CSV is written with the column names `EnrichProcessor`
expects — `course_no`, `description_thai`, `description`. ~785 of the 29,783
catalogue rows have no description text at all and are skipped on load.

---

## Project layout

```
apps/reg-scraper-py/
├── .env                 # your config (not committed)
├── .env.example
├── pyproject.toml
├── README.md            # this file
├── DATA_FORMAT.md       # output contract for backend/frontend
└── src/reg_scraper/
    ├── __main__.py      # CLI entry: python -m reg_scraper scrape
    ├── config.py        # loads .env
    ├── pipeline.py
    ├── models.py
    ├── receivers/
    │   └── reg_chula_receiver.py
    ├── processors/
    │   ├── course_html_processor.py
    │   └── enrich_processor.py
    └── exporters/
        ├── json_exporter.py
        └── postgres_exporter.py
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Fetches 8000+ despite `MAX_COURSES=20` | Old bug: `.env` not loaded from repo root | Fixed — pull latest; verify with `python -c "from reg_scraper.config import settings; print(settings.max_courses)"` |
| `Cannot parse course header` | Wrong semester or missing list-search step | Match `SCRAPER_SEMESTERS` to Reg Chula; use latest receiver code |
| `sectionNo` like `52LECTTH...` | Broken Reg Chula HTML | Fixed in `parse_section_no()` |
| Web shows empty courses | Scrape stopped before export | Wait for `"status": "completed"` |
| `midterm` / `final` always `null` | Old bug: only full Thai month names were parsed, but Reg Chula prints `"25 ก.ย. 2568"` | Fixed — `courseNo` with a real date now exports one. `null` is still correct for `TDF (รอประกาศ)`, which is most courses until the exam timetable is published |
| `courseCondition` is `"-"` | Not a bug — `-` is what Reg Chula prints when a course has no prerequisite | Real conditions come through as e.g. `PRER 2110215 AND 2110335 OR C.F.`; the API already treats `-` as "no prereq" |
| Run aborted with "Reg Chula looks unreachable" | 20 courses failed back-to-back | Re-run once the server is back — it resumes from the checkpoint |
| `ECONNREFUSED` on migrate | Postgres not running | Start Docker → `docker compose up -d postgres` |
| Empty descriptions | No CSV configured | Set `COURSE_DESC_PATH` |

---

## Relation to v1 (`main` branch)

| | v1 `apps/reg-scraper` | v2 `apps/reg-scraper-py` |
|--|----------------------|--------------------------|
| Language | TypeScript / NestJS | Python |
| HTTP client | axios + cheerio | requests + BeautifulSoup |
| Database | MongoDB | PostgreSQL (Drizzle) |
| Descriptions | CSV via `OverrideService` | Same CSV via `EnrichProcessor` |
| Queue | Bull / Redis | Sequential (simpler) |

Parsing logic is ported from v1 `course.selector.ts` on `main`.
