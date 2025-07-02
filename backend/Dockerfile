FROM node:20-alpine AS base

ARG JWT_SECRET
ARG RABBITMQ

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Check the build output structure
RUN ls -la dist

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV JWT_SECRET=${JWT_SECRET}
ENV RABBITMQ=${RABBITMQ}

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copy SQLite database file
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db

# Expose the port the app runs on
EXPOSE 4000

# Generate Prisma client
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Start the application
CMD ["node", "dist/src/main.js"]
