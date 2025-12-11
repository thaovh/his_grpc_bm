FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 50051

CMD ["npm", "run", "start:prod"]

