FROM cugetreg-base AS builder

COPY . .

RUN pnpm nx build cugetreg-api

FROM node:16.17.0-buster
WORKDIR /app

ENV NODE_ENV production
RUN npm install -g pnpm

COPY --from=builder /app/dist/apps/cugetreg-api/package.json .
COPY .npmrc pnpm-lock.yaml ./

RUN pnpm install -r --prod --prefer-offline

COPY --from=builder /app/dist/apps/cugetreg-api .

EXPOSE 3333

CMD ["node", "main.js"]
