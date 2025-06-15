FROM node:20-alpine

# Set working directory
 WORKDIR /app

# Copy files
COPY index.js .
COPY package.json .

# # Install dependencies
RUN npm install

RUN apk add --no-cache usbutils udev

# Start script
CMD ["node", "index.js"]
