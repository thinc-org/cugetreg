# When copying this Dockerfile for use in other apps, don't forget to change the scope (api, web, etc.) in RUN commands

FROM node:22-alpine AS pnpm
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install -g pnpm

# --------------------------------------------------------

FROM pnpm AS pruner
WORKDIR /app
RUN pnpm install -g turbo
COPY . .
RUN turbo prune --scope=reg-scraper --docker

# --------------------------------------------------------

FROM pnpm AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=reg-scraper...

# --------------------------------------------------------

FROM pnpm AS runner
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --production

COPY --from=builder /app/apps/reg-scraper/dist/ apps/reg-scraper/dist/
COPY --from=builder /app/packages/ packages/

CMD node apps/reg-scraper/dist/main.js
