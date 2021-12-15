FROM node:14-buster-slim AS base
WORKDIR /build

# Prepare for installing dependencies
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM base as build
# Copy the rest files
COPY . .
# Build application
RUN yarn build

FROM base as prod-deps
# Prune unused dependencies
RUN npm prune --production

FROM node:14-buster-slim AS production
ENV NODE_ENV production
WORKDIR /app
# Copy only necessary file for running app
COPY --from=prod-deps /build/package.json ./package.json
COPY --from=prod-deps /build/node_modules ./node_modules
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
# Expose listening port
EXPOSE 3000
# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node
# Staring script
CMD yarn start
