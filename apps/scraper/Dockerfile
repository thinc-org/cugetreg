FROM node:16.17.0-alpine
WORKDIR /usr/app

ENV NODE_ENV production
RUN npm install -g pnpm

COPY dist/apps/scraper/.npmrc .
COPY dist/apps/scraper/pnpm-lock.yaml .
COPY dist/apps/scraper/package.json .
RUN pnpm install -r --prod --prefer-offline

COPY dist/apps/scraper .

EXPOSE 3000

CMD ["node", "main.js"]
