-- The scraper updates seat counts (course_class/course_section) far more
-- often than the rest of the schema. At the default
-- autovacuum_vacuum_scale_factor (0.2), a 211k-row table like course_section
-- needs ~42k dead tuples before autovacuum runs — long enough for the
-- visibility map to go stale and turn "index-only" scans back into regular
-- heap-fetching scans (observed: 18,758 heap fetches on an index-only scan
-- of course_class in getCourseList.sql, dropping to 0 right after a manual
-- VACUUM). Lowering the scale factor to 0.05 makes autovacuum run ~4x more
-- often on these two tables, keeping the visibility map fresh without
-- needing manual vacuums.
ALTER TABLE "course_section" SET (autovacuum_vacuum_scale_factor = 0.05, autovacuum_analyze_scale_factor = 0.05);
ALTER TABLE "course_class" SET (autovacuum_vacuum_scale_factor = 0.05, autovacuum_analyze_scale_factor = 0.05);
