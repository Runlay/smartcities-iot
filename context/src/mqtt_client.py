import paho.mqtt.client as mqtt
from state_manager import EnvironmentStateManager
from config_manager import EnvironmentConfigurationManager
from problem_generator import ProblemGenerator
import json
from dotenv import load_dotenv
import os
import time
import threading


state_manager = EnvironmentStateManager()
config_manager = EnvironmentConfigurationManager()
problem_generator = ProblemGenerator()

# Debouncing variables
last_plan_generation_time = 0
last_state_publish_time = 0
PLAN_GENERATION_INTERVAL = 15  # seconds
STATE_PUBLISH_INTERVAL = 10  # seconds
pending_plan_generation = False
plan_generation_timer = None
debounce_lock = threading.Lock()

load_dotenv()

MQTT_BROKER_HOST = os.getenv("MQTT_BROKER_HOST", "localhost")
MQTT_BROKER_PORT = 1883
MQTT_BROKER_USERNAME = os.getenv("MQTT_BROKER_USERNAME")
MQTT_BROKER_PASSWORD = os.getenv("MQTT_BROKER_PASSWORD")

MQTT_SENSOR_TOPICS = os.getenv("MQTT_SENSOR_TOPICS", "sensor/+")
MQTT_ACTUATOR_STATE_TOPICS = os.getenv("MQTT_ACTUATOR_STATE_TOPICS", "actuator/+/state")
MQTT_ENVIRONMENT_TOPICS = os.getenv("MQTT_ENVIRONMENT_TOPICS", "env/+")
MQTT_TOPICS = [MQTT_SENSOR_TOPICS, MQTT_ACTUATOR_STATE_TOPICS, MQTT_ENVIRONMENT_TOPICS]


def on_connect(client, userdata, flags, reason_code, properties):
    for topic in MQTT_TOPICS:
        client.subscribe(topic)


def generate_plan():
    """Generate and publish a PDDL problem immediately."""
    global last_plan_generation_time

    current_state = state_manager.get_state()
    current_config = config_manager.fetch_latest_config()

    try:
        problem_data = problem_generator.generate_problem(current_state, current_config)
        client.publish("planner/problem", json.dumps(problem_data))
        last_plan_generation_time = time.time()
    except Exception as e:
        print(f"✗ Failed to generate PDDL problem: {e}")


def schedule_plan_generation():
    """Schedule a plan generation with debouncing logic."""
    global pending_plan_generation, plan_generation_timer, last_plan_generation_time

    with debounce_lock:
        current_time = time.time()
        time_since_last_plan = current_time - last_plan_generation_time

        if time_since_last_plan >= PLAN_GENERATION_INTERVAL:
            generate_plan()
            pending_plan_generation = False
            return

        if pending_plan_generation:
            return

        remaining_time = PLAN_GENERATION_INTERVAL - time_since_last_plan
        pending_plan_generation = True

        if plan_generation_timer:
            plan_generation_timer.cancel()

        plan_generation_timer = threading.Timer(remaining_time, _execute_pending_plan)
        plan_generation_timer.start()


def _execute_pending_plan():
    """Execute the pending plan generation."""
    global pending_plan_generation

    with debounce_lock:
        pending_plan_generation = False
        generate_plan()


def publish_state_if_needed():
    """Publish state only if enough time has passed."""
    global last_state_publish_time

    current_time = time.time()
    if current_time - last_state_publish_time >= STATE_PUBLISH_INTERVAL:
        current_state = state_manager.get_state()
        client.publish("env/state", json.dumps(current_state))
        last_state_publish_time = current_time


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic

        if topic.startswith("sensor/"):
            sensor_type = topic.split("/")[1]
            state_manager.update_sensor_data(sensor_type, payload)
        elif topic.startswith("actuator/") and topic.endswith("/state"):
            actuator_type = topic.split("/")[1]
            state_manager.update_actuator_state(actuator_type, payload)

        publish_state_if_needed()
        schedule_plan_generation()

    except json.JSONDecodeError:
        pass  # Silently ignore invalid JSON


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)


client.loop_forever()
