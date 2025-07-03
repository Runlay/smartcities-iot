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
        self.mqtt_client.set_on_message(self.on_message)

    def on_message(self, client, userdata, message):
        if message.topic == f"actuator/{self.type}/command":
            payload = json.loads(message.payload.decode())
            new_state = payload.get("command", "OFF")
            if new_state != self.state:
                self.state = new_state
                self.publish_state()

    def publish_state(self):
        topic = f"actuator/{self.type}/state"
        payload = json.dumps({"state": self.state})
        self.mqtt_client.publish(topic, payload)
