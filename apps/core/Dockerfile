# syntax=docker/dockerfile:1
#
# Build context must be the monorepo root (./cugetreg), since this app
# depends on workspace packages (@cugetreg/zod-schemas, @cugetreg/utils):
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
RUN cd packages/utils && pnpm run build
RUN cd apps/core && pnpm run build
# Patch workspace packages' exports to point to compiled dist/ files so that
# pnpm deploy includes .js outputs rather than raw .ts source that Node can't
# load (Node refuses to type-strip .ts files under node_modules). Any
# workspace package apps/core depends on at runtime needs a tsc build +
# an entry here, or it'll crash-loop the same way zod-schemas once did.
# Only rewrites entries with a matching dist/ file (packages/utils only
# builds the faculty.ts subpath apps/core actually imports — its other
# exports stay pointed at raw .ts, which is fine since nothing loads them
# in this image).
RUN node -e "\
  const fs=require('fs');\
  for(const path of ['packages/zod-schemas/package.json','packages/utils/package.json']){\
    const dir=path.slice(0,path.lastIndexOf('/')+1);\
    const p=JSON.parse(fs.readFileSync(path,'utf8'));\
    for(const k in p.exports){\
      const m=p.exports[k].match(/^\\.\\/(.*)\\.ts\$/);\
      if(m && fs.existsSync(dir+'dist/'+m[1]+'.js'))p.exports[k]='./dist/'+m[1]+'.js';\
    }\
    fs.writeFileSync(path,JSON.stringify(p,null,2));\
  }\
"
RUN pnpm --filter ./apps/core deploy --prod --legacy /tmp/deploy

# Final runtime image
FROM base AS final
ENV NODE_ENV=production
USER node
# --chown=node:node: without it these land root-owned (COPY preserves the
# build stage's ownership, which never switches off root) while the process
# runs as `node` — fine for read-only serving, but `prisma migrate deploy`
# writes into node_modules/.pnpm/@prisma+engines*/node_modules/@prisma/engines
# at runtime and gets a permission error without this.
COPY --from=build --chown=node:node /tmp/deploy/node_modules ./node_modules
COPY --from=build --chown=node:node /tmp/deploy/dist ./dist
COPY --from=build --chown=node:node /tmp/deploy/package.json ./package.json
COPY --from=build --chown=node:node /tmp/deploy/prisma ./prisma
COPY --from=build --chown=node:node /tmp/deploy/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["node", "dist/index.js"]
