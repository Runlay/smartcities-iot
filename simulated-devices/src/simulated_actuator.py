import json
from datetime import datetime


class SimulatedActuator:
    def __init__(self, type):
        self.type = type
        self.state = "OFF"
        self.mqtt_client = None

    def set_mqtt_client(self, mqtt_client):
        self.mqtt_client = mqtt_client
        topic = f"actuator/{self.type}/command"
        self.mqtt_client.subscribe(topic)

    def on_message(self, client, userdata, message):
        expected_topic = f"actuator/{self.type}/command"

        if message.topic.strip().lower() == expected_topic.strip().lower():
            payload = json.loads(message.payload.decode())
            new_state = payload.get("command", "OFF")
            if new_state != self.state:
                self.state = new_state
                self.publish_state()

    def publish_state(self):
        topic = f"actuator/{self.type}/state"
        timestamp = datetime.now().isoformat() + "Z"
        payload = json.dumps({"state": self.state, "timestamp": timestamp})
        print(
            f"Publishing state for {self.type} to topic: {topic} with payload: {payload}"
        )
        self.mqtt_client.publish(topic, payload)
