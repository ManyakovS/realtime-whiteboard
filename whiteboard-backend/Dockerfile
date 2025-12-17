# Базовый образ с зависимостями
FROM node:25-alpine AS deps
WORKDIR /
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Builder стадия
FROM node:25-alpine AS builder
WORKDIR /
COPY --from=deps //node_modules ./node_modules
COPY . .
# Собираем TypeScript
RUN yarn tsc

# Production стадия
FROM node:25-alpine AS runner
WORKDIR /

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=builder /dist ./dist
COPY package.json ./

RUN yarn install --production --frozen-lockfile

USER nodejs

EXPOSE 3000

# Запускаем собранный файл
CMD ["node", "dist/app.js"]