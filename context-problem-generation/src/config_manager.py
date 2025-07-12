import requests
import os


class EnvironmentConfigurationManager:
    def fetch_latest_config(self):
        url = "http://backend:8000/api/config"
        try:
            res = requests.get(url)
            data = res.json()
            if "config" in data and data["config"] is not None:
                return data["config"]
        except Exception as e:
            print(f"Error fetching config: {e}")

        DEFAULT_TEMPERATURE_MIN = float(os.getenv("DEFAULT_TEMPERATURE_MIN", 18.0))
        DEFAULT_TEMPERATURE_MAX = float(os.getenv("DEFAULT_TEMPERATURE_MAX", 20.0))
        DEFAULT_HUMIDITY_MIN = float(os.getenv("DEFAULT_HUMIDITY_MIN", 40.0))
        DEFAULT_HUMIDITY_MAX = float(os.getenv("DEFAULT_HUMIDITY_MAX", 50.0))

        default_config = {
            "temperature": {
                "min": DEFAULT_TEMPERATURE_MIN,
                "max": DEFAULT_TEMPERATURE_MAX,
            },
            "humidity": {
                "min": DEFAULT_HUMIDITY_MIN,
                "max": DEFAULT_HUMIDITY_MAX,
            },
        }

        return default_config
