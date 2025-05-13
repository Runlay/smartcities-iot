FROM balenalib/generic-amd64-debian-node:20-bullseye-run

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]