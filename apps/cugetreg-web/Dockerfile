FROM cugetreg-base AS builder

COPY . .

RUN pnpm nx build cugetreg-web
RUN pnpm nx postbuild cugetreg-web

FROM node:16.17.0-buster
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/dist/apps/cugetreg-web/next.config.js ./

COPY --from=builder /app/dist/apps/cugetreg-web/.next/standalone ./
COPY --from=builder /app/dist/apps/cugetreg-web/public ./apps/cugetreg-web/public
COPY --from=builder /app/dist/apps/cugetreg-web/.next/static ./dist/apps/cugetreg-web/.next/static

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 4200
ENV PORT 4200

CMD ["node", "apps/cugetreg-web/server.js"]
