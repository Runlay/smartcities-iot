from typing import Dict, Any
from datetime import datetime


class EnvironmentStateManager:
    def __init__(self):
        timestamp = datetime.now().isoformat() + "Z"

        self.state = {
            "sensors": {
                "temperature": None,
                "humidity": None,
                "motion": None,
                "pressure": None,
            },
            "actuators": {
                "ac": {
                    "state": "OFF",
                    "timestamp": timestamp,
                },
                "ventilation": {
                    "state": "OFF",
                    "timestamp": timestamp,
                },
                "light": {
                    "state": "OFF",
                    "timestamp": timestamp,
                },
                "alarm": {
                    "state": "OFF",
                    "timestamp": timestamp,
                },
            },
        }

    def update_sensor_data(self, sensor_type: str, data: Dict[str, Any]) -> None:
        if sensor_type in self.state["sensors"]:
            self.state["sensors"][sensor_type] = data
        else:
            raise ValueError(f"Unknown sensor type: {sensor_type}")

    def update_actuator_state(self, actuator_type: str, data: Dict[str, Any]) -> None:
        if actuator_type in self.state["actuators"]:
            self.state["actuators"][actuator_type] = data
        else:
            raise ValueError(f"Unknown actuator type: {actuator_type}")

    def get_state(self) -> Dict[str, Any]:
        return self.state
