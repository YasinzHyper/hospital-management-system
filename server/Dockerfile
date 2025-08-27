# Development stage
FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Install system dependencies for some npm packages
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Development command with nodemon
CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Install system dependencies for some npm packages
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD node healthcheck.js || exit 1

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

CMD [ "node", "src/index.js" ]
