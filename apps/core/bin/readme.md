# Data Migration

Place the following files in this folder before running:

- `courses.json`
- `overrides.json`
- `reviews.json`
- `users.json`

## Using the shell script (recommended)

### Against a Kubernetes cluster (port-forwards `svc/db` automatically)

```bash
./migrate.sh              # default: beta namespace
NAMESPACE=prod ./migrate.sh
```

### Against a local database

```bash
./migrate.sh --local

# or with a custom connection string
DATABASE_URL=postgresql://user:pass@localhost:5432/cugetreg ./migrate.sh --local
```

### Options

| Variable | Default | Description |
|---|---|---|
| `NAMESPACE` | `beta` | Kubernetes namespace (k8s mode only) |
| `LOCAL_PORT` | `5433` | Local port used for the port-forward (k8s mode only) |
| `DATABASE_URL` | built from below | Full connection string (local mode only) |
| `DB_HOST` | `127.0.0.1` | DB host (local mode, if DATABASE_URL not set) |
| `DB_PORT` | `5432` | DB port (local mode, if DATABASE_URL not set) |
| `DB_USER` | `admin` | DB user |
| `DB_PASS` | `cugetreg` | DB password |
| `DB_NAME` | `cugetreg` | DB name |

## Manual (tsx directly)

```bash
pnpx tsx --env-file=../.env main_migrate.ts
```

> If `process.env.DATABASE_URL` is not loaded, set it explicitly in the command above.
