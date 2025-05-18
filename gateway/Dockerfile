FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    make \
    g++ \
    libudev-dev \
    libyaml-dev \
    libssl-dev \
    libudev1 \
    libusb-dev \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Clone python-openzwave repo
RUN git clone https://github.com/OpenZWave/python-openzwave.git
WORKDIR /app/python-openzwave

# Build and install
RUN python3 setup.py build
RUN python3 setup.py install

# Move back to app directory
WORKDIR /app

# Copy your application (assumes you have app.py)
COPY app.py .

CMD ["python3", "app.py"]