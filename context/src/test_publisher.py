import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime

# MQTT Configuration
MQTT_BROKER_URL = "localhost"
MQTT_BROKER_PORT = 1883
MQTT_BROKER_USERNAME = "guest"
MQTT_BROKER_PASSWORD = "guest"


def generate_instance_id():
    """Generate a random instance ID"""
    return f"0x{random.randint(0x100000000000, 0xFFFFFFFFFFFF):012x}"


def publish_sensor_data(client):
    """Publish sample sensor data to sensor/+ topics"""

    # Temperature sensor data
    temp_data = {
        "type": "temperature",
        "value": str(round(random.uniform(18.0, 28.0), 1)),
        "unit": "°C",
        "timestamp": datetime.now().isoformat() + "Z",
        "instanceId": generate_instance_id(),
    }
    client.publish("sensor/temperature", json.dumps(temp_data))
    print(f"Published to sensor/temperature: {temp_data}")

    # Humidity sensor data
    humidity_data = {
        "type": "humidity",
        "value": str(random.randint(30, 80)),
        "unit": "%",
        "timestamp": datetime.now().isoformat() + "Z",
        "instanceId": generate_instance_id(),
    }
    client.publish("sensor/humidity", json.dumps(humidity_data))
    print(f"Published to sensor/humidity: {humidity_data}")

    # Motion sensor data
    motion_data = {
        "type": "motion",
        "value": str(random.choice([True, False])).lower(),
        "unit": "",
        "timestamp": datetime.now().isoformat() + "Z",
        "instanceId": generate_instance_id(),
    }
    client.publish("sensor/motion", json.dumps(motion_data))
    print(f"Published to sensor/motion: {motion_data}")

    # Pressure sensor data
    pressure_data = {
        "type": "pressure",
        "value": str(int(round(random.uniform(50.0, 150.0), 1))),
        "unit": "kg",
        "timestamp": datetime.now().isoformat() + "Z",
        "instanceId": generate_instance_id(),
    }
    client.publish("sensor/pressure", json.dumps(pressure_data))
    print(f"Published to sensor/pressure: {pressure_data}")


def publish_actuator_states(client):
    """Publish sample actuator state data"""

    actuators = ["ac", "ventilation", "light", "alarm"]

    for actuator in actuators:
        state_data = {
            "isOn": random.choice([True, False]),
            "timestamp": datetime.now().isoformat() + "Z",
        }
        client.publish(f"actuator/{actuator}/state", json.dumps(state_data))
        print(f"Published to actuator/{actuator}/state: {state_data}")


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Test client connected with result code {reason_code}")


def main():
    # Create MQTT client
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)
    client.on_connect = on_connect

    # Connect to broker
    client.connect(MQTT_BROKER_URL, MQTT_BROKER_PORT, 60)
    client.loop_start()

    try:
        print("Starting to publish test messages...")

        # Publish test messages every 5 seconds
        while True:
            print("\n--- Publishing sensor data ---")
            publish_sensor_data(client)

            print("\n--- Publishing actuator states ---")
            publish_actuator_states(client)

            print("\n--- Waiting 5 seconds ---")
            time.sleep(5)

    except KeyboardInterrupt:
        print("\nStopping test client...")
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    main()
