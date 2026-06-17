#!/usr/bin/env bash
set -euo pipefail

# ── Usage ─────────────────────────────────────────────────────────────────────
# Local DB (DATABASE_URL already set or using defaults):
#   ./migrate.sh --local
#   DATABASE_URL=postgresql://... ./migrate.sh --local
#
# Kubernetes (port-forwards svc/db in the cluster):
#   ./migrate.sh
#   NAMESPACE=prod ./migrate.sh

# ── Config ────────────────────────────────────────────────────────────────────
MODE="k8s"   # k8s | local
for arg in "$@"; do
  [[ "$arg" == "--local" ]] && MODE="local"
done

NAMESPACE="${NAMESPACE:-beta}"
LOCAL_PORT="${LOCAL_PORT:-5433}"
DB_SERVICE="db"
DB_REMOTE_PORT="5432"
DB_NAME="${DB_NAME:-cugetreg}"
DB_USER="${DB_USER:-admin}"
DB_PASS="${DB_PASS:-cugetreg}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PF_PID=""

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  if [[ -n "$PF_PID" ]]; then
    echo "Stopping port-forward (pid $PF_PID)..."
    kill "$PF_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# ── Resolve DATABASE_URL ──────────────────────────────────────────────────────
if [[ "$MODE" == "local" ]]; then
  # Use DATABASE_URL from env if already set, otherwise build from defaults
  if [[ -z "${DATABASE_URL:-}" ]]; then
    DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
    echo "Local mode — connecting to $DATABASE_URL"
  else
    echo "Local mode — using DATABASE_URL from environment"
  fi
else
  # Kubernetes mode — port-forward svc/db
  echo "Kubernetes mode — port-forwarding $DB_SERVICE.$NAMESPACE:$DB_REMOTE_PORT → localhost:$LOCAL_PORT"
  kubectl port-forward -n "$NAMESPACE" "svc/$DB_SERVICE" "${LOCAL_PORT}:${DB_REMOTE_PORT}" &
  PF_PID=$!

  # Wait until the port is open (up to 15 s)
  for i in $(seq 1 15); do
    if nc -z 127.0.0.1 "$LOCAL_PORT" 2>/dev/null; then
      echo "Port-forward ready."
      break
    fi
    if [[ $i -eq 15 ]]; then
      echo "ERROR: port-forward did not become ready in time." >&2
      exit 1
    fi
    sleep 1
  done

  DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:${LOCAL_PORT}/${DB_NAME}?schema=public"
fi

# ── Run migration ─────────────────────────────────────────────────────────────
echo "Running migration..."
cd "$SCRIPT_DIR"

DATABASE_URL="$DATABASE_URL" \
JWT_SECRET="${JWT_SECRET:-placeholder}" \
GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:-placeholder}" \
GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET:-placeholder}" \
APP_MODE="${APP_MODE:-dev}" \
BETTER_AUTH_SECRET="${BETTER_AUTH_SECRET:-placeholder}" \
BETTER_AUTH_URL="${BETTER_AUTH_URL:-http://localhost:3000/api/v1/auth}" \
npx tsx main_migrate.ts

echo "Done."
