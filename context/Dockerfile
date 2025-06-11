FROM python:3.13-slim

WORKDIR /app

# Install uv for faster dependency management
RUN pip install uv

# Copy project files
COPY pyproject.toml .
COPY main.py .

# Install dependencies
RUN uv pip install --system -e .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Default configuration
ENV MQTT_BROKER=messaging
ENV MQTT_PORT=1883
ENV TEMPERATURE_TARGET=22.0
ENV TEMPERATURE_TOLERANCE=2.0
ENV HUMIDITY_TARGET=50.0
ENV HUMIDITY_TOLERANCE=10.0
ENV PRESSURE_THRESHOLD=1000.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import socket; socket.create_connection(('$MQTT_BROKER', $MQTT_PORT), timeout=5)" || exit 1

CMD ["python", "main.py"]
