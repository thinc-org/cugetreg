#!/bin/sh
# Guards against concurrent runs. `kubectl create job --from=cronjob/...`
# (manual/on-demand triggers) bypasses the CronJob controller entirely, so
# concurrencyPolicy: Forbid on the CronJob spec has no effect on it — a
# manual trigger fired while a scheduled run is still active would race the
# same Postgres DELETE+INSERT cycle and the same PVC-backed side-input files
# (overrides.json, course_desc.csv). Lock on a file inside /data instead,
# since every run — scheduled or manual — mounts the same PVC there.
#
# Uses the fd-based flock form (not `flock -n LOCK CMD`) so a lock-busy skip
# (exit 0, not a real failure) stays distinguishable from a genuine scraper
# failure (real exit code passed through via exec, so Kubernetes' backoffLimit
# retry logic still works correctly for actual errors).
set -e

# fd 9, not the more common "200" convention — dash (this image's /bin/sh)
# rejects fd numbers that high (verified: "exec: 200: not found").
exec 9>/data/.lock
if ! flock -n 9; then
  echo "Another scraper run is already in progress — skipping this run."
  exit 0
fi

exec python -m reg_scraper "$@"
