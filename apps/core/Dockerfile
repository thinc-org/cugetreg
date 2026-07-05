# syntax=docker/dockerfile:1
#
# Build context must be the monorepo root (./cugetreg), since this app
# depends on workspace packages (@cugetreg/zod-schemas):
#   docker build -f apps/core/Dockerfile -t my-registry/api:v2.0.0-beta .
#
# Requires deploy.sh (./main.sh --skip-seed) to have been run first so that
# prisma generate --sql has produced src/generated/prisma/sql.ts on disk.

ARG NODE_VERSION=24.11.1

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
RUN corepack enable

# Install workspace dependencies and build the app + its workspace deps
FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
# Generated Prisma client files (including sql.ts from TypedSQL) are already
# present in the build context: deploy.sh runs prisma generate and
# prisma generate --sql against the live DB before docker build is called.
# Re-running prisma generate here would wipe sql.ts, so we skip it.
RUN cd packages/zod-schemas && pnpm run build
RUN cd apps/core && pnpm run build
# Patch @cugetreg/zod-schemas exports to point to compiled dist/ files so that
# pnpm deploy includes .js outputs rather than raw .ts source that Node can't load.
RUN node -e "\
  const fs=require('fs');\
  const path='packages/zod-schemas/package.json';\
  const p=JSON.parse(fs.readFileSync(path,'utf8'));\
  for(const k in p.exports)p.exports[k]=p.exports[k].replace(/^\\.\\/(.*)\\.ts\$/,'./dist/\$1.js');\
  fs.writeFileSync(path,JSON.stringify(p,null,2));\
"
RUN pnpm --filter ./apps/core deploy --prod --legacy /tmp/deploy

# Final runtime image
FROM base AS final
ENV NODE_ENV=production
USER node
COPY --from=build /tmp/deploy/node_modules ./node_modules
COPY --from=build /tmp/deploy/dist ./dist
COPY --from=build /tmp/deploy/package.json ./package.json
COPY --from=build /tmp/deploy/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/index.js"]
