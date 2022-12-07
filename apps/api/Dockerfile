FROM node:16.17.0-alpine
WORKDIR /usr/app

ENV NODE_ENV production
RUN npm install -g pnpm

COPY dist/apps/api/.npmrc .
COPY dist/apps/api/pnpm-lock.yaml .
COPY dist/apps/api/package.json .
RUN pnpm install -r --prod --prefer-offline

# Generate Prisma Client
# RUN npm install -g prisma
# RUN npx prisma generate --schema=apps/api/src/prisma/schema.prisma

COPY dist/apps/api .

EXPOSE 3333

CMD ["node", "main.js"]
