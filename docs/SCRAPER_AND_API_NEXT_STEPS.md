# Scraper + API integration — next steps

Branch: **`mvp1-dev-scrapper`**

Spec source: [`GettingRekt.pdf`](../../GettingRekt.pdf) (Final API Document)  
Live OpenAPI: **http://localhost:3000/api/v1/docs**

All routes: **`/api/v1/...`**

---

## Document overview (21 pages)

| Group | File | Endpoints |
|-------|------|-----------|
| 0 | Auth | Better Auth OAuth (cookies + session) |
| 1 | `courses.ts` | 1.1 List courses, 1.2 Course detail |
| 2 | `reviews.ts` | 2.1–2.4 Submit / vote / edit / delete review |
| 3 | `carts.ts` | 3.1–3.8 Timetables CRUD + items |
| 4 | `public_carts.ts` | 4.1 Public view (**4.2 import — explicitly out of scope**) |
| 5 | `user.ts` | 5.1–5.3 Profile + user reviews |
| 6 | `admin.ts` | CRUD per model (course, user, review) — 36 routes planned |

---

## How the scraper fits Group 1 (Courses)

The scraper **does not call the REST API**. It writes PostgreSQL rows that **1.1** and **1.2** read.

```
Reg Chula → reg-scraper-py → PostgreSQL → GET /api/v1/courses → apps/cugetreg Home
```

Scraper JSON shape must populate:

- `course_info` — names, credit, faculty, department, descriptions
- `course` — studyProgram, academicYear, semester, exams, genEdType
- `course_section` — sectionNo, closed, regis, max, note
- `course_class` — type, dayOfWeek, period, building, room, professors

Semester mapping: scraper uses `1/2/3` → DB uses `FIRST/SECOND/SUMMER` (already handled in postgres exporter).

---

## Group 1 — Courses (detail from PDF)

### 1.1 `GET /api/v1/courses`

**Auth:** Optional (must work logged out). **`fitCartId` requires login.**

**Query params:**

| Param | Values | Notes |
|-------|--------|-------|
| `studyProgram` | S, T, I | Required |
| `academicYear` | int | Required |
| `semester` | 1, 2, 3 | Required (doc uses numeric strings in examples) |
| `q` | string | Search courseNo, names, professor |
| `genEdType` | NO, SC, SO, HU, IN | Filter |
| `faculty` | string | Filter |
| `day` | MO…SU, AR, IA | Filter |
| `timeStart` / `timeEnd` | HH:MM | Filter |
| `noPrereq` | boolean | Filter |
| `fitCartId` | string | Fit-my-schedule (auth required) |
| `assessment` | LETTER, SU | SU = section ≥ 71 |
| `sortBy` | NAME, CAPACITY_SUM, REMAINING_SUM | Default: REMAINING_SUM |
| `sortOrder` | asc, desc | Default: desc |
| `limit` | int | Pagination |

**Response 200 (per PDF):**

```json
{
  "meta": { "context": {...}, "query": {...}, "total": 4123 },
  "data": [{
    "course": { "id", "studyProgram", "academicYear", "semester", "courseNo", "genEdType", "midtermStart", ... },
    "courseInfo": { "courseNo", "abbrName", "courseNameEn", "courseNameTh", ... },
    "stats": { "sectionsCount", "capacitySum", "remainingSum", "hasSeats", "isClosedAll" },
    "fitMySchedule": true
  }]
}
```

**Errors:** `INVALID_CONTEXT_PARAMS` (400), `UNAUTHORIZED` (401), `CART_NOT_FOUND_OR_NOT_OWNED` (404)

### 1.2 `GET /api/v1/courses/:courseNo`

**Query:** `studyProgram`, `academicYear`, `semester`

**Response:** Single `data` object with course fields, `sections[]`, embedded `reviews[]` (with `myVote`, `author`, etc.)

**Error:** `COURSE_NOT_FOUND` (404)

---

## Code vs PDF — gaps to fix

| Item | PDF spec | Current code | Owner |
|------|----------|--------------|-------|
| Query param name | `fitCartId` | **Aligned** in schema + handler + frontend |
| Frontend fit filter | `fitCartId` | `Home.svelte` sends `fitCartId` | Done |
| `sortBy` enum | `REMAINING_SUM` | **Aligned** in `packages/zod-schemas/constants.ts` | Done |
| 1.1 response wrapper | `{ meta, data }` | `{ data, total }` only | Backend |
| `fitMySchedule` field | Returned per course | Not computed | Backend |
| `courseInfo.courseNo` | In 1.1 response | May be missing | Backend |
| Semester query format | `1`, `2`, `3` | Zod enum `FIRST`, `SECOND`, `SUMMER` | Align — accept both or map |
| Semester in response | `"1"` string in examples | Enum names in DB/API | Align with doc |
| 1.2 response shape | Flat `data` + nested reviews | `{ course, reviews }` top-level | Backend + Frontend |
| Review vote body | `{ "interaction": "L" }` | Check `VoteReviewBodySchema` | Backend |
| 3.7 update item path | `PATCH /carts/:itemId` | `PATCH /carts/items/{itemId}` | Backend or update doc |
| 4.2 import public cart | Out of scope | Not implemented | Skip |
| Group 6 admin | 36 CRUD routes | `admin.ts` empty | Backend |
| `sortBy` enum | `REMAINING_SUM` | Fixed typo `REMAING_SUM` | Done |
| Scraper pipeline | Feeds Group 1 DB | Implemented on branch | Scraper |

---

## Backend dev — next steps

1. **Run stack:** `apps/core` + Docker Postgres + `pnpm prisma migrate dev` + `pnpm codegen`
2. **Align 1.1 with PDF (remaining):**
   - Add `meta` wrapper to list response
   - Compute and return `fitMySchedule` when `fitCartId` is set
   - Map semester query `1/2/3` ↔ `FIRST/SECOND/SUMMER` if needed
3. **Align 1.2** with PDF response shape (or document intentional differences)
4. **Load scraper data:** `SCRAPER_EXPORTERS=json,postgres` then verify:
   ```http
   GET /api/v1/courses?studyProgram=S&academicYear=2568&semester=2&limit=5
   ```
5. **Keep OpenAPI in sync:** http://localhost:3000/api/v1/docs
6. **Node ≥ 24** for Prisma in `apps/core`

---

## Frontend dev — next steps

1. **Setup:**
   ```powershell
   pnpm --filter @cugetreg/ui prepack
   cd apps/cugetreg && copy .env.example .env && pnpm dev
   ```
   `PUBLIC_API_URL=http://localhost:3000/api/v1`

2. **Home (1.1):**
   - Send `studyProgram`, `academicYear`, `semester` (confirm format with backend after alignment)
   - Use `fitCartId` for fit-my-schedule filter
   - Parse `{ meta, data }` once backend adds `meta`
   - Map `stats.*` and `fitMySchedule` in course cards

3. **Course detail (1.2):** Wire to `GET /courses/:courseNo` — update when backend matches PDF shape

4. **Schedule (3.x):** Carts API — paths may differ slightly from PDF for 3.7

5. **Scraper status (dev only):** `/scraper` — not in API doc; reads local JSON file

6. **Test without DB:** Scraper JSON-only + `/scraper` page  
   **Test with DB:** Scraper postgres export + Home page course list

---

## Scraper dev — quick reference

```powershell
# Safe test (no DB)
SCRAPER_EXPORTERS=json
SCRAPER_MAX_COURSES=5
pnpm scraper:run
```

```powershell
# Full integration test
SCRAPER_EXPORTERS=json,postgres
DATABASE_URL=<same as apps/core>
pnpm scraper:run
```

Outputs:

- `apps/reg-scraper-py/data/scraper-status.json`
- `apps/core/bin/courses.json`
- PostgreSQL (when postgres exporter enabled)

---

## Suggested workflow

1. **Scraper** → Postgres for target semester (e.g. 2568 / 2 / S)
2. **Backend** → Fix 1.1/1.2 gaps vs PDF; verify Swagger
3. **Frontend** → Home consumes 1.1; course page consumes 1.2
4. **QA** → Compare responses side-by-side with PDF examples in `GettingRekt.pdf`
