import paho.mqtt.client as mqtt
import json


def on_connect(client, userdata, flags, reason_code, properties):
    # subscribe to all sensor topics
    client.subscribe("sensor/+")

    # subscribe to all actuator state topics
    client.subscribe("actuator/+/state")


def on_message(client, userdata, message):
    topic = message.topic
    payload = json.loads(message.payload.decode("utf-8"))

    if topic.startswith("sensor/"):
        print(f"Sensor data received on topic '{topic}': {payload}")

        # update sensor envrionment state -> needed ?

        # map numerical sensor values to discrete classes

        # dynamically generate new problem instance
        # use mapped sensor values as initial state
        # derive goal state from mapped sensor values (i.e., temperature-high -> goal: ac-on)
    elif topic.startswith("actuator/") and topic.endswith("/state"):
        print(f"Actuator state update received on topic '{topic}': {payload}")

        # update actuator envrionment state -> needed ?


client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set("guest", "guest")
client.connect("localhost", 1883, 60)

client.loop_forever()
