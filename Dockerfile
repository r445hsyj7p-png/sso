FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Remove dev dependencies
RUN npm ci --omit=dev

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/sso.db

VOLUME ["/data"]

EXPOSE 3001

CMD ["npm", "start"]
