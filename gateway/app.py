from datetime import datetime as dt
from zoneinfo import ZoneInfo
import json
import os
import paho.mqtt.client as mqtt
from gpiozero import RGBLED, Button, Buzzer, Device
from gpiozero.pins.native import NativeFactory
from time import sleep

mqtt_server = os.getenv("MQTT_SERVER", "rabbitmq")
mqtt_port = int(os.getenv("MQTT_PORT", "1883"))

Device.pin_factory = NativeFactory()
led = RGBLED(red=17, green=18, blue=19, pwm=False)
bz = Buzzer(2)

# MQTT topics to subscribe to
MQTT_ACTUATOR_COMMAND_TOPICS = [
    "actuator/light/command",
    "actuator/alarm/command",
]


def get_timestamp():
    """Generate ISO 8601 timestamp in German timezone"""
    return dt.now(ZoneInfo("Europe/Berlin")).isoformat()


def on_connect(client, userdata, flags, reason_code, properties):
    """Subscribe to all actuator command topics when connected"""
    if reason_code == 0:
        for topic in MQTT_ACTUATOR_COMMAND_TOPICS:
            client.subscribe(topic)
    else:
        print(f"Failed to connect to MQTT broker, return code: {reason_code}")


def on_message(client, userdata, msg):
    """Handle incoming MQTT messages"""
    try:
        topic = msg.topic
        payload = msg.payload.decode()
        data = json.loads(payload)
        command = data.get("command", "").upper()

        if topic == "actuator/light/command":
            handle_light(client, command)
        elif topic == "actuator/alarm/command":
            handle_alarm(client, command)

    except json.JSONDecodeError as e:
        print(f"❌ Failed to decode JSON: {e}")
    except Exception as e:
        print(f"❌ Error handling message: {e}")


def handle_light(client, command):
    """Handle light actuator commands"""
    try:
        print(f"[LIGHT] Received command: {command}")
        if command == "ON":
            print("[LIGHT] Turning LED ON")
            led.on()
        elif command == "OFF":
            print("[LIGHT] Turning LED OFF")
            led.off()
        else:
            print(f"[LIGHT] Unknown command: {command}")

        # Publish state message
        state = {"state": command, "timestamp": get_timestamp()}
        state_message = json.dumps(state)
        client.publish("actuator/light/state", state_message)

    except Exception as e:
        print(f"❌ Error in light handler: {e}")


def handle_alarm(client, command):
    """Handle alarm actuator commands"""
    try:
        print(f"[ALARM] Received command: {command}")
        if command == "ON":
            print("[ALARM] Turning buzzer ON")
            bz.beep()
        elif command == "OFF":
            print("[ALARM] Turning buzzer OFF")
            bz.off()
        else:
            print(f"[ALARM] Unknown command: {command}")

        # Publish state message
        state = {"state": command, "timestamp": get_timestamp()}
        state_message = json.dumps(state)
        client.publish("actuator/alarm/state", state_message)

    except Exception as e:
        print(f"❌ Error in alarm handler: {e}")


def main():
    """Main function to start the gateway"""
    try:
        # Create single MQTT client
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.username_pw_set("guest", "guest")
        client.on_connect = on_connect
        client.on_message = on_message

        # Connect to MQTT broker
        client.connect(mqtt_server, mqtt_port, 60)

        # Start MQTT loop (blocking)
        client.loop_forever()

    except KeyboardInterrupt:
        print("🛑 Gateway shutting down...")
    except Exception as e:
        print(f"❌ Fatal error in main: {e}")


if __name__ == "__main__":
    main()
