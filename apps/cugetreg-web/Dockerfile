FROM node:14-alpine AS builder
WORKDIR /app

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY dist/apps/cugetreg-web/next.config.js ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY dist/apps/cugetreg-web/.next/standalone ./
COPY dist/apps/cugetreg-web/public ./apps/cugetreg-web/public
COPY dist/apps/cugetreg-web/.next/static ./dist/apps/cugetreg-web/.next/static

# # Generate Prisma Client
# RUN npm install -g prisma
# COPY apps/cugetreg-web-backend/src/prisma/schema.prisma ./schema.prisma
# RUN npx prisma generate --schema=schema.prisma

FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app .

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 4200
ENV PORT 4200

CMD ["node", "apps/cugetreg-web/server.js"]
