DO $$
DECLARE
    invalid_faculties TEXT;
BEGIN
    SELECT string_agg(source || ':' || faculty, ', ' ORDER BY source, faculty)
    INTO invalid_faculties
    FROM (
        SELECT 'course_info' AS source, faculty
        FROM "course_info"
        WHERE faculty IS NOT NULL
          AND faculty NOT IN (
              '01', '02', '20', '21', '22', '23', '24', '25', '26', '27',
              '28', '29', '30', '31', '32', '33', '34', '35', '36', '37',
              '38', '39', '40', '49', '51', '53', '55', '56', '58', '63',
              '92', '99'
          )
        UNION
        SELECT 'user' AS source, faculty
        FROM "user"
        WHERE faculty IS NOT NULL
          AND faculty NOT IN (
              '01', '02', '20', '21', '22', '23', '24', '25', '26', '27',
              '28', '29', '30', '31', '32', '33', '34', '35', '36', '37',
              '38', '39', '40', '49', '51', '53', '55', '56', '58', '63',
              '92', '99'
          )
    ) AS invalid_values;

    IF invalid_faculties IS NOT NULL THEN
        RAISE EXCEPTION 'Invalid faculty values must be corrected before migration: %', invalid_faculties;
    END IF;
END $$;

CREATE TYPE "Faculty" AS ENUM (
    '01', '02', '20', '21', '22', '23', '24', '25', '26', '27',
    '28', '29', '30', '31', '32', '33', '34', '35', '36', '37',
    '38', '39', '40', '49', '51', '53', '55', '56', '58', '63',
    '92', '99'
);

ALTER TABLE "course_info"
ALTER COLUMN "faculty" TYPE "Faculty"
USING ("faculty"::TEXT::"Faculty");

ALTER TABLE "user"
ALTER COLUMN "faculty" TYPE "Faculty"
USING ("faculty"::TEXT::"Faculty");
