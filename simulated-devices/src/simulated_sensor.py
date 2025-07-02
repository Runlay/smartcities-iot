import os
import json
import random
import time
from datetime import datetime
from dotenv import load_dotenv
from threading import Thread
import secrets

load_dotenv()


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

    def update_config(self, new_config):
        self.min_value = new_config.get("min", self.min_value)
        self.max_value = new_config.get("max", self.max_value)

    def simulate(self):
        while True:
            if self.actuator.state:  # Actuator ON: decrease value toward normal range
                if self.value > self.max_value:
                    self.value = max(self.value - self.decrease_rate, self.max_value)
                elif self.value < self.min_value:
                    self.value = min(self.value + self.decrease_rate, self.min_value)
                else:
                    self.value = random.uniform(self.min_value, self.max_value)
                self.above_range_counter = 0
            else:  # Actuator OFF: random in range, then slowly increase above max
                if self.value <= self.max_value:
                    self.value = random.uniform(self.min_value, self.max_value)
                    self.above_range_counter += 1
                else:
                    self.value = min(
                        self.value + self.increase_rate, self.upper_threshold
                    )
                # After N intervals, start increasing above max
                if self.above_range_counter > 5:
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
                "timestamp": datetime.now().isoformat(),
                "instanceId": self.instance_id,
            }
        )

        self.mqtt_client.publish(f"sensor/{self.type}", payload)

    def start(self):
        Thread(target=self.simulate, daemon=True).start()
