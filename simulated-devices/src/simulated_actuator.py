import json


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
        print(
            f"Received message on topic: {message.topic} with payload: {message.payload.decode()}"
        )
        expected_topic = f"actuator/{self.type}/command"
        print(
            f"Comparing message.topic: '{message.topic}' with expected_topic: '{expected_topic}'"
        )
        if message.topic.strip().lower() == expected_topic.strip().lower():
            payload = json.loads(message.payload.decode())
            new_state = payload.get("command", "OFF")
            print(f"Current state: {self.state}, New state: {new_state}")
            if new_state != self.state:
                print(f"State change detected for {self.type}. Updating state...")
                self.state = new_state
                self.publish_state()
            else:
                print(
                    f"No state change detected for {self.type}. Current state: {self.state}"
                )
        else:
            print(f"Topic mismatch for {self.type}. Message topic: {message.topic}")

    def publish_state(self):
        topic = f"actuator/{self.type}/state"
        payload = json.dumps({"state": self.state})
        print(
            f"Publishing state for {self.type} to topic: {topic} with payload: {payload}"
        )
        self.mqtt_client.publish(topic, payload)
