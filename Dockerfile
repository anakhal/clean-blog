# ==============================================================================
# Multi-stage Dockerfile for Clean Blog (Express + Node + MongoDB + EJS)
# Optimized for Google Cloud Run (Node 20 Alpine, minimal size, non-root user)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build & Dependencies
# ------------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /app

# Install native compilation dependencies required by native packages (e.g., bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package manifests for optimal layer caching
COPY package*.json ./

# Install only production dependencies cleanly and reliably
RUN npm ci --omit=dev && npm cache clean --force

# ------------------------------------------------------------------------------
# Stage 2: Production Runner
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Standard Cloud Run production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Create required directories and set proper ownership
RUN mkdir -p /app/logs && chown -R node:node /app

# Copy production dependencies from builder stage
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

# Copy application source files
COPY --chown=node:node . .

# Enforce least-privilege security principle: run as non-root user
USER node

# Document port 8080 (Cloud Run standard)
EXPOSE 8080

# Launch application
CMD ["node", "index.js"]
