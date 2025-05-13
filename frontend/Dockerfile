FROM balenalib/raspberrypi3-node:20-run

WORKDIR /usr/src/app

COPY package.json package.json

RUN JOBS=MAX npm install --production
COPY . ./

EXPOSE 3000
CMD ["npm", "start"]