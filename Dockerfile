FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
ENV VITE_BASE_URL=/kiosk-web/
COPY . .
RUN npm run build

FROM node:17 AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/vite.config.ts .
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/shared ./src/shared
COPY --from=builder /app/dist ./dist
CMD ["npx", "tsx", "src/server/main.ts"]