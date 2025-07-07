import os
import json
import random
import time
from datetime import datetime
import requests
from threading import Thread
import secrets


class SimulatedSensor:
    def __init__(self, type, unit, actuator, mqtt_client, env_config):
        self.type = type
        self.unit = unit
        self.actuator = actuator
        self.mqtt_client = mqtt_client
        self.load_env_config()
        self.value = random.uniform(self.min_value, self.max_value)
        self.above_range_counter = 0
        self.instance_id = self.generate_instance_id()
        self.actuator_lag_counter = 0  # NEW: lag after actuator turns on
        self.actuator_lag_phase = 0  # 0: no lag, 1: rising, 2: stagnant, 3: decrease

    def load_env_config(
        self,
    ):
        self.min_value = float(
            os.getenv(
                f"DEFAULT_{self.type.upper()}_MIN",
            )
        )
        self.max_value = float(
            os.getenv(
                f"DEFAULT_{self.type.upper()}_MAX",
            )
        )
        self.upper_threshold = self.max_value + float(
            os.getenv(
                f"DEFAULT_{self.type.upper()}_UPPER",
            )
        )
        self.interval = float(
            os.getenv(
                f"DEFAULT_{self.type.upper()}_INTERVAL",
            )
        )
        self.increase_rate = float(
            os.getenv(
                f"DEFAULT_{self.type.upper()}_INCREASE_RATE",
            )
        )
        self.decrease_rate = float(
            os.getenv(
                f"DEFAULT_{self.type.upper()}_DECREASE_RATE",
            )
        )

    def fetch_latest_config(self):
        url = "http://backend:8000/api/config"
        try:
            res = requests.get(url, timeout=2)
            data = res.json()
            if "config" in data and self.type in data["config"]:
                return data["config"][self.type]
        except Exception as e:
            print(f"Error fetching config for {self.type}: {e}")
        return {}

    def update_config(self, new_config):
        self.min_value = new_config.get("min", self.min_value)
        self.max_value = new_config.get("max", self.max_value)
        self.upper_threshold = self.max_value + float(
            os.getenv(
                f"DEFAULT_{self.type.upper()}_UPPER",
            )
        )

    def simulate(self):
        while True:
            latest_config = self.fetch_latest_config()
            if latest_config:
                self.update_config(latest_config)

            # Actuator ON: introduce lag before decrease
            if self.actuator.state == "ON":
                if self.actuator_lag_phase == 0:
                    self.actuator_lag_phase = 1
                    self.actuator_lag_counter = 0
                # Phase 1: continue to rise for 1 cycle
                if self.actuator_lag_phase == 1:
                    self.actuator_lag_counter += 1
                    self.value = min(
                        self.value + self.increase_rate, self.upper_threshold
                    )
                    if self.actuator_lag_counter >= 1:
                        self.actuator_lag_phase = 2
                        self.actuator_lag_counter = 0
                # Phase 2: stagnant for 1 cycle
                elif self.actuator_lag_phase == 2:
                    self.actuator_lag_counter += 1
                    # Small random variation
                    variation = random.uniform(-0.1, 0.1)
                    self.value = max(
                        self.min_value,
                        min(self.upper_threshold, self.value + variation),
                    )
                    if self.actuator_lag_counter >= 1:
                        self.actuator_lag_phase = 3
                # Phase 3: start decreasing
                elif self.actuator_lag_phase == 3:
                    target_value = (self.min_value + self.max_value) / 2
                    if self.value > target_value:
                        self.value = max(self.value - self.decrease_rate, target_value)
                    elif self.value < target_value:
                        self.value = min(self.value + self.decrease_rate, target_value)
                    else:
                        variation = random.uniform(-0.1, 0.1)
                        self.value = max(
                            self.min_value,
                            min(self.max_value, target_value + variation),
                        )
                self.above_range_counter = 0
            # Actuator OFF: normal logic
            else:
                self.actuator_lag_phase = 0
                if self.above_range_counter < 5:
                    if self.value >= self.min_value and self.value <= self.max_value:
                        variation = random.uniform(-0.2, 0.2)
                        self.value = max(
                            self.min_value, min(self.max_value, self.value + variation)
                        )
                    else:
                        self.value = random.uniform(self.min_value, self.max_value)
                    self.above_range_counter += 1
                else:
                    self.value = min(
                        self.value + self.increase_rate, self.upper_threshold
                    )
            self.publish()
            time.sleep(self.interval)

    def generate_instance_id(self):
        # Generate 12 random hex characters
        hex_chars = "".join(secrets.choice("0123456789abcdef") for _ in range(12))
        return f"0x{hex_chars}"

    def publish(self):
        payload = json.dumps(
            {
                "type": self.type,
                "value": f"{self.value:.2f}",
                "unit": self.unit,
                "timestamp": datetime.now().isoformat() + "Z",
                "instanceId": self.instance_id,
            }
        )

        self.mqtt_client.publish(f"sensor/{self.type}", payload)

    def start(self):
        Thread(target=self.simulate, daemon=True).start()
