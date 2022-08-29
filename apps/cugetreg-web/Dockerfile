FROM node:16.17.0-buster
WORKDIR /app

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY dist/apps/cugetreg-web/next.config.js ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY dist/apps/cugetreg-web/.next/standalone ./
COPY dist/apps/cugetreg-web/public ./apps/cugetreg-web/public
COPY dist/apps/cugetreg-web/.next/static ./dist/apps/cugetreg-web/.next/static

EXPOSE 4200
ENV PORT 4200

CMD ["node", "apps/cugetreg-web/server.js"]
