# ==============================================================================
# Stage 1: Base image with Node.js LTS on Alpine Linux
# ==============================================================================
FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat curl

# ==============================================================================
# Stage 2: Development stage (Hot-Reload enabled)
# ==============================================================================
FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ==============================================================================
# Stage 3: Build stage (Compiles TypeScript to JavaScript)
# ==============================================================================
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm prune --omit=dev

# ==============================================================================
# Stage 4: Production stage (Minimal, secure, non-root image)
# ==============================================================================
FROM node:22-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production

RUN apk add --no-cache curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=build --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /usr/src/app/package.json ./package.json

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/main.js"]

