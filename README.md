## Development setup

This repo uses [pre-commit](https://pre-commit.com/) for git hooks (gitleaks secret
scanning, YAML/whitespace checks, conventional commit messages) — see
`.pre-commit-config.yaml`.

It installs itself automatically via `pnpm install` (see the `prepare` script in
`package.json`), as long as `pre-commit` is already on your `PATH`. To install it
manually:

```bash
pip install pre-commit  # or: brew install pre-commit
pre-commit install
pre-commit install --hook-type commit-msg
```

The second command is required separately — `conventional-pre-commit` runs at the
`commit-msg` stage, not the default `pre-commit` stage.
