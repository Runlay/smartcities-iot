from typing import Dict, Any
from datetime import datetime


class EnvironmentStateManager:
    def __init__(self):
        timestamp = datetime.now().isoformat()

        self.state = {
            "sensors": {
                "temperature": None,
                "humidity": None,
                "motion": None,
                "pressure": None,
            },
            "actuators": {
                "ac": {
                    "isOn": "OFF",
                    "timestamp": timestamp,
                    "instanceId": "default-ac",
                },
                "ventilation": {
                    "isOn": "OFF",
                    "timestamp": timestamp,
                    "instanceId": "default-ventilation",
                },
                "light": {
                    "isOn": "OFF",
                    "timestamp": timestamp,
                    "instanceId": "default-light",
                },
                "alarm": {
                    "isOn": "OFF",
                    "timestamp": timestamp,
                    "instanceId": "default-alarm",
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
            # Map "state" to "isOn" for internal consistency
            if "state" in data:
                data["isOn"] = data.pop("state")
            self.state["actuators"][actuator_type].update(data)
        else:
            raise ValueError(f"Unknown actuator type: {actuator_type}")

    def get_state(self) -> Dict[str, Any]:
        return self.state
