from mqtt_client import MqttClient
from simulated_actuator import SimulatedActuator
from simulated_sensor import SimulatedSensor
import json

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
    elif message.topic == "env/config":
        handle_config_update(message.payload.decode())
    else:
        print(f"Unhandled topic: {message.topic}")


def handle_config_update(payload):
    try:
        config = json.loads(payload)
        print(f"🔧 SENSOR CONFIG UPDATE: Received {config}")

        # Update temperature sensor config
        if temperature_sensor and "temperature" in config:
            temperature_sensor.update_config(config["temperature"])
            print(f"📊 Updated temperature sensor config: {config['temperature']}")

        # Update humidity sensor config
        if humidity_sensor and "humidity" in config:
            humidity_sensor.update_config(config["humidity"])
            print(f"📊 Updated humidity sensor config: {config['humidity']}")

    except json.JSONDecodeError:
        print("❌ Failed to parse config JSON")
    except Exception as e:
        print(f"❌ Error updating sensor config: {e}")


mqtt_client = MqttClient(on_message)

# Set MQTT client for actuators (subscribe to their topics)
ac.set_mqtt_client(mqtt_client)
ventilation.set_mqtt_client(mqtt_client)

# Subscribe to config updates
mqtt_client.subscribe("env/config")

# Instantiate sensors, passing the corresponding actuator
temperature_sensor = SimulatedSensor("temperature", "°C", ac, mqtt_client, {})
humidity_sensor = SimulatedSensor("humidity", "%", ventilation, mqtt_client, {})

# Start sensor threads
temperature_sensor.start()
humidity_sensor.start()

# Start MQTT client loop (blocking)
mqtt_client.loop_forever()
