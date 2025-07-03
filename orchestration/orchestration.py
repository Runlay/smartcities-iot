import paho.mqtt.client as mqtt
import json
from dotenv import load_dotenv
import os
from planner import run_fd_docker
import subprocess

load_dotenv()

MQTT_BROKER_HOST = os.getenv("MQTT_BROKER_HOST", "localhost")
MQTT_BROKER_PORT = int(os.getenv("MQTT_BROKER_PORT_TCP", 1883))
MQTT_BROKER_USERNAME = os.getenv("MQTT_BROKER_USERNAME")
MQTT_BROKER_PASSWORD = os.getenv("MQTT_BROKER_PASSWORD")

MQTT_SENSOR_TOPICS = os.getenv("MQTT_SENSOR_TOPICS", "sensor/+")
MQTT_ACTUATOR_STATE_TOPICS = os.getenv("MQTT_ACTUATOR_STATE_TOPICS", "actuator/+/state")
MQTT_PLANNER_PROBLEM_TOPIC = "planner/problem"
MQTT_TOPICS = [MQTT_PLANNER_PROBLEM_TOPIC]

PDDL_OUTPUT_PATH = "/data"

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
            file = PDDL_OUTPUT_PATH+"/problem.pddl"
            with open(file, "w") as f:
                f.write(payload["content"])
        
            # copy domain.pddl to the same folder the file needs to be loaded first 
            domain_file = PDDL_OUTPUT_PATH + "/domain.pddl"
            if not os.path.exists(domain_file):
                # copy the domain.pddl file from the orchestration folder to the PDDL_OUTPUT_PATH
                subprocess.run(["cp", "/orchestration/domain.pddl", domain_file], check=True)
                print(f"Copied domain.pddl to {domain_file}")
            

           
            
            plan = run_fd_docker()
            if plan is not None:
                for action in plan:
                    print(f"Action: {action}")

                    # publish the action for the corresponding actuator
                
                    # actuator_topic = f"actuator/{action['actuator']}/command"
                    # command_payload = {
                    #     "command": action["command"],
                    #     "timestamp": action["timestamp"],
                    # }
                    # client.publish(actuator_topic, json.dumps(command_payload))
                    # print(f"Published to {actuator_topic}: {command_payload}")
            

    except json.JSONDecodeError:
        print("Failed to decode JSON payload or running the planner.")


if __name__ == "__main__":
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_BROKER_USERNAME, MQTT_BROKER_PASSWORD)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)
    client.loop_forever()