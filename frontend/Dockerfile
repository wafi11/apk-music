# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

FROM base AS builder
WORKDIR /app

# Install dependencies dengan cache
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source dan build
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app


RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]