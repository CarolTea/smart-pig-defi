# Smart Pig DeFi Documentation Dockerfile
# Multi-stage build for optimized production image

# Build stage
FROM node:20-alpine AS builder

# Set build argument for version
ARG VERSION=latest
ENV APP_VERSION=$VERSION

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S docusaurus -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --ignore-scripts

# Copy source code
COPY . .

# Change ownership to non-root user
RUN chown -R docusaurus:nodejs /app
USER docusaurus

# Build the documentation
RUN npm run build

# Production stage
FROM nginx:1.25-alpine AS production

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Create non-root user for nginx
RUN addgroup -g 1001 -S docs && \
    adduser -S docs -u 1001 -G docs

# Copy built documentation from builder stage
COPY --from=builder --chown=docs:docs /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directories and set permissions
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run && \
    chown -R docs:docs /var/log/nginx /var/cache/nginx /var/run /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER docs

# Expose port 8080 (non-privileged)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Add labels for metadata
LABEL maintainer="Team Smart Pig <team@smartpig.com>"
LABEL version="$VERSION"
LABEL description="Smart Pig DeFi Documentation - Built with Docusaurus"
LABEL org.opencontainers.image.title="Smart Pig DeFi Documentation"
LABEL org.opencontainers.image.description="Documentation for Smart Pig DeFi platform"
LABEL org.opencontainers.image.version="$VERSION"
LABEL org.opencontainers.image.source="https://github.com/guilhermejansen/smart-pig-defi"
LABEL org.opencontainers.image.licenses="UNLICENSED"