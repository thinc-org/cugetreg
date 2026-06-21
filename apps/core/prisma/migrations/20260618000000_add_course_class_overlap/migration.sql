-- Add course_class_period shadow table for tsrange-based overlap queries
-- NOT managed by Prisma (tsrange is not supported by Prisma client).
-- Kept in sync via an AFTER trigger on course_class.

-- 1. Create shadow table
CREATE TABLE course_class_period (
  section_class_id TEXT        PRIMARY KEY REFERENCES course_class(id) ON DELETE CASCADE,
  day_of_week      day_of_week NOT NULL,
  period_range     TSRANGE     NOT NULL
);

-- 2. GiST index for efficient overlap (&&) and containment (@>) queries
CREATE INDEX idx_course_class_period_range
  ON course_class_period USING GIST (period_range);

-- 3. Trigger function to keep shadow table in sync
CREATE OR REPLACE FUNCTION sync_course_class_period()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    -- PK cascade handles deletion, but be explicit for safety
    DELETE FROM course_class_period WHERE section_class_id = OLD.id;
    RETURN OLD;
  END IF;

  -- Only insert/update rows with valid HH:MM times; skip sentinels (IA, AR)
  -- Also skip zero-duration or reversed times (start >= end) to avoid tsrange errors
  IF NEW.period_start ~ '^([01]\d|2[0-3]):[0-5]\d$'
     AND NEW.period_end ~ '^([01]\d|2[0-3]):[0-5]\d$'
     AND NEW.period_start < NEW.period_end
  THEN
    INSERT INTO course_class_period (section_class_id, day_of_week, period_range)
    VALUES (
      NEW.id,
      NEW.day_of_week,
      tsrange(
        ('2000-01-01 ' || NEW.period_start)::timestamp,
        ('2000-01-01 ' || NEW.period_end)::timestamp,
        '[)'   -- inclusive lower, exclusive upper bound
      )
    )
    ON CONFLICT (section_class_id) DO UPDATE SET
      day_of_week  = EXCLUDED.day_of_week,
      period_range = EXCLUDED.period_range;
  ELSE
    -- Row now has a non-time value (IA, AR, etc.) — remove stale shadow row
    DELETE FROM course_class_period WHERE section_class_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach trigger to course_class
CREATE TRIGGER trg_course_class_period
  AFTER INSERT OR UPDATE OR DELETE ON course_class
  FOR EACH ROW
  EXECUTE FUNCTION sync_course_class_period();

-- 5. Backfill existing valid data
INSERT INTO course_class_period (section_class_id, day_of_week, period_range)
SELECT
  id,
  day_of_week,
  tsrange(
    ('2000-01-01 ' || period_start)::timestamp,
    ('2000-01-01 ' || period_end)::timestamp,
    '[)'
  )
FROM course_class
WHERE period_start ~ '^([01]\d|2[0-3]):[0-5]\d$'
  AND period_end   ~ '^([01]\d|2[0-3]):[0-5]\d$'
  AND period_start < period_end
ON CONFLICT (section_class_id) DO NOTHING;

-- 6. Cleanup existing bad data (typos) in course_class
--    The trigger fires on UPDATE and auto-syncs the shadow table.
UPDATE course_class SET period_start = '08:00' WHERE period_start = '80:00';
UPDATE course_class SET period_end   = '08:00' WHERE period_end   = '80:00';
UPDATE course_class SET period_start = '09:00' WHERE period_start = '90:00';
UPDATE course_class SET period_end   = '09:00' WHERE period_end   = '90:00';
