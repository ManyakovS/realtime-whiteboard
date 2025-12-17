# Базовый образ с зависимостями
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Builder стадия
FROM node:25-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Собираем TypeScript
RUN yarn tsc

# Production стадия
FROM node:25-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Копируем собранный JavaScript из src/app.ts
COPY --from=builder /app/dist ./dist
COPY package.json ./

RUN yarn install --production --frozen-lockfile

USER nodejs

EXPOSE 3000

# Запускаем собранный файл
CMD ["node", "dist/app.js"]