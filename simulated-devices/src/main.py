from mqtt_client import MqttClient
from simulated_actuator import SimulatedActuator
from simulated_sensor import SimulatedSensor

# Instantiate actuators
ac = SimulatedActuator("ac")
ventilation = SimulatedActuator("ventilation")


# Create MQTT client with a dispatcher for all actuators
def on_message(client, userdata, message):
    ac.on_message(client, userdata, message)
    ventilation.on_message(client, userdata, message)


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
