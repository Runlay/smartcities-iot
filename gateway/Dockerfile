FROM python:3.13-slim

WORKDIR /app

RUN pip install paho-mqtt

# Copy project files
COPY app.py .

CMD ["python", "app.py"]
