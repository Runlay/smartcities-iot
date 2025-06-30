import paho.mqtt.client as mqtt
from state_manager import EnvironmentStateManager
import json

state_manager = EnvironmentStateManager()


MQTT_BROKER_URL = "localhost"
MQTT_BROKER_PORT = 1883
MQTT_BROKER_USERNAME = "guest"
MQTT_BROKER_PASSWORD = "guest"

MQTT_SENSOR_TOPIC = "sensor/+"
MQTT_ACTUATOR_STATE_TOPIC = "actuator/+/state"
MQTT_TOPICS = [MQTT_SENSOR_TOPIC, MQTT_ACTUATOR_STATE_TOPIC]


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")

    for topic in MQTT_TOPICS:
        client.subscribe(topic)
    print(f"Subscribed to topics: {MQTT_TOPICS}")


def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))

    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic

        if topic.startswith("sensor/"):
            sensor_type = topic.split("/")[1]
            state_manager.update_sensor_data(sensor_type, payload)
        elif topic.startswith("actuator/") and topic.endswith("/state"):
            actuator_type = topic.split("/")[1]
            state_manager.update_actuator_state(actuator_type, payload)

        current_state = state_manager.get_state()
        client.publish("env/state", json.dumps(current_state))
        print(f"Published updated state: {current_state}")
    except json.JSONDecodeError:
        print("Failed to decode JSON payload.")


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER_URL, MQTT_BROKER_PORT, 60)


client.loop_forever()
