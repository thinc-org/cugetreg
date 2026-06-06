# CU Get Reg v2 — Course Scraper (`reg-scraper-py`)

Python scraper for **Chulalongkorn University Reg Chula** course schedules.  
Pulls live schedule data from `cas.reg.chula.ac.th`, processes it, and writes to **JSON** and/or **PostgreSQL** for the v2 web app.

---

## What it does

| Does | Does not |
|------|----------|
| Course list discovery (28 faculties) | Scrape course descriptions (needs separate CSV — see below) |
| Section / class schedule, room, time | User reviews or ratings |
| Seat capacity (regis/max) | Run automatically on a schedule (manual CLI for now) |
| Exam dates (midterm/final) when present | Replace v1 NestJS scraper in production yet |
| Upsert into v2 PostgreSQL schema | |

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

### 1. `packages/database/data/courses.json`

Path controlled by `SCRAPER_JSON_OUTPUT`. Array of course objects compatible with `@repo/database` seed.

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

**Use:** `pnpm --filter @repo/database seed` (alternative to direct Postgres export).

---

### 2. `packages/database/data/scraper-status.json`

Path controlled by `SCRAPER_STATUS_OUTPUT`. Updated during and after each run.

```json
{
  "status": "completed",
  "started_at": "2026-06-06T01:41:51.469635Z",
  "finished_at": "2026-06-06T01:42:07.503066Z",
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

**Use:** `apps/web` reads via Drizzle → `/api/courses`, `/dbdemo`.

---

## Configuration (`.env`)

Config file: `apps/reg-scraper-py/.env` (loaded automatically from any working directory).

| Variable | Example | Description |
|----------|---------|-------------|
| `SCRAPER_ACADEMIC_YEARS` | `2568` | Buddhist era year(s), comma-separated |
| `SCRAPER_STUDY_PROGRAMS` | `I` | `S` = ทวิภาค, `T` = ตรีภาค, `I` = นานาชาติ |
| `SCRAPER_SEMESTERS` | `2` | `1`, `2`, or `3` |
| `SCRAPER_COURSE_NOS` | *(empty)* | Specific course IDs (`2301108,2301107`). Empty = discover all |
| `SCRAPER_MAX_COURSES` | `20` | Limit after discovery. `0` = no limit (~8000+ for I/sem2) |
| `SCRAPER_DELAY_MS` | `300` | Delay between each course fetch (ms) |
| `SCRAPER_EXPORTERS` | `json,postgres` | `json`, `postgres`, or both |
| `COURSE_DESC_PATH` | `../../data/course_chula_full.csv` | Optional V1 description CSV |
| `OVERRIDES_PATH` | `../../packages/database/data/overrides.json` | Optional GenEd overrides |
| `DATABASE_URL` | `postgresql://cugetreg:cugetreg@localhost:5432/cugetreg` | Postgres connection |

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

### 2. Start PostgreSQL

```powershell
cd ../..   # repo root
docker compose up -d postgres
copy packages\database\.env.example packages\database\.env
pnpm --filter @repo/database migrate
```

### 3. Run scraper

```powershell
# from apps/reg-scraper-py (venv active) OR repo root:
python -m reg_scraper scrape
```

Quick test (20 courses):

```env
SCRAPER_MAX_COURSES=20
SCRAPER_EXPORTERS=json,postgres
```

Full scrape (hours):

```env
SCRAPER_MAX_COURSES=0
```

### 4. Run web

```powershell
cd ../..   # repo root
copy apps\web\.env.example apps\web\.env
pnpm web:dev
```

| URL | What you see |
|-----|--------------|
| http://localhost:5343/api/courses?limit=5 | Courses from PostgreSQL |
| http://localhost:5343/scraper | Last scrape status |
| http://localhost:5343/dbdemo | Raw DB query demo |

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
              apps/web (SvelteKit :5343)
                    │
                    ├── /api/courses
                    ├── /api/scraper/status
                    └── /scraper
```

---

## Course descriptions (V1 parity)

Reg Chula HTML **does not** include description text. V1 uses:

| File | Columns |
|------|---------|
| `course_chula_full.csv` | `course_no`, `description_thai`, `description` |

Get the file from your team (same as v1 `apps/reg-scraper/data/`). Then:

```env
COURSE_DESC_PATH=../../data/course_chula_full.csv
```

Re-run scrape to populate `courseDescTh` / `courseDescEn`.

---

## Project layout

```
apps/reg-scraper-py/
├── .env                 # your config (not committed)
├── .env.example
├── pyproject.toml
├── README.md            # this file
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
