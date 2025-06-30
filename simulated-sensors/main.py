import json
import time
import random
from datetime import datetime
import paho.mqtt.client as mqtt
import threading


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected to MQTT broker with result code {reason_code}")


def generate_sensor_reading(sensor_type, value, unit):
    return {
        "type": sensor_type,
        "instanceId": f"0x{random.randint(100000000, 999999999):x}",
        "timestamp": datetime.now().isoformat() + "Z",
        "value": value,
        "unit": unit,
    }


def publish_temperature(client):
    while True:
        temp = round(20 + random.uniform(-3, 8), 1)  # 17-28°C
        reading = generate_sensor_reading("temperature", temp, "°C")
        client.publish("sensor/temperature", json.dumps(reading))
        print(f"Published temperature: {temp}°C")
        time.sleep(5)


def publish_humidity(client):
    while True:
        humidity = round(random.uniform(30, 70))  # 30-70%
        reading = generate_sensor_reading("humidity", humidity, "%")
        client.publish("sensor/humidity", json.dumps(reading))
        print(f"Published humidity: {humidity}%")
        time.sleep(10)


def publish_motion(client):
    while True:
        motion = 1 if random.random() > 0.7 else 0  # 30% chance
        reading = generate_sensor_reading("motion", motion, "boolean")
        client.publish("sensor/motion", json.dumps(reading))
        print(f"Published motion: {'true' if motion else 'false'}")
        time.sleep(3)


def publish_pressure(client):
    while True:
        pressure = round(random.uniform(0, 1000))  # 0-1000 kg
        reading = generate_sensor_reading("pressure", pressure, "kg")
        client.publish("sensor/pressure", json.dumps(reading))
        print(f"Published pressure: {pressure}kg")
        time.sleep(30)


def main():
    # Setup MQTT client
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set("guest", "guest")
    client.on_connect = on_connect

    try:
        # Use regular MQTT port for Python client
        client.connect("localhost", 1883, 60)
        print("Attempting to connect to MQTT broker on localhost:1883")
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")
        return

    # Start publishing threads for each sensor with different intervals
    threads = [
        threading.Thread(target=publish_temperature, args=(client,), daemon=True),
        threading.Thread(target=publish_humidity, args=(client,), daemon=True),
        threading.Thread(target=publish_motion, args=(client,), daemon=True),
        threading.Thread(target=publish_pressure, args=(client,), daemon=True),
    ]

    for thread in threads:
        thread.start()

    try:
        client.loop_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        client.disconnect()


if __name__ == "__main__":
    main()
