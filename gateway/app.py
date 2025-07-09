from datetime import datetime as dt
import json
import os
import random
import paho.mqtt.client as mqtt
from gpiozero import RGBLED, Button, Buzzer, Device
from gpiozero.pins.native import NativeFactory
from time import sleep

mqtt_server = os.getenv("MQTT_SERVER", "localhost")
mqtt_port = int(os.getenv("MQTT_PORT", "1883"))

Device.pin_factory = NativeFactory()
led = RGBLED(red=17, green=18, blue=19, pwm=False)
bz = Buzzer(2)
#button = Button(13) # TODO Pin

topic_in = 'OpenZWave/1/#'
topic_out = 'sensor/'

def generate_json(sensor_type, value_key, value, unit):
    return {
        "type-id": f"de.uni-stuttgart.sciot.aeon/{sensor_type}",
        "instance-id": f"0x{random.randint(100000000, 999999999):x}",
        "timestamp": dt.now().isoformat() + "Z",
        "value": {value_key: str(value)},
    }

def transform_message(client, userdata, msg):
    payload = msg.payload.decode("utf-8")
    data = json.loads(payload)

    sensor_type = ''
    value_key = ''
    value = data['Value']

    match data['Label']:
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

    print(f'Message Received: {sensor_type}')

    msg_out = generate_json(sensor_type, value_key, value, data['Units'])
    client.publish(topic_out + sensor_type, json.dumps(msg_out))

def connect_mqtt(topic, on_message):
    def on_connect(client, userdata, flags, rc, properties):
        if rc == 0:
            print("Connected to MQTT: " + topic)
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.connect(mqtt_server, mqtt_port)
    client.subscribe(topic)
    client.on_message = on_message
    client.loop_start()
    return client

def light(client, userdata, msg):
    payload = msg.payload.decode("utf-8")
    data = json.loads(payload)

    if data['command'] == 'ON':
        led.on()
    elif data['command'] == 'OFF':
        led.off()

def alarm(client, userdata, msg):
    payload = msg.payload.decode("utf-8")
    data = json.loads(payload)

    if data['command'] == 'ON':
        bz.beep()
        pass
    elif data['command'] == 'OFF':
        bz.off()
        pass

def button_press():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    msg = generate_json('pressure', 'detected', '1', '')
    client.publish(topic_out + 'pressure', json.dumps(msg))

def main():
    connect_mqtt(topic_in, transform_message)
    connect_mqtt('actuator/light/command', light)
    connect_mqtt('actuator/alarm/command', alarm)
    #button.when_pressed = button_press

    while True:
        pass

if __name__ == '__main__':
    main()