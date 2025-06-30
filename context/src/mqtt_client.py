import paho.mqtt.client as mqtt
from state_manager import EnvironmentStateManager
from config_manager import EnvironmentConfigurationManager
from problem_generator import ProblemGenerator
import json

state_manager = EnvironmentStateManager()
config_manager = EnvironmentConfigurationManager()
problem_generator = ProblemGenerator()


MQTT_BROKER_URL = "localhost"
MQTT_BROKER_PORT = 1883
MQTT_BROKER_USERNAME = "guest"
MQTT_BROKER_PASSWORD = "guest"

MQTT_SENSOR_TOPIC = "sensor/+"
MQTT_ACTUATOR_STATE_TOPIC = "actuator/+/state"
MQTT_ENVIRONMENT_TOPIC = "env/+"
MQTT_TOPICS = [MQTT_SENSOR_TOPIC, MQTT_ACTUATOR_STATE_TOPIC, MQTT_ENVIRONMENT_TOPIC]


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")

    for topic in MQTT_TOPICS:
        client.subscribe(topic)
    print(f"Subscribed to topics: {MQTT_TOPICS}")


def generate_plan():
    current_state = state_manager.get_state()
    current_config = config_manager.get_config()

    try:
        problem_file = problem_generator.generate_problem(current_state, current_config)
        print(f"✓ Generated new PDDL problem: {problem_file}")
    except Exception as e:
        print(f"✗ Failed to generate PDDL problem: {e}")


def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))

    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic
        should_publish_state = False
        should_generate_plan = False

        if topic.startswith("sensor/"):
            sensor_type = topic.split("/")[1]
            state_manager.update_sensor_data(sensor_type, payload)
            should_publish_state = True
            should_generate_plan = True
        elif topic.startswith("actuator/") and topic.endswith("/state"):
            actuator_type = topic.split("/")[1]
            state_manager.update_actuator_state(actuator_type, payload)
            should_publish_state = True
            should_generate_plan = True
        elif topic == "env/config":
            config_manager.update_config(payload)
            should_generate_plan = True

        if should_publish_state:
            current_state = state_manager.get_state()
            client.publish("env/state", json.dumps(current_state))
            print(f"Published current state: {current_state}")

        if should_generate_plan:
            generate_plan()

    except json.JSONDecodeError:
        print("Failed to decode JSON payload.")


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER_URL, MQTT_BROKER_PORT, 60)


client.loop_forever()
