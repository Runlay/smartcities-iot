import datetime
import json
import os
import random
import paho.mqtt.client as mqtt

mqtt_server = os.getenv("MQTT_SERVER", "localhost")
mqtt_port = int(os.getenv("MQTT_PORT", "1883"))

topic_in = 'OpenZWave/1/#'
topic_out = 'sensor/'

def generate_json(sensor_type, value_key, value, unit):
    return {
        "type-id": f"de.uni-stuttgart.sciot.aeon/{sensor_type}",
        "instance-id": f"0x{random.randint(100000000, 999999999):x}",
        "timestamp": datetime.now().isoformat() + "Z",
        "value": {value_key: str(value)},
    }

def transform_message(client, userdata, msg):
    sensor_type = ''
    value_key = ''
    value = msg['Value']

    match msg['Label']:
        case 'Illuminance':
            sensor_type = 'illuminance'
            value_key = 'lux'
        case 'Ultraviolet':
            sensor_type = 'ultraviolet'
            value_key = 'uv'
        case 'Air Temperature':
            sensor_type = 'temperature'
            value_key = 'degrees'
        case 'Humidity':
            sensor_type = 'humidity'
            value_key = 'percent'
        case 'Home Security':
            sensor_type = 'motion'
            value_key = 'detected'
            value = '1'
        case _:
            return

    msg_out = generate_json(sensor_type, value_key, value, msg['Units'])
    client.publish(topic_out + sensor_type, json.dumps(msg_out))

def connect_mqtt():
    def on_connect(client, userdata, flags, rc, properties):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.connect(mqtt_server, mqtt_port)
    client.subscribe(topic_in)
    client.on_message = transform_message
    client.loop_forever()
    return client

if __name__ == '__main__':
    connect_mqtt()