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

    state = {
        "state": data['command']
    }

    client.publish('actuator/light/state', json.dumps(state))

def alarm(client, userdata, msg):
    payload = msg.payload.decode("utf-8")
    data = json.loads(payload)

    if data['command'] == 'ON':
        bz.beep()
    elif data['command'] == 'OFF':
        bz.off()

    state = {
        "state": data['command']
    }

    client.publish('actuator/alarm/state', json.dumps(state))

def main():
    connect_mqtt('actuator/light/command', light)
    connect_mqtt('actuator/alarm/command', alarm)

    while True:
        pass

if __name__ == '__main__':
    main()