## Summary
Promote `v2-beta` → `v2-prod`.

<!-- Notable changes since last promotion. Fill via:
git log origin/v2-prod..origin/v2-beta --oneline -->
-

## Pre-merge checklist
- [ ] CI green on `v2-beta`
- [ ] Verified on beta (duration / scenarios tested)
- [ ] Pending migrations reviewed — any table-lock risk during registration period?

## After merge
Prod deploy requires a manual gitops PR (`update-mode: pr` — ArgoCD will NOT pick this up until that PR is merged).
- [ ] gitops PR opened: <link>
- [ ] gitops PR reviewed + merged
- [ ] Prod deploy verified: <url>

## Rollback plan
<!-- how to revert quickly if something breaks in prod -->
