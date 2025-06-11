import json
import logging
import time
import os
from datetime import datetime
from typing import Dict, Any
from dataclasses import dataclass
from enum import Enum
import paho.mqtt.client as mqtt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TemperatureState(Enum):
    OK = "ok"
    TOO_HIGH = "too_high"
    TOO_LOW = "too_low"


class HumidityState(Enum):
    OK = "ok"
    TOO_HIGH = "too_high"
    TOO_LOW = "too_low"


class MotionState(Enum):
    MOTION = "motion"
    NO_MOTION = "no_motion"


class PressureState(Enum):
    OK = "ok"
    TOO_HIGH = "too_high"


@dataclass
class SensorThresholds:
    temperature_target: float = 22.0  # Celsius
    temperature_tolerance: float = 2.0  # +/- tolerance
    humidity_target: float = 50.0  # Percentage
    humidity_tolerance: float = 10.0  # +/- tolerance
    pressure_threshold: float = 1000.0  # Weight threshold for storage racks


@dataclass
class EnvironmentContext:
    temperature: TemperatureState = TemperatureState.OK
    humidity: HumidityState = HumidityState.OK
    motion: MotionState = MotionState.NO_MOTION
    pressure: PressureState = PressureState.OK
    last_updated: float = 0.0


class ContextService:
    def __init__(self, mqtt_broker: str = "localhost", mqtt_port: int = 1883):
        self.mqtt_broker = mqtt_broker
        self.mqtt_port = mqtt_port
        self.client = mqtt.Client()
        self.thresholds = SensorThresholds()
        self.context = EnvironmentContext()

        # MQTT setup
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message

        # Load thresholds from environment variables if available
        self._load_thresholds_from_env()

    def _load_thresholds_from_env(self):
        """Load threshold values from environment variables"""
        try:
            if os.getenv("TEMPERATURE_TARGET"):
                self.thresholds.temperature_target = float(
                    os.getenv("TEMPERATURE_TARGET")
                )
            if os.getenv("TEMPERATURE_TOLERANCE"):
                self.thresholds.temperature_tolerance = float(
                    os.getenv("TEMPERATURE_TOLERANCE")
                )
            if os.getenv("HUMIDITY_TARGET"):
                self.thresholds.humidity_target = float(os.getenv("HUMIDITY_TARGET"))
            if os.getenv("HUMIDITY_TOLERANCE"):
                self.thresholds.humidity_tolerance = float(
                    os.getenv("HUMIDITY_TOLERANCE")
                )
            if os.getenv("PRESSURE_THRESHOLD"):
                self.thresholds.pressure_threshold = float(
                    os.getenv("PRESSURE_THRESHOLD")
                )

            logger.info(
                f"Loaded thresholds - Temp: {self.thresholds.temperature_target}±{self.thresholds.temperature_tolerance}, "
                f"Humidity: {self.thresholds.humidity_target}±{self.thresholds.humidity_tolerance}, "
                f"Pressure: {self.thresholds.pressure_threshold}"
            )
        except ValueError as e:
            logger.warning(f"Invalid threshold value in environment variables: {e}")

    def _on_connect(self, client, userdata, flags, rc):
        """Callback for MQTT connection"""
        if rc == 0:
            logger.info("Connected to MQTT broker")
            # Subscribe to all sensor topics
            client.subscribe("sensor/temperature")
            client.subscribe("sensor/humidity")
            client.subscribe("sensor/motion")
            client.subscribe("sensor/pressure")
            logger.info(
                "Subscribed to sensor topics: temperature, humidity, motion, pressure"
            )
        else:
            logger.error(f"Failed to connect to MQTT broker: {rc}")

    def _on_message(self, client, userdata, msg):
        """Callback for MQTT messages"""
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode())
            logger.info(f"Received message on {topic}: {payload}")

            # Update context based on sensor data
            context_changed = self._process_sensor_data(topic, payload)

            if context_changed:
                self._publish_context_state()
                logger.info("Context changed - published new state")

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in message: {e}")
        except Exception as e:
            logger.error(f"Error processing message: {e}")

    def _process_sensor_data(self, topic: str, data: Dict[str, Any]) -> bool:
        """Process sensor data and update context. Returns True if context changed."""
        previous_context = EnvironmentContext(
            temperature=self.context.temperature,
            humidity=self.context.humidity,
            motion=self.context.motion,
            pressure=self.context.pressure,
        )

        try:
            # Extract the actual sensor value from the nested structure
            value_data = data.get("value", {})

            if topic == "sensor/temperature":
                # Extract temperature from 'degrees' field
                temp_value = float(value_data.get("degrees", 0))
                self._update_temperature_context(temp_value)
            elif topic == "sensor/humidity":
                # Extract humidity from 'percent' field
                humidity_value = float(value_data.get("percent", 0))
                self._update_humidity_context(humidity_value)
            elif topic == "sensor/motion":
                # Extract motion from 'detected' field (string "0" or "1")
                motion_detected = value_data.get("detected", "0") == "1"
                self._update_motion_context(motion_detected)
            elif topic == "sensor/pressure":
                # Extract pressure from 'kg' field
                pressure_value = float(value_data.get("kg", 0))
                self._update_pressure_context(pressure_value)

            self.context.last_updated = time.time()

        except (ValueError, TypeError, KeyError) as e:
            logger.error(f"Error parsing sensor data for {topic}: {e}")
            logger.error(f"Data: {data}")
            return False

        # Check if context actually changed
        return (
            previous_context.temperature != self.context.temperature
            or previous_context.humidity != self.context.humidity
            or previous_context.motion != self.context.motion
            or previous_context.pressure != self.context.pressure
        )

    def _update_temperature_context(self, temperature: float):
        """Update temperature context based on thresholds"""
        target = self.thresholds.temperature_target
        tolerance = self.thresholds.temperature_tolerance

        if temperature > target + tolerance:
            self.context.temperature = TemperatureState.TOO_HIGH
            logger.debug(
                f"Temperature {temperature}°C -> TOO_HIGH (target: {target}±{tolerance})"
            )
        elif temperature < target - tolerance:
            self.context.temperature = TemperatureState.TOO_LOW
            logger.debug(
                f"Temperature {temperature}°C -> TOO_LOW (target: {target}±{tolerance})"
            )
        else:
            self.context.temperature = TemperatureState.OK
            logger.debug(
                f"Temperature {temperature}°C -> OK (target: {target}±{tolerance})"
            )

    def _update_humidity_context(self, humidity: float):
        """Update humidity context based on thresholds"""
        target = self.thresholds.humidity_target
        tolerance = self.thresholds.humidity_tolerance

        if humidity > target + tolerance:
            self.context.humidity = HumidityState.TOO_HIGH
            logger.debug(
                f"Humidity {humidity}% -> TOO_HIGH (target: {target}±{tolerance})"
            )
        elif humidity < target - tolerance:
            self.context.humidity = HumidityState.TOO_LOW
            logger.debug(
                f"Humidity {humidity}% -> TOO_LOW (target: {target}±{tolerance})"
            )
        else:
            self.context.humidity = HumidityState.OK
            logger.debug(f"Humidity {humidity}% -> OK (target: {target}±{tolerance})")

    def _update_motion_context(self, motion: bool):
        """Update motion context"""
        if motion:
            self.context.motion = MotionState.MOTION
            logger.debug("Motion detected -> MOTION")
        else:
            self.context.motion = MotionState.NO_MOTION
            logger.debug("No motion -> NO_MOTION")

    def _update_pressure_context(self, pressure: float):
        """Update pressure context based on threshold"""
        if pressure > self.thresholds.pressure_threshold:
            self.context.pressure = PressureState.TOO_HIGH
            logger.debug(
                f"Pressure {pressure} -> TOO_HIGH (threshold: {self.thresholds.pressure_threshold})"
            )
        else:
            self.context.pressure = PressureState.OK
            logger.debug(
                f"Pressure {pressure} -> OK (threshold: {self.thresholds.pressure_threshold})"
            )

    def _publish_context_state(self):
        """Publish current context state to MQTT"""
        context_data = {
            "temperature": self.context.temperature.value,
            "humidity": self.context.humidity.value,
            "motion": self.context.motion.value,
            "pressure": self.context.pressure.value,
            "timestamp": datetime.now().isoformat() + "Z",
        }

        self.client.publish("env/state", json.dumps(context_data))
        logger.info(f"Published context state: {context_data}")

    def get_current_context(self) -> Dict[str, str]:
        """Get current context as dictionary"""
        return {
            "temperature": self.context.temperature.value,
            "humidity": self.context.humidity.value,
            "motion": self.context.motion.value,
            "pressure": self.context.pressure.value,
        }

    def update_thresholds(self, new_thresholds: Dict[str, float]):
        """Update threshold values"""
        if "temperature_target" in new_thresholds:
            self.thresholds.temperature_target = new_thresholds["temperature_target"]
        if "temperature_tolerance" in new_thresholds:
            self.thresholds.temperature_tolerance = new_thresholds[
                "temperature_tolerance"
            ]
        if "humidity_target" in new_thresholds:
            self.thresholds.humidity_target = new_thresholds["humidity_target"]
        if "humidity_tolerance" in new_thresholds:
            self.thresholds.humidity_tolerance = new_thresholds["humidity_tolerance"]
        if "pressure_threshold" in new_thresholds:
            self.thresholds.pressure_threshold = new_thresholds["pressure_threshold"]

        logger.info(f"Updated thresholds: {new_thresholds}")

    def start(self):
        """Start the context service"""
        try:
            self.client.connect(self.mqtt_broker, self.mqtt_port, 60)
            logger.info(
                f"Starting context service, connecting to {self.mqtt_broker}:{self.mqtt_port}"
            )
            self.client.loop_forever()
        except Exception as e:
            logger.error(f"Failed to start context service: {e}")


def main():
    """Main entry point for the context service"""
    # Configuration from environment variables
    mqtt_broker = os.getenv("MQTT_BROKER", "localhost")
    mqtt_port = int(os.getenv("MQTT_PORT", "1883"))

    # Create and start context service
    context_service = ContextService(mqtt_broker, mqtt_port)
    logger.info("Starting Context Service...")
    logger.info(f"Connecting to MQTT broker at {mqtt_broker}:{mqtt_port}")
    context_service.start()


if __name__ == "__main__":
    main()
