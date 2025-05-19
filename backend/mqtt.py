import paho.mqtt.client as mqtt
import time
import random
import json


def init_mqtt():
    # Define the MQTT client
    # Use the appropriate MQTT version
    # For example, if using MQTT v5.0, use mqtt.Client(mqtt.MQTTv5)
    # For MQTT v3.1.1, use mqtt.Client()
    # For MQTT v3.1, use mqtt.Client(mqtt.MQTTv311)
    mqttc = mqtt.Client()
    mqttc.username_pw_set("guest", "guest")
    mqttc.connect("host.docker.internal", 1883, 60)

    mqttc.loop_start()

    print("Connected to MQTT broker")
    while True:
        # Publish a message to a topic
        random_value = random.randint(0, 100)
        print(f"Publishing random value: {random_value}")

        data = {
            "typeId": "sensorType1",
            "instanceId": "instance123",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "value": {"randomValue": random_value},
        }

        mqttc.publish("sensors/temperature", json.dumps(data))

        time.sleep(1)


init_mqtt()
