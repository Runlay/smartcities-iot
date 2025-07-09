FROM node:22.15-bullseye-slim

WORKDIR /app

COPY package.json ./package.json

RUN npm install
COPY . ./

RUN npm run build

EXPOSE 3000
CMD ["node", "server.js"]