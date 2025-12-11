FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copy proto files to dist
COPY --from=builder /app/src/_proto ./dist/_proto
# Copy config directory if needed (for firebase)
COPY --from=builder /app/config ./config

EXPOSE 3006
EXPOSE 50057

CMD ["npm", "run", "start:prod"]
