-- Add generated integer columns on course_class for efficient overlap queries.
-- These replace the previous course_class_period shadow table + trigger approach
-- which was prone to drift and silent failures.
--
-- Generated columns are computed by Postgres automatically on every insert/update
-- and are NULL for sentinel values (IA, AR) or bad data, making overlap checks
-- both fast and self-synchronising.

-- 1. Cleanup existing bad data BEFORE adding generated columns / indexes.
--    Typo fixes: transposed digits (80:00→08:00, 90:00→09:00).
--    Swap fix: data-entry errors where start > end (e.g. 17:00–12:00 → 12:00–17:00).
--    Generated columns recompute automatically on UPDATE so order matters here.
UPDATE course_class SET period_start = '08:00' WHERE period_start = '80:00';
UPDATE course_class SET period_end   = '08:00' WHERE period_end   = '80:00';
UPDATE course_class SET period_start = '09:00' WHERE period_start = '90:00';
UPDATE course_class SET period_end   = '09:00' WHERE period_end   = '90:00';
UPDATE course_class
  SET period_start = period_end, period_end = period_start
  WHERE period_start ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
    AND period_end   ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
    AND period_start > period_end;

-- 2. Add generated columns (NULL for IA/AR/bad times)
ALTER TABLE course_class
  ADD COLUMN period_start_minutes INTEGER
  GENERATED ALWAYS AS (
    CASE
      WHEN period_start ~ '^([01]\d|2[0-3]):[0-5]\d$'
      THEN CAST(substring(period_start, 1, 2) AS INTEGER) * 60
         + CAST(substring(period_start, 4, 2) AS INTEGER)
    END
  ) STORED;

ALTER TABLE course_class
  ADD COLUMN period_end_minutes INTEGER
  GENERATED ALWAYS AS (
    CASE
      WHEN period_end ~ '^([01]\d|2[0-3]):[0-5]\d$'
      THEN CAST(substring(period_end, 1, 2) AS INTEGER) * 60
         + CAST(substring(period_end, 4, 2) AS INTEGER)
    END
  ) STORED;

-- 3. GiST expression index on int4range for efficient overlap (&&) queries.
--    int4range is immutable with integer inputs so this works as an expression index.
--    Replaces the b-tree index which cannot efficiently serve double-inequality overlap checks.
DROP INDEX IF EXISTS idx_course_class_overlap;
CREATE INDEX idx_course_class_period_gist
  ON course_class USING GIST (int4range(period_start_minutes, period_end_minutes, '[)'));

-- 4. Index on section_id for the NOT EXISTS subquery in the cart-fit filter
--    (the FK constraint does not auto-create an index).
CREATE INDEX idx_course_class_section ON course_class (section_id);

-- 5. Drop the now-unused shadow table & trigger (may not exist on a fresh apply,
--    but present if the previous version of this migration was ever applied).
DROP TABLE IF EXISTS course_class_period CASCADE;
DROP FUNCTION IF EXISTS sync_course_class_period CASCADE;
