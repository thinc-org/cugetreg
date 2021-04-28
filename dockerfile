FROM node:14-alpine AS base
WORKDIR /build
# Prepare for installing dependencies
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn --frozen-lockfile
# Copy the rest files
COPY . .
# Build applciation
RUN yarn build
# Remove dev dependencies
RUN npm prune --production

FROM node:14-alpine AS production
ENV NODE_ENV production
WORKDIR /app
# Copy only necessary file for running app
COPY --from=base /build/package.json ./package.json
COPY --from=base /build/node_modules ./node_modules
COPY --from=base /build/.next ./.next
COPY --from=base /build/public ./public
# Expose listening port
EXPOSE 3000
# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node
# Staring script
CMD yarn start


