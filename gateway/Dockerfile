# FROM node:20-alpine

# # Install dependencies
# RUN apk add --no-cache python3 make g++ usbutils udev

# # Set working directory
# WORKDIR /app

# # Copy files
# COPY index.js .
# COPY package.json .

# # Install dependencies
# RUN npm install

# # Set environment variables
# ENV SERIAL_PORT=/dev/ttyUSB0
# ENV LOGLEVEL=info

# # Expose Z-Wave WebSocket port (if used)
# EXPOSE 3000

# # Start script
# #CMD ["node", "index.js"]

# #ENV UDEV=on
# #RUN install_packages uhubctl