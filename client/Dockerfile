# syntax=docker/dockerfile:1

# Build stage
FROM node:22-slim AS builder
WORKDIR /app
# Copy package files first to leverage cache
COPY package*.json ./
# Clean install dependencies
RUN npm ci

# Copy application files
COPY client.js index.js ./
COPY views/ views/
COPY mountains.proto ./

# Production stage
FROM node:22-slim
# Use non-root user
USER node
# Create app directory owned by non-root user
WORKDIR /app

# Copy only necessary files from builder
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/client.js ./
COPY --chown=node:node --from=builder /app/index.js ./
COPY --chown=node:node --from=builder /app/views ./views
COPY --chown=node:node --from=builder /app/mountains.proto ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Document the ports
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]