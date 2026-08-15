# Scraper data — integration guide

Branch: **`mvp1-dev-scrapper`**

This doc is for **backend and frontend devs** who need course data.  
The scraper team owns export format; your teams own API/UI — no cross-changes required.

**Data contract:** [`apps/reg-scraper-py/DATA_FORMAT.md`](../apps/reg-scraper-py/DATA_FORMAT.md)  
**Run / config:** [`apps/reg-scraper-py/README.md`](../apps/reg-scraper-py/README.md)  
**PR setup:** [`PR_SETUP.md`](./PR_SETUP.md)

---

## What the scraper gives you

```
Reg Chula  →  reg-scraper-py  →  courses.json  +  scraper-status.json  +  PostgreSQL (optional)
                                         ↓
                              apps/core API reads DB (your existing code)
                                         ↓
                              apps/cugetreg frontend
```

| Output | Path | Use |
|--------|------|-----|
| Course data (JSON) | `apps/core/bin/courses.json` | Inspect, seed scripts, tests without DB |
| Run status | `apps/reg-scraper-py/data/scraper-status.json` | Progress UI at `/scraper` |
| Course data (DB) | Postgres via `DATABASE_URL` | Production path for `apps/core` API |

---

## Backend dev

1. Start Postgres: `cd apps/core && docker compose up -d && pnpm prisma migrate dev`
2. Run scraper with postgres export (same `DATABASE_URL` as `apps/core/.env`):
   ```env
   SCRAPER_EXPORTERS=postgres
   SCRAPER_MAX_COURSES=20   # raise or set 0 for full scrape
   ```
3. From repo root: `pnpm scraper:run`
4. Verify data landed:
   ```powershell
   # JSON file exists
   type apps\core\bin\courses.json

   # Or query DB after postgres export
   curl "http://localhost:3000/api/v1/courses?studyProgram=S&academicYear=2568&semester=SECOND&limit=5"
   ```

Field names and DB column mapping: see **DATA_FORMAT.md**.

---

## Frontend dev

1. You do **not** read `courses.json` directly on the home page — the app uses `GET /api/v1/courses` (backend reads DB).
2. For scrape progress during dev: http://localhost:5173/scraper (reads status JSON via server route).
3. Match UI semester/year/program filters to what was scraped (`SCRAPER_*` in scraper `.env`).

---

## Scraper dev — quick commands

```powershell
# Safe test — JSON only, no DB
cd apps/reg-scraper-py
copy .env.example .env
pnpm scraper:run   # from repo root
```

Check `scraper-status.json` → `"status": "completed"` and `courses.json` has data.

Full scope example in `.env`:

```env
SCRAPER_ACADEMIC_YEARS=2568
SCRAPER_STUDY_PROGRAMS=S,T,I
SCRAPER_SEMESTERS=1,2,3
SCRAPER_MAX_COURSES=0
SCRAPER_EXPORTERS=json,postgres
```

---

## Suggested handoff workflow

1. Scraper dev runs export for target term (e.g. 2568 / 2 / S,T,I).
2. Backend dev confirms rows in Postgres or inspects `courses.json`.
3. Frontend dev picks matching year/semester in the UI and tests course list + detail.

No API or frontend code changes are required from the scraper side — only fresh data in the agreed output locations.
