## Summary
Promote `mvp1-dev` → `v2-beta`.

<!-- Notable changes since last promotion. Fill via:
git log origin/v2-beta..origin/mvp1-dev --oneline -->
-

## Pre-merge checklist
- [ ] CI green on `mvp1-dev` (build/check/lint/test)
- [ ] Reviewed new migrations under `apps/core/prisma/migrations/` since last promotion — any that need manual coordination?
- [ ] Diff reviewed for anything not ready to ship

## After merge
Beta auto-deploys on merge (`update-mode: commit`, ArgoCD syncs immediately — no manual gitops PR step).
- [ ] Beta deploy workflow run: <link>
- [ ] Smoke-tested on beta: <url>
