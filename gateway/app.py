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
            print(f"Connected to MQTT broker, subscribed to: {topic}")
        else:
            print(f"Failed to connect to MQTT broker, return code: {rc}")

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.username_pw_set("guest", "guest")
    client.connect(mqtt_server, mqtt_port)
    client.subscribe(topic)
    client.on_message = on_message
    client.loop_start()
    return client


def light(client, userdata, msg):
    try:
        payload = msg.payload.decode("utf-8")
        print(f"📨 Received light command: {payload}")

        data = json.loads(payload)
        command = data.get("command", "").upper()

        if command == "ON":
            led.on()
            print("💡 LED turned ON")
        elif command == "OFF":
            led.off()
            print("💡 LED turned OFF")
        else:
            print(f"⚠️ Unknown light command: {command}")
            return

        state = {"state": command}
        state_message = json.dumps(state)

        client.publish("actuator/light/state", state_message)
        print(f"📤 Published light state: {state_message}")

    except json.JSONDecodeError as e:
        print(f"❌ Failed to decode JSON in light command: {e}")
    except Exception as e:
        print(f"❌ Error in light handler: {e}")


def alarm(client, userdata, msg):
    try:
        payload = msg.payload.decode("utf-8")
        print(f"📨 Received alarm command: {payload}")

        data = json.loads(payload)
        command = data.get("command", "").upper()

        if command == "ON":
            bz.beep()
            print("🔔 Buzzer turned ON")
        elif command == "OFF":
            bz.off()
            print("🔔 Buzzer turned OFF")
        else:
            print(f"⚠️ Unknown alarm command: {command}")
            return

        state = {"state": command}
        state_message = json.dumps(state)

        client.publish("actuator/alarm/state", state_message)
        print(f"📤 Published alarm state: {state_message}")

    except json.JSONDecodeError as e:
        print(f"❌ Failed to decode JSON in alarm command: {e}")
    except Exception as e:
        print(f"❌ Error in alarm handler: {e}")


def main():
    print("🚀 Starting Gateway Application")

    try:
        connect_mqtt("actuator/light/command", light)
        connect_mqtt("actuator/alarm/command", alarm)

        print("✅ Gateway initialized successfully")
        print("🔄 Listening for actuator commands...")

        while True:
            sleep(1)  # Add small delay to reduce CPU usage

    except KeyboardInterrupt:
        print("🛑 Gateway shutting down...")
    except Exception as e:
        print(f"❌ Fatal error in main: {e}")


if __name__ == "__main__":
    main()
