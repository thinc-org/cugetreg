FROM node:14-alpine
WORKDIR /usr/app

ENV NODE_ENV production
RUN npm install -g pnpm

COPY dist/apps/cugetreg-api/.npmrc .
COPY dist/apps/cugetreg-api/pnpm-lock.yaml .
COPY dist/apps/cugetreg-api/package.json .
RUN pnpm install -r --prod --prefer-offline

# Generate Prisma Client
# RUN npm install -g prisma
# RUN npx prisma generate --schema=apps/cugetreg-api/src/prisma/schema.prisma

COPY dist/apps/cugetreg-api .

CMD ["node", "main.js"]
