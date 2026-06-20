# PR setup — `mvp1-dev-scrapper`

Branch adds **`apps/reg-scraper-py`** and wires scraped course data into the mvp1 stack (`apps/core` API + `apps/cugetreg` frontend).

API spec: [`GettingRekt.pdf`](../../GettingRekt.pdf)  
Integration notes: [`SCRAPER_AND_API_NEXT_STEPS.md`](./SCRAPER_AND_API_NEXT_STEPS.md)

---

## What this PR includes

- Python scraper (Reg Chula → JSON / PostgreSQL)
- Discovery-first pipeline + status file
- Frontend `/scraper` status page + `/api/scraper/status`
- Vite SSR fix for workspace packages (`@cugetreg/utils`, etc.)
- API alignment: `fitCartId`, `REMAINING_SUM` sort enum, PDF error codes for fit-cart flow

---

## Reviewer setup (copy-paste)

### 0. Prerequisites

- **Node ≥ 24.11** (for `apps/core` Prisma)
- **Python ≥ 3.11**
- **pnpm 10+**
- **Docker Desktop** (PostgreSQL)

### 1. Install monorepo

```powershell
cd cugetreg
pnpm install --ignore-scripts
pnpm --filter @cugetreg/ui prepack
```

### 2. Environment files

```powershell
copy apps\core\.env.example apps\core\.env
copy apps\cugetreg\.env.example apps\cugetreg\.env
copy apps\reg-scraper-py\.env.example apps\reg-scraper-py\.env
copy apps\core\bin\overrides.example.json apps\core\bin\overrides.json
```

Edit `apps/core/.env` if you use custom Google OAuth credentials (optional for course list without login).

### 3. Database + API

```powershell
cd apps\core
docker compose up -d
pnpm prisma migrate dev
pnpm codegen
pnpm dev
```

Verify: http://localhost:3000/api/v1/docs

### 4. Scraper (safe test — no DB)

```powershell
cd apps\reg-scraper-py
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
pnpm scraper:run
```

Check:

- `apps/reg-scraper-py/data/scraper-status.json` → `"status": "completed"`
- `apps/core/bin/courses.json` → array of courses

### 5. Scraper → Postgres (optional integration test)

In `apps/reg-scraper-py/.env`:

```env
SCRAPER_EXPORTERS=json,postgres
SCRAPER_MAX_COURSES=20
```

Ensure `DATABASE_URL` matches `apps/core/.env`, then:

```powershell
pnpm scraper:run
curl "http://localhost:3000/api/v1/courses?studyProgram=S&academicYear=2568&semester=SECOND&limit=5"
```

### 6. Frontend

```powershell
cd apps\cugetreg
pnpm dev
```

| URL | Expected |
|-----|----------|
| http://localhost:5173/scraper | Scraper status |
| http://localhost:5173/ | Course search (needs DB data + matching semester filter) |

---

## Env reference

| App | File | Key vars |
|-----|------|----------|
| `apps/core` | `.env` | `DATABASE_URL`, `POSTGRES_*`, `BETTER_AUTH_*`, `GOOGLE_*` |
| `apps/cugetreg` | `.env` | `PUBLIC_API_URL`, `API_URL`, `SCRAPER_STATUS_PATH` |
| `apps/reg-scraper-py` | `.env` | `SCRAPER_*`, `DATABASE_URL`, export paths |

**Never commit `.env` files** — only `.env.example` is tracked.

---

## PR test plan

- [ ] `pnpm --filter @cugetreg/ui prepack` succeeds
- [ ] `apps/core` starts; `/api/v1/docs` loads
- [ ] `pnpm scraper:run` completes (JSON-only default)
- [ ] `/scraper` page shows status without 500
- [ ] With postgres export: `GET /api/v1/courses` returns scraped courses
- [ ] Home page shows courses for selected year/semester/program

---

## Out of scope (follow-up PRs)

- Full API 1.1 `meta` wrapper + `fitMySchedule` response fields
- 1.2 response shape match to PDF
- Admin Group 6 routes
- Public cart import (4.2 — explicitly skipped in spec)
