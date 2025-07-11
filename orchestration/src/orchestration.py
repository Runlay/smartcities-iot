import paho.mqtt.client as mqtt
import json
from dotenv import load_dotenv
import os
from planner import run_fd_docker
import subprocess
from datetime import datetime
from zoneinfo import ZoneInfo

load_dotenv()

MQTT_BROKER_HOST = os.getenv("MQTT_BROKER_HOST", "rabbitmq")
MQTT_BROKER_PORT = 1883
MQTT_BROKER_USERNAME = os.getenv("MQTT_BROKER_USERNAME")
MQTT_BROKER_PASSWORD = os.getenv("MQTT_BROKER_PASSWORD")

MQTT_PLANNER_PROBLEM_TOPIC = "planner/problem"
MQTT_TOPICS = [MQTT_PLANNER_PROBLEM_TOPIC]

PDDL_OUTPUT_PATH = "/data"


def get_timestamp():
    """Generate ISO 8601 timestamp in German timezone"""
    return datetime.now(ZoneInfo("Europe/Berlin")).isoformat()


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")

    for topic in MQTT_TOPICS:
        client.subscribe(topic)
    print(f"Subscribed to topics: {MQTT_TOPICS}")


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic

        if topic.startswith("planner"):
            print(f"{topic} received: {payload}")
            # save the problem to a file
            file = PDDL_OUTPUT_PATH + "/problem.pddl"
            with open(file, "w") as f:
                f.write(payload["content"])

            # copy domain.pddl to the same folder the file needs to be loaded first
            domain_file = PDDL_OUTPUT_PATH + "/domain.pddl"
            if not os.path.exists(domain_file):
                # copy the domain.pddl file from the orchestration folder to the PDDL_OUTPUT_PATH
                subprocess.run(
                    ["cp", "/orchestration/src/domain.pddl", domain_file], check=True
                )
                print(f"Copied domain.pddl to {domain_file}")

            plan = run_fd_docker()
            timestamp = get_timestamp()

            if plan is not None:
                plan_steps = []

                for action in plan:
                    action = action.split()[0]
                    actuator, command = action.rsplit("-", 1)

                    # Build PlanStep object
                    step = {
                        "actuator": actuator.replace(
                            "turn-", ""
                        ),  # e.g., "ac", "light"
                        "action": command.upper(),  # e.g., "ON", "OFF"
                        "timestamp": timestamp,
                    }
                    plan_steps.append(step)

                    # Send actuator command as before
                    match actuator:
                        case "turn-light":
                            command_payload = {
                                "command": command.upper(),
                                "timestamp": timestamp,
                            }
                            client.publish(
                                "actuator/light/command", json.dumps(command_payload)
                            )
                            print(
                                f"Published command to actuator/light/command: {command_payload}"
                            )

                        case "turn-ventilation":
                            command_payload = {
                                "command": command.upper(),
                                "timestamp": timestamp,
                            }
                            client.publish(
                                "actuator/ventilation/command",
                                json.dumps(command_payload),
                            )
                            print(
                                f"Published command to actuator/ventilation/command: {command_payload}"
                            )

                        case "turn-ac":
                            command_payload = {
                                "command": command.upper(),
                                "timestamp": timestamp,
                            }
                            client.publish(
                                "actuator/ac/command", json.dumps(command_payload)
                            )
                            print(
                                f"Published command to actuator/ac/command: {command_payload}"
                            )

                        case "turn-alarm":
                            command_payload = {
                                "command": command.upper(),
                                "timestamp": timestamp,
                            }
                            client.publish(
                                "actuator/alarm/command", json.dumps(command_payload)
                            )
                            print(
                                f"Published command to actuator/alarm/command: {command_payload}"
                            )

                # Build Plan object and send to frontend topic
                plan = {
                    "id": f"plan-{timestamp}",
                    "steps": plan_steps,
                    "createdAt": timestamp,
                }
                client.publish("planner/plan", json.dumps(plan))
                print(f"Published plan to planner/plan: {plan}")

    except json.JSONDecodeError:
        print("Failed to decode JSON payload or running the planner.")


if __name__ == "__main__":
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)
    client.loop_forever()
