import paho.mqtt.client as mqtt
import time
import random
import json


def init_mqtt():
    mqttc = mqtt.Client()
    mqttc.username_pw_set("guest", "guest")
    mqttc.connect("host.docker.internal", 1883, 60)

    mqttc.loop_start()

    print("Connected to MQTT broker")
    # while True:
    # Publish a message to a topic
    random_value = random.randint(0, 100)
    print(f"Publishing random value: {random_value}")

    data = {
        "typeId": "sensorType1",
        "instanceId": "instance123",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "value": {"randomValue": random_value},
    }

    # Demo Publish for Topic Temperature
    mqttc.publish("sensors/temperature", json.dumps(data))

    #time.sleep(1)


init_mqtt()
