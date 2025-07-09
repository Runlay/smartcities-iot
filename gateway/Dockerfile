FROM python:3.11-slim

WORKDIR /app

RUN pip install paho-mqtt
RUN pip install gpiozero

# Copy project files
COPY app.py .

CMD ["python", "app.py"]
