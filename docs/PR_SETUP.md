# PR setup — `mvp1-dev-scrapper`

Adds **`apps/reg-scraper-py`** and dev wiring (status page, root `pnpm scraper:run`).

**Data format for integrators:** [`apps/reg-scraper-py/DATA_FORMAT.md`](../apps/reg-scraper-py/DATA_FORMAT.md)

---

## What this PR includes

- Python scraper (Reg Chula → JSON / PostgreSQL)
- Discovery-first pipeline + `scraper-status.json`
- Frontend `/scraper` status page (reads local status file)
- Root script: `pnpm scraper:run`

Does **not** change `apps/core` API handlers or `apps/cugetreg` course pages — only delivers data they can consume.

---

## Reviewer setup

### Prerequisites

- Python ≥ 3.11
- pnpm 10+
- Docker Desktop (only if testing postgres export)

### 1. Install

```powershell
cd cugetreg
pnpm install --ignore-scripts
pnpm --filter @cugetreg/ui prepack
```

### 2. Scraper env

```powershell
cd apps\reg-scraper-py
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
copy .env.example .env
```

Default `.env` is safe: JSON-only, max 20 courses, no DB.

### 3. Run scraper (JSON test)

```powershell
# from repo root
pnpm scraper:run
```

Verify:

- `apps/reg-scraper-py/data/scraper-status.json` → `"status": "completed"`
- `apps/core/bin/courses.json` → non-empty array

### 4. Optional — postgres + API smoke test

```powershell
cd apps\core
copy .env.example .env
docker compose up -d
pnpm prisma migrate dev
pnpm codegen
pnpm dev
```

In `apps/reg-scraper-py/.env`:

```env
SCRAPER_EXPORTERS=json,postgres
DATABASE_URL=postgresql://admin:cugetreg@localhost:5432/cugetreg?schema=public
```

Run `pnpm scraper:run` again, then:

```powershell
curl "http://localhost:3000/api/v1/courses?studyProgram=S&academicYear=2568&semester=SECOND&limit=5"
```

### 5. Frontend status page

```powershell
cd apps\cugetreg
copy .env.example .env
pnpm dev
```

Open http://localhost:5173/scraper — should show last run status (no 500).

---

## PR test plan

- [ ] `pnpm scraper:run` completes with default `.env`
- [ ] `apps/core/bin/courses.json` populated
- [ ] `scraper-status.json` shows `completed`
- [ ] `/scraper` page loads
- [ ] (Optional) Postgres export + API returns courses

---

## Env reference

| App | File | Key vars |
|-----|------|----------|
| `apps/reg-scraper-py` | `.env` | `SCRAPER_*`, `SCRAPER_JSON_OUTPUT`, `SCRAPER_STATUS_OUTPUT`, `DATABASE_URL` |
| `apps/cugetreg` | `.env` | `SCRAPER_STATUS_PATH` (for `/scraper` page) |

Never commit `.env` — only `.env.example`.
