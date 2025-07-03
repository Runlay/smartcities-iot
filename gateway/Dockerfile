FROM python:3.11-slim

WORKDIR /app

#RUN apt-get update && apt-get install -y pigpio

#ENV PIGPIO_ADDR=localhost
#ENV PIGPIO_PORT=8888

RUN pip install paho-mqtt
RUN pip install gpiozero
#RUN pip install pigpio

# Copy project files
COPY app.py .

#CMD ["sh", "-c", "pigpiod && python app.py"]
CMD ["python", "app.py"]
