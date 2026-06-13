FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev && npm rebuild better-sqlite3
COPY --from=builder /app/dist ./dist
RUN mkdir -p data

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
