from typing import Dict, Any, Optional


class EnvironmentConfigurationManager:
    def __init__(self):
        self.config = {
            "temperature": {
                "min": 18.0,
                "max": 20.0,
            },
            "humidity": {
                "min": 40.0,
                "max": 50.0,
            },
            "motion": {
                "lightDuration": 30,
            },
            "pressure": {
                "threshold": 100,
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
