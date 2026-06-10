# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.11.1

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
EXPOSE 3000

# Install production dependencies only, into a separate layer
FROM base AS deps
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --omit=dev

# Install full dependencies and build the app
FROM base AS build
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci
COPY . .
# prisma.config.ts requires DATABASE_URL to be resolvable; codegen never connects to it
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
RUN npm run codegen
RUN npm run build

# Final runtime image
FROM base AS final
ENV NODE_ENV=production
USER node
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]
