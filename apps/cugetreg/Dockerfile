# syntax=docker/dockerfile:1
#
# Build context must be the monorepo root (./cugetreg), since this app
# depends on workspace packages (@cugetreg/ui, @cugetreg/utils, @cugetreg/zod-schemas):
#   docker build -f apps/cugetreg/Dockerfile -t my-registry/web:v1.0.0-beta .

ARG NODE_VERSION=24.11.1

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
RUN corepack enable

# Install workspace dependencies and build the app + its workspace deps
FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=cugetreg
# adapter-node's build/ still imports @sveltejs/kit at runtime, so deploy a
# self-contained copy with a pruned, production-only node_modules
RUN pnpm --filter ./apps/cugetreg deploy --prod --legacy /tmp/deploy

FROM base AS final
ENV NODE_ENV=production
ENV PORT=3000
USER node
COPY --from=build /tmp/deploy/node_modules ./node_modules
COPY --from=build /tmp/deploy/build ./build
COPY --from=build /tmp/deploy/package.json ./package.json

EXPOSE 3000
CMD ["node", "build/index.js"]
