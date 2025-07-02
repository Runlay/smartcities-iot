from typing import Dict, Any, Optional
from dotenv import load_dotenv
import os


class EnvironmentConfigurationManager:
    def __init__(self):
        load_dotenv()

        DEFAULT_TEMPERATURE_MIN = float(os.getenv("DEFAULT_TEMPERATURE_MIN", 18.0))
        DEFAULT_TEMPERATURE_MAX = float(os.getenv("DEFAULT_TEMPERATURE_MAX", 20.0))
        DEFAULT_HUMIDITY_MIN = float(os.getenv("DEFAULT_HUMIDITY_MIN", 40.0))
        DEFAULT_HUMIDITY_MAX = float(os.getenv("DEFAULT_HUMIDITY_MAX", 50.0))
        DEFAULT_MOTION_LIGHT_DURATION = int(
            os.getenv("DEFAULT_MOTION_LIGHT_DURATION", 30)
        )
        DEFAULT_PRESSURE_THRESHOLD = int(os.getenv("DEFAULT_PRESSURE_THRESHOLD", 100))

        self.config = {
            "temperature": {
                "min": DEFAULT_TEMPERATURE_MIN,
                "max": DEFAULT_TEMPERATURE_MAX,
            },
            "humidity": {
                "min": DEFAULT_HUMIDITY_MIN,
                "max": DEFAULT_HUMIDITY_MAX,
            },
            "motion": {
                "lightDuration": DEFAULT_MOTION_LIGHT_DURATION,
            },
            "pressure": {
                "threshold": DEFAULT_PRESSURE_THRESHOLD,
            },
        }

    def update_config(self, new_config: Dict[str, Any]) -> None:
        for sensor_type, config_data in new_config.items():
            if sensor_type in self.config:
                self.config[sensor_type].update(config_data)
            else:
                raise ValueError(f"Unknown sensor type: {sensor_type}")

    def get_config(self) -> Dict[str, Any]:
        return self.config

    def get_sensor_config(self, sensor_type: str) -> Optional[Dict[str, Any]]:
        return self.config.get(sensor_type)
