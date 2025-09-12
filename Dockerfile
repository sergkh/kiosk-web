FROM oven/bun:1.2.5 AS base

FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN bun install
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app
EXPOSE 3000
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/server ./server
COPY --from=builder /app/dist ./dist
CMD ["bun", "server/main.ts"]