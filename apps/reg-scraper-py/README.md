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
   - Parse HTML (`#Table3` → sections, classes, capacity, exams).
5. **Enrich** — merge CSV descriptions and `overrides.json` GenEd types.
6. **Export** — write JSON and/or PostgreSQL **only when the full run completes** (not incrementally).

> **Important:** Stopping mid-run (Ctrl+C) does **not** save partial results to DB/JSON.

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
| `SCRAPER_CHECKPOINT_DIR` | `data/checkpoints` | Resume files for both side scrapers |

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

Flags (`descriptions` / `gened` only):

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
