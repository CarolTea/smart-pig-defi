# Multi-stage build for NestJS backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for building
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for building
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy health check script
COPY healthcheck.js ./

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]