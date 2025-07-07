from mqtt_client import MqttClient
from simulated_actuator import SimulatedActuator
from simulated_sensor import SimulatedSensor
from dotenv import load_dotenv

load_dotenv()

# Instantiate actuators
ac = SimulatedActuator("ac")
ventilation = SimulatedActuator("ventilation")

# Instantiate sensors (will be initialized below)
temperature_sensor = None
humidity_sensor = None


# Create MQTT client with a dispatcher for all actuators and config
def on_message(client, userdata, message):
    print(
        f"Dispatching message. Topic: {message.topic}, Payload: {message.payload.decode()}"
    )
    if message.topic.startswith("actuator/ac/"):
        ac.on_message(client, userdata, message)
    elif message.topic.startswith("actuator/ventilation/"):
        ventilation.on_message(client, userdata, message)

    else:
        print(f"Unhandled topic: {message.topic}")


mqtt_client = MqttClient(on_message)

# Set MQTT client for actuators (subscribe to their topics)
ac.set_mqtt_client(mqtt_client)
ventilation.set_mqtt_client(mqtt_client)


# Instantiate sensors, passing the corresponding actuator
temperature_sensor = SimulatedSensor("temperature", "°C", ac, mqtt_client, {})
humidity_sensor = SimulatedSensor("humidity", "%", ventilation, mqtt_client, {})

# Start sensor threads
temperature_sensor.start()
humidity_sensor.start()

# Start MQTT client loop (blocking)
mqtt_client.loop_forever()
