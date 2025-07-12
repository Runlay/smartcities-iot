import paho.mqtt.client as mqtt
from state_manager import EnvironmentStateManager
from config_manager import EnvironmentConfigurationManager
from problem_generator import ProblemGenerator
import json
from dotenv import load_dotenv
import os
import time

state_manager = EnvironmentStateManager()
config_manager = EnvironmentConfigurationManager()
problem_generator = ProblemGenerator()

load_dotenv()

MQTT_BROKER_HOST = os.getenv("MQTT_BROKER_HOST", "localhost")
MQTT_BROKER_PORT = 1883
MQTT_BROKER_USERNAME = os.getenv("MQTT_BROKER_USERNAME")
MQTT_BROKER_PASSWORD = os.getenv("MQTT_BROKER_PASSWORD")

MQTT_SENSOR_TOPICS = os.getenv("MQTT_SENSOR_TOPICS", "sensor/+")
MQTT_ACTUATOR_STATE_TOPICS = os.getenv("MQTT_ACTUATOR_STATE_TOPICS", "actuator/+/state")
# Remove env/+ topic since it's not used anymore
MQTT_TOPICS = [MQTT_SENSOR_TOPICS, MQTT_ACTUATOR_STATE_TOPICS]

last_plan_time = 0
PLAN_INTERVAL = 3


def on_connect(client, userdata, flags, reason_code, properties):
    for topic in MQTT_TOPICS:
        client.subscribe(topic)


def generate_plan():
    current_state = state_manager.get_state()
    current_config = config_manager.fetch_latest_config()

    try:
        problem_data = problem_generator.generate_problem(current_state, current_config)
        client.publish("planner/problem", json.dumps(problem_data))
    except Exception as e:
        print(f"✗ Failed to generate PDDL problem: {e}")


def on_message(client, userdata, msg):
    global last_plan_time

    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic

        if topic.startswith("sensor/"):
            sensor_type = topic.split("/")[1]
            state_manager.update_sensor_data(sensor_type, payload)
        elif topic.startswith("actuator/") and topic.endswith("/state"):
            actuator_type = topic.split("/")[1]
            state_manager.update_actuator_state(actuator_type, payload)

        # Simple debouncing
        current_time = time.time()
        if current_time - last_plan_time >= PLAN_INTERVAL:
            generate_plan()
            last_plan_time = current_time

    except json.JSONDecodeError:
        pass  # Silently ignore invalid JSON


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)
client.loop_forever()
