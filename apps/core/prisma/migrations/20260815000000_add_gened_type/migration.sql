-- AlterEnum
-- gened.chula.ac.th publishes some GenEd courses without an area
-- (Science / Social / Humanities / Interdisciplinary). 'GENED' records that
-- state instead of forcing those courses into an area they do not belong to.
ALTER TYPE "gen_ed_type" ADD VALUE 'GENED';
