/*
  Replace generated columns with trigger-maintained plain columns.

  GENERATED ALWAYS AS ... STORED columns are invisible to Prisma ORM's
  drift detection, which causes `prisma migrate dev` to auto-generate a
  destructive migration that drops them and breaks TypedSQL queries.

  The fix:
    1. Convert the generated columns to plain INTEGER columns.
    2. Create a BEFORE INSERT/UPDATE trigger that populates them from
       period_start / period_end using the same expression.
    3. Restore the GiST expression index for overlap queries.

  This handles three possible database states:
    A. Fresh clone — generated columns exist from migration
       20260618000000_add_course_class_overlap.
    B. Broken state — auto-generated drift migration already dropped them.
    C. Re-running — trigger and plain columns already in place (no-op).
*/

-- 1. Drop the GiST index first (it references the generated columns).
DROP INDEX IF EXISTS idx_course_class_period_gist;

-- 2. Strip generated expression, or add back as plain columns if missing.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'course_class'
          AND table_schema = current_schema()
          AND column_name = 'period_start_minutes'
          AND is_generated = 'ALWAYS'
    ) THEN
        -- State A: generated columns exist — convert to plain.
        EXECUTE 'ALTER TABLE course_class ALTER COLUMN period_start_minutes DROP EXPRESSION';
        EXECUTE 'ALTER TABLE course_class ALTER COLUMN period_end_minutes DROP EXPRESSION';
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'course_class'
          AND table_schema = current_schema()
          AND column_name = 'period_start_minutes'
    ) THEN
        -- State B: columns were dropped — re-add as plain INTEGER.
        EXECUTE 'ALTER TABLE course_class ADD COLUMN period_start_minutes INTEGER';
        EXECUTE 'ALTER TABLE course_class ADD COLUMN period_end_minutes INTEGER';
    END IF;
    -- State C: already plain columns — nothing to do.
END $$;

-- 3. Trigger function: replicates the original generated-column logic.
CREATE OR REPLACE FUNCTION trg_course_class_period_minutes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.period_start_minutes := CASE
        WHEN NEW.period_start ~ '^([01]\d|2[0-3]):[0-5]\d$'
        THEN CAST(substring(NEW.period_start, 1, 2) AS INTEGER) * 60
           + CAST(substring(NEW.period_start, 4, 2) AS INTEGER)
    END;
    NEW.period_end_minutes := CASE
        WHEN NEW.period_end ~ '^([01]\d|2[0-3]):[0-5]\d$'
        THEN CAST(substring(NEW.period_end, 1, 2) AS INTEGER) * 60
           + CAST(substring(NEW.period_end, 4, 2) AS INTEGER)
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach the trigger (fires on every INSERT or UPDATE to guarantee
--    period_start_minutes/period_end_minutes always match the source columns).
DROP TRIGGER IF EXISTS trg_course_class_period_minutes ON course_class;
CREATE TRIGGER trg_course_class_period_minutes
    BEFORE INSERT OR UPDATE
    ON course_class
    FOR EACH ROW
    EXECUTE FUNCTION trg_course_class_period_minutes();

-- 5. Backfill existing rows (self-assignment fires the trigger above).
UPDATE course_class SET period_start = period_start, period_end = period_end;

-- 6. Recreate the GiST expression index for overlap (&&) queries.
CREATE INDEX idx_course_class_period_gist
    ON course_class USING GIST (int4range(period_start_minutes, period_end_minutes, '[)'));

-- 7. Recreate the FK index on section_id if it was dropped by drift.
CREATE INDEX IF NOT EXISTS idx_course_class_section
    ON course_class (section_id);
