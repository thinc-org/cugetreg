---
"@cugetreg/core": patch
"cugetreg": patch
---

feat: add Dockerfiles and Kubernetes deployment support

Add production Dockerfiles for core API and web app (adapter-node).
Support configurable CORS trusted origins via BETTER_AUTH_TRUSTED_ORIGINS env var.
Replace hardcoded API URLs with API_URL / PUBLIC_API_URL env vars.
Fix Google OAuth callbackURL to use window.location.origin dynamically.
