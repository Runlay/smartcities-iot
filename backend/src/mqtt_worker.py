import paho.mqtt.client as mqtt
from redis_handler import RedisHandler
import time


try:
    redis_client = RedisHandler()

    mqttc = mqtt.Client()
    mqttc.username_pw_set("guest", "guest")
    mqttc.connect("host.docker.internal", 1883, 60)

    mqttc.loop_start()

    print("Connected to MQTT broker")

    # Subscribe to multiple topics
    topics = [
        ("sensor/temperature", 0),
        ("sensor/humidity", 0),
        ("sensor/pressure", 0),
        ("sensor/motion", 0),
    ]
    mqttc.subscribe(topics)

    def on_message(client, userdata, message):
        topic_map = {
            "sensor/temperature": "sensor:temperature",
            "sensor/humidity": "sensor:humidity",
            "sensor/pressure": "sensor:pressure",
            "sensor/motion": "sensor:motion",
        }
        redis_key = topic_map.get(message.topic)
        if redis_key:
            print(f"Received message on {message.topic}: {message.payload.decode()}")
            redis_client.lpush(redis_key, message.payload.decode())
        else:
            print(
                f"Received message on unknown topic {message.topic}: {message.payload.decode()}"
            )

    mqttc.on_message = on_message

    # Keep the loop running
    while True:
        time.sleep(1)

except Exception as e:
    print(f"Error: {e}")
