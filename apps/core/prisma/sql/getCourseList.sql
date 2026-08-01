-- getCourseList.sql
-- Returns paginated course list with section stats and class details.
--
-- @param {study_program} $1:studyProgram The study program code ('S', 'T', 'I')
-- @param {Int} $2:academicYear Academic year (e.g. 2566)
-- @param {semester} $3:semester The semester ('FIRST', 'SECOND', 'SUMMER')
-- @param {gen_ed_type} $4:genEdType? Optional GenEd type filter ('SC', 'SO', 'HU', 'IN')
-- @param {String} $5:faculty? Optional faculty code filter
-- @param {day_of_week} $6:day? Optional day of week filter ('MO'..'SU', 'AR', 'IR')
-- @param {grading_type} $7:assessment? Optional grading type filter ('LETTER', 'SU')
-- @param {String} $8:q? Optional text search query (caller wraps with %, e.g. '%query%')
-- @param {Boolean} $9:noPrereq? Optional — when true, only courses with no prerequisites
-- @param {String} $10:timeStart? Optional start time filter (HH:MM)
-- @param {String} $11:timeEnd? Optional end time filter (HH:MM)
-- @param {Int} $12:limit? Results per page (default 10)
-- @param {Int} $13:offset? Page offset (default 0)
-- @param {String} $14:sortBy? Sort column ('NAME', 'CAPACITY_SUM', 'REMAINING_SUM'; default 'REMAINING_SUM')
-- @param {String} $15:sortOrder? Sort direction ('ASC', 'DESC'; default 'ASC')
-- @param {String} $16:fitCartId? Optional cart ID — when set, excludes sections whose classes overlap with the cart's sections
-- @param {Decimal} $17:creditMin? Optional minimum credit
-- @param {Decimal} $18:creditMax? Optional maximum credit

-- Perf note: LIMIT/OFFSET are applied in `paginated_courses` (Stage A), before
-- the expensive per-class JSON aggregation in `section_json` (Stage B). Stage B
-- only builds nested class JSON for the courses on the requested page, instead
-- of for every course matching the filters — the previous version aggregated
-- classes for the *entire* filtered term on every request regardless of page
-- size. `matching_sections`/`section_stats` still scan the whole filtered term
-- (sorting by capacity/remaining and computing total_count require knowing
-- every matching course first), but that's course+section-level work, far
-- cheaper than building nested class JSON for courses that get discarded by
-- pagination anyway.

-- Step 0: Precompute cart's occupied class slots once (avoids a correlated
--         subquery in matching_sections when $16 is provided).
--         period_start_minutes/period_end_minutes are trigger-maintained columns
--         on course_class; NULL for IA/AR/bad times.
WITH occupied_slots AS MATERIALIZED (
    SELECT cl_occ.day_of_week,
           cl_occ.period_start_minutes,
           cl_occ.period_end_minutes
    FROM cart_item ci
    JOIN course c_occ
        ON c_occ.course_no = ci.course_no
        AND c_occ.study_program = $1::study_program
        AND c_occ.academic_year = $2
        AND c_occ.semester = $3::semester
    JOIN course_section cs_occ
        ON cs_occ.course_id = c_occ.id
        AND cs_occ.section_no = ci.section_no
    JOIN course_class cl_occ
        ON cl_occ.section_id = cs_occ.id
    WHERE ci.cart_id = $16::text
      AND $16::text IS NOT NULL
      AND cl_occ.period_start_minutes IS NOT NULL
      AND cl_occ.period_end_minutes IS NOT NULL
),

-- Step 1: Find sections that pass ALL filters (course-level + section-level).
--         Uses LEFT JOIN on classes so day/time/professor conditions apply
--         per class row; DISTINCT deduplicates sections that have at least
--         one matching class.
matching_sections AS (
    SELECT DISTINCT
        s.id           AS section_id,
        s.course_id,
        s.section_no,
        s.closed,
        s.max,
        s.regis,
        s.note,
        s.gen_ed_type
    FROM course_section s
    JOIN course c             ON c.id = s.course_id
    JOIN course_info ci       ON ci.course_no = c.course_no
    LEFT JOIN course_class cl ON cl.section_id = s.id
    WHERE
        -- Course-level filters
        c.study_program = $1::study_program
        AND c.academic_year = $2
        AND c.semester = $3::semester

        -- GenEd type (optional)
        AND ($4::gen_ed_type[] IS NULL OR c.gen_ed_type = ANY($4::gen_ed_type[]))

        -- Faculty (optional)
        AND ($5::text[] IS NULL OR ci.faculty = ANY($5::text[]))

        -- Grading type (optional)
        AND ($7::grading_type IS NULL OR ci.grading_type = $7::grading_type)

        -- Credit range (optional)
        AND ($17::numeric IS NULL OR ci.credit >= $17::numeric)
        AND ($18::numeric IS NULL OR ci.credit <= $18::numeric)

        -- No prereq (optional boolean)
        AND ($9::boolean IS NOT TRUE
             OR c.course_condition IS NULL
             OR c.course_condition = ''
             OR c.course_condition = '-')

        -- Text search: course_no, abbr_name, names, OR professor name
        -- (professor search is per-class; sections without classes won't match via this path)
        AND (
            $8::text IS NULL
            OR c.course_no ILIKE $8
            OR ci.abbr_name ILIKE $8
            OR ci.course_name_en ILIKE $8
            OR ci.course_name_th ILIKE $8
            OR cl.professors::text ILIKE $8
        )

        -- Day/time filter: at least one class in the section matches
        -- (when no filter is set, ALL sections pass)
        AND (
            ($6::day_of_week[] IS NULL AND $10::text IS NULL AND $11::text IS NULL)
            OR (
                cl.id IS NOT NULL
                AND ($6::day_of_week[] IS NULL OR cl.day_of_week = ANY($6::day_of_week[]))
                AND ($10::text IS NULL OR cl.period_start_minutes IS NOT NULL AND cl.period_start_minutes >= (CAST(substring($10::text, 1, 2) AS INTEGER) * 60 + CAST(substring($10::text, 4, 2) AS INTEGER)))
                AND ($11::text IS NULL OR cl.period_end_minutes IS NOT NULL AND cl.period_end_minutes <= (CAST(substring($11::text, 1, 2) AS INTEGER) * 60 + CAST(substring($11::text, 4, 2) AS INTEGER)))
            )
        )

        -- Cart-fit filter: exclude sections whose classes overlap with any
        -- precomputed occupied_slots from the cart, or whose classes have no
        -- fixed period (IA/AR/zero-duration).  $16 is the cart ID;
        -- pass null to skip the filter entirely.
        --
        -- Uses a GiST expression index on int4range(period_start_minutes, period_end_minutes)
        -- for efficient overlap (&&) lookups.  int4range returns NULL when either argument
        -- is NULL, so classes with IA/AR/bad times naturally fail the overlap check and
        -- are caught by the IS NULL clause below.
        AND (
            $16::text IS NULL
            OR NOT EXISTS (
                SELECT 1 FROM course_class cl_self
                WHERE cl_self.section_id = s.id
                  AND (
                      cl_self.period_start_minutes IS NULL
                      OR EXISTS (
                          SELECT 1 FROM occupied_slots occ
                          WHERE occ.day_of_week = cl_self.day_of_week
                            AND int4range(cl_self.period_start_minutes, cl_self.period_end_minutes, '[)') &&
                                int4range(occ.period_start_minutes, occ.period_end_minutes, '[)')
                      )
                  )
            )
        )
),

-- Step 2: Distinct list of matching course IDs (used for total count)
matching_courses AS (
    SELECT DISTINCT course_id FROM matching_sections
),

-- Step 3: Aggregate section-level stats per course
section_stats AS (
    SELECT
        course_id,
        COUNT(*)::int                          AS sections_count,
        COALESCE(SUM(max), 0)::int             AS capacity_sum,
        COALESCE(SUM(max - regis), 0)::int     AS remaining_sum,
        COUNT(*) FILTER (WHERE closed)::int    AS closed_sections_count
    FROM matching_sections
    GROUP BY course_id
),

-- Step 4 (Stage A): Sort + paginate at the COURSE level, before touching any
--         class-level data. This is the key perf fix — LIMIT/OFFSET happen
--         here, so Stage B (below) only ever aggregates classes for the
--         courses that actually made it onto this page.
--         `__rank` preserves this exact order through the GROUP BY in the
--         final SELECT (GROUP BY does not guarantee output order).
paginated_courses AS (
    SELECT
        c.id,
        c.course_no,
        c.study_program,
        c.academic_year,
        c.semester,
        c.gen_ed_type,
        c.course_condition,
        c.midterm_start,
        c.midterm_end,
        c.final_start,
        c.final_end,
        ci.abbr_name,
        ci.course_name_en,
        ci.course_name_th,
        ci.course_desc_en,
        ci.course_desc_th,
        ci.faculty,
        ci.department,
        ci.credit::text                            AS credit,
        ci.credit_hours,
        ci.grading_type,
        COALESCE(ss.sections_count, 0)::int         AS sections_count,
        COALESCE(ss.capacity_sum, 0)::int           AS capacity_sum,
        COALESCE(ss.remaining_sum, 0)::int          AS remaining_sum,
        COALESCE(ss.closed_sections_count, 0)::int  AS closed_sections_count,
        COUNT(*) OVER ()::int                       AS total_count,
        ROW_NUMBER() OVER (
            ORDER BY
                -- NAME sort
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN ci.abbr_name       END ASC  NULLS LAST,
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN ci.abbr_name       END DESC NULLS LAST,
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN ci.course_name_en  END ASC  NULLS LAST,
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN ci.course_name_en  END DESC NULLS LAST,

                -- CAPACITY_SUM sort
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'CAPACITY_SUM'  AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN COALESCE(ss.capacity_sum, 0)  END ASC  NULLS LAST,
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'CAPACITY_SUM'  AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN COALESCE(ss.capacity_sum, 0)  END DESC NULLS LAST,

                -- REMAINING_SUM sort (also the default when sort_by is unset/null)
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'REMAINING_SUM' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN COALESCE(ss.remaining_sum, 0) END ASC  NULLS LAST,
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'REMAINING_SUM' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN COALESCE(ss.remaining_sum, 0) END DESC NULLS LAST,

                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'COURSE_NO' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN c.course_no END ASC  NULLS LAST,
                CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'COURSE_NO' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN c.course_no END DESC NULLS LAST,
                -- Tiebreaker (always applied)
                c.course_no ASC
        ) AS __rank
    FROM course c
    JOIN course_info ci           ON ci.course_no = c.course_no
    JOIN matching_courses mc      ON mc.course_id = c.id
    LEFT JOIN section_stats ss    ON ss.course_id = c.id
    ORDER BY
        -- Same ordering as the window function above — this is what LIMIT/OFFSET
        -- actually act on (window ORDER BY only affects ROW_NUMBER's values, not
        -- physical row order for LIMIT purposes).
        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN ci.abbr_name       END ASC  NULLS LAST,
        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN ci.abbr_name       END DESC NULLS LAST,
        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN ci.course_name_en  END ASC  NULLS LAST,
        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'NAME'    AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN ci.course_name_en  END DESC NULLS LAST,

        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'CAPACITY_SUM'  AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN COALESCE(ss.capacity_sum, 0)  END ASC  NULLS LAST,
        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'CAPACITY_SUM'  AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN COALESCE(ss.capacity_sum, 0)  END DESC NULLS LAST,

        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'REMAINING_SUM' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN COALESCE(ss.remaining_sum, 0) END ASC  NULLS LAST,
        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'REMAINING_SUM' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN COALESCE(ss.remaining_sum, 0) END DESC NULLS LAST,

        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'COURSE_NO' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'asc'  THEN c.course_no END ASC  NULLS LAST,
        CASE WHEN COALESCE(NULLIF($14::text, ''), 'REMAINING_SUM') = 'COURSE_NO' AND COALESCE(NULLIF($15::text, ''), 'asc') = 'desc' THEN c.course_no END DESC NULLS LAST,
        c.course_no ASC
    LIMIT COALESCE(NULLIF($12::int, 0), 10)
    OFFSET COALESCE($13::int, 0)
),

-- Step 5 (Stage B): Per-section JSON with all classes — restricted to only
--         the courses in `paginated_courses` (the join to `pc` below is what
--         bounds this to page size instead of the whole filtered term).
--         LEFT JOIN so ALL classes appear, not just those that matched the
--         day/time filter.
section_json AS (
    SELECT
        ms.course_id,
        ms.section_id,
        ms.section_no,
        ms.closed,
        ms.max          AS capacity_max,
        ms.regis        AS capacity_current,
        ms.note,
        ms.gen_ed_type,
        COALESCE(
            json_agg(
                json_build_object(
                    'id',          cl.id,
                    'type',        cl.type,
                    'dayOfWeek',   cl.day_of_week,
                    'professors',  cl.professors,
                    'periodStart', cl.period_start,
                    'periodEnd',   cl.period_end,
                    'building',    cl.building,
                    'room',        cl.room
                )
                ORDER BY cl.type, cl.day_of_week
            ) FILTER (WHERE cl.id IS NOT NULL),
            '[]'::json
        ) AS classes
    FROM matching_sections ms
    JOIN paginated_courses pc ON pc.id = ms.course_id
    LEFT JOIN course_class cl ON cl.section_id = ms.section_id
    GROUP BY
        ms.course_id, ms.section_id, ms.section_no, ms.closed,
        ms.max, ms.regis, ms.note, ms.gen_ed_type
)

-- Final result: one row per course with nested sections JSON
SELECT
    pc.id,
    pc.course_no,
    pc.study_program,
    pc.academic_year,
    pc.semester,
    pc.gen_ed_type,
    pc.course_condition,
    pc.midterm_start,
    pc.midterm_end,
    pc.final_start,
    pc.final_end,
    pc.abbr_name,
    pc.course_name_en,
    pc.course_name_th,
    pc.course_desc_en,
    pc.course_desc_th,
    pc.faculty,
    pc.department,
    pc.credit,
    pc.credit_hours,
    pc.grading_type,
    pc.sections_count,
    pc.capacity_sum,
    pc.remaining_sum,
    pc.closed_sections_count,
    COALESCE(
        json_agg(
            json_build_object(
                'id',         sj.section_id,
                'sectionNo',  sj.section_no,
                'closed',     sj.closed,
                'capacity',   json_build_object(
                    'current', sj.capacity_current,
                    'max',     sj.capacity_max
                ),
                'note',       sj.note,
                'genEdType',  sj.gen_ed_type,
                'classes',    sj.classes
            )
            ORDER BY sj.section_no
        ) FILTER (WHERE sj.section_id IS NOT NULL),
        '[]'::json
    ) AS sections,
    pc.total_count
FROM paginated_courses pc
LEFT JOIN section_json sj ON sj.course_id = pc.id
GROUP BY
    pc.id, pc.course_no, pc.study_program, pc.academic_year, pc.semester, pc.gen_ed_type,
    pc.course_condition, pc.midterm_start, pc.midterm_end, pc.final_start, pc.final_end,
    pc.abbr_name, pc.course_name_en, pc.course_name_th, pc.course_desc_en, pc.course_desc_th,
    pc.faculty, pc.department, pc.credit, pc.credit_hours, pc.grading_type,
    pc.sections_count, pc.capacity_sum, pc.remaining_sum, pc.closed_sections_count,
    pc.total_count, pc.__rank
ORDER BY pc.__rank;
