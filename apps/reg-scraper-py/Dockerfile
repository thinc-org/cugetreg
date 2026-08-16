# syntax=docker/dockerfile:1
#
# Unlike apps/core and apps/cugetreg, this app has zero dependency on the
# pnpm workspace, so the build context is this directory itself, not the
# monorepo root:
#   docker build -f apps/reg-scraper-py/Dockerfile -t my-registry/scraper:v1.0.0-beta apps/reg-scraper-py
#
# Runs as a Kubernetes CronJob (one-shot batch runs), not a long-lived
# server — see entrypoint.sh for the concurrency guard needed because manual
# `kubectl create job --from=cronjob/...` triggers bypass concurrencyPolicy.

ARG PYTHON_VERSION=3.12

FROM python:${PYTHON_VERSION}-slim AS base
# flock (util-linux) backs entrypoint.sh's concurrency guard.
RUN apt-get update && apt-get install -y --no-install-recommends util-linux \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY pyproject.toml ./
COPY src ./src
RUN pip install --no-cache-dir .

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN useradd --create-home --shell /usr/sbin/nologin scraper \
    && mkdir -p /data \
    && chown scraper:scraper /data
USER scraper

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["scrape"]
