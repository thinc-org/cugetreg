FROM node:14-alpine AS build

# Initialize working directory
WORKDIR /var/www

# Prepare for installing dependencies
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn --frozen-lockfile

# Copy the rest files
COPY . .

# Build applciation
RUN yarn build

# Remove source files
RUN rm -rf src

# Expose listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Staring script
CMD [	"yarn", "start"]