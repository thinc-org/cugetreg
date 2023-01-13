FROM node:14-alpine AS base

# Initialize working directory
WORKDIR /usr/src/app

# Prepare for installing dependencies
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ["package.json", "yarn.lock", "./"]

# Install dependencies
RUN yarn --frozen-lockfile

# Set env to production
ENV NODE_ENV production


FROM base AS build

# Copy the rest files
COPY . .

# Build applciation
RUN yarn build


FROM base

# Copy the previous build file to this image
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/src /usr/src/app/src

# Expose listening port
EXPOSE 3000

# Starting scripts
CMD node dist/main
