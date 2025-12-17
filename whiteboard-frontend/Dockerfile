FROM node:25-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:25-alpine
RUN npm install -g http-server
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080"]