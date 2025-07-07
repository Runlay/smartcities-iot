import paho.mqtt.client as mqtt
from redis_handler import RedisHandler
from postgres_handler import PostgresHandler
import json


def start_mqtt_worker():
    redis_client = RedisHandler()
    postgres_client = PostgresHandler(
        dbname="postgres",
        user="admin",
        password="admin",
        host="postgres",
        port=5432,
    )

    mqttc = mqtt.Client()
    mqttc.username_pw_set("guest", "guest")
    mqttc.connect("host.docker.internal", 1883, 60)

    print("Connected to MQTT broker")

    # Subscribe to multiple topics
    topics = [
        ("sensor/temperature", 0),
        ("sensor/humidity", 0),
        ("sensor/pressure", 0),
        ("sensor/motion", 0),
        ("env/config", 0),
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
        elif message.topic == "env/config":
            print(f"Received environment config update: {message.payload.decode()}")
            config = json.loads(message.payload.decode())
            postgres_client.create_config(config)
            print("New environment config created in PostgreSQL")
        else:
            print(
                f"Received message on unknown topic {message.topic}: {message.payload.decode()}"
            )

    mqttc.on_message = on_message

    mqttc.loop_forever()
