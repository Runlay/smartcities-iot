from dotenv import load_dotenv
import os
import paho.mqtt.client as mqtt

load_dotenv()

MQTT_BROKER_HOST = os.getenv("MQTT_BROKER_HOST", "localhost")
MQTT_BROKER_PORT = int(os.getenv("MQTT_BROKER_PORT_TCP", 1883))
MQTT_BROKER_USERNAME = os.getenv("MQTT_BROKER_USERNAME")
MQTT_BROKER_PASSWORD = os.getenv("MQTT_BROKER_PASSWORD")

MQTT_SENSOR_TOPICS = os.getenv("MQTT_SENSOR_TOPICS", "sensor/+")
MQTT_ACTUATOR_STATE_TOPICS = os.getenv("MQTT_ACTUATOR_STATE_TOPICS", "actuator/+/state")
MQTT_ENVIRONMENT_TOPICS = os.getenv("MQTT_ENVIRONMENT_TOPICS", "env/+")
MQTT_TOPICS = [MQTT_SENSOR_TOPICS, MQTT_ACTUATOR_STATE_TOPICS, MQTT_ENVIRONMENT_TOPICS]


class MqttClient:
    def __init__(self, on_message):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self.client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)

        if on_message:
            self.client.on_message = on_message

        self.client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)

    def subscribe(self, topic):
        self.client.subscribe(topic)

    def publish(self, topic, payload):
        self.client.publish(topic, payload)

    def set_on_message(self, on_message):
        self.client.on_message = on_message

    def loop_forever(self):
        self.client.loop_forever()
