from typing import Dict, Any
from datetime import datetime


class ProblemGenerator:
    def __init__(self):
        self.problem_counter = 0

    def generate_problem(self, state: Dict[str, Any], config: Dict[str, Any]) -> str:
        self.problem_counter += 1
        problem_id = f"{self.problem_counter}"

        init_predicates = self._generate_init_predicates(state, config)

        goal_predicates = self._generate_goal_predicates(state, config)

        problem_content = f"""(define (problem {problem_id})
          (:domain smart-store)

          (:init
        {init_predicates}
          )

          (:goal (and
        {goal_predicates}
          ))
        )"""

        return {
            "id": problem_id,
            "content": problem_content,
            "timestamp": datetime.now().isoformat() + "Z",
        }

    def _generate_init_predicates(
        self, state: Dict[str, Any], config: Dict[str, Any]
    ) -> str:
        init_predicates = []

        # === SENSOR PREDICATES ===

        # Temperature
        if state["sensors"]["temperature"]:
            temp_value = float(state["sensors"]["temperature"]["value"])
            temp_config = config.get("temperature", {})
            temp_max = temp_config.get("max")

            if temp_max and temp_value > temp_max:
                init_predicates.append("    (temperature-high)")
            else:
                init_predicates.append("    (temperature-ok)")

        # Humidity
        if state["sensors"]["humidity"]:
            humidity_value = float(state["sensors"]["humidity"]["value"])
            humidity_config = config.get("humidity", {})
            humidity_max = humidity_config.get("max")

            if humidity_max and humidity_value > humidity_max:
                init_predicates.append("    (humidity-high)")
            else:
                init_predicates.append("    (humidity-ok)")

        # Motion (check if motion is currently detected)
        if state["sensors"]["motion"]:
            motion_detected = state["sensors"]["motion"]["value"].lower() == "true"
            if motion_detected:
                init_predicates.append("    (motion-detected)")
            else:
                init_predicates.append("    (no-motion-detected)")

        # Pressure
        if state["sensors"]["pressure"]:
            pressure_value = int(state["sensors"]["pressure"]["value"])
            pressure_config = config.get("pressure", {})
            pressure_max = pressure_config.get("threshold")

            if pressure_max and pressure_value > pressure_max:
                init_predicates.append("    (pressure-high)")
            else:
                init_predicates.append("    (pressure-ok)")

        # === ACTUATOR PREDICATES ===

        # AC
        if state["actuators"]["ac"] and state["actuators"]["ac"]["isOn"] == "ON":
            init_predicates.append("    (ac-on)")

        # Ventilation
        if (
            state["actuators"]["ventilation"]
            and state["actuators"]["ventilation"]["isOn"] == "ON"
        ):
            init_predicates.append("    (ventilation-on)")

        # Light
        if state["actuators"]["light"] and state["actuators"]["light"]["isOn"] == "ON":
            init_predicates.append("    (light-on)")

        # Alarm
        if state["actuators"]["alarm"] and state["actuators"]["alarm"]["isOn"] == "ON":
            init_predicates.append("    (alarm-on)")

        return "\n".join(init_predicates)

    def _generate_goal_predicates(
        self, state: Dict[str, Any], config: Dict[str, Any]
    ) -> str:
        goal_predicates = []

        # AC
        if state["sensors"]["temperature"]:
            temp_value = float(state["sensors"]["temperature"]["value"])
            temp_config = config.get("temperature", {})
            temp_max = temp_config.get("max")
            temp_min = temp_config.get("min")

            print(
                f"🌡️  TEMP DEBUG: value={temp_value}, config={temp_config}, min={temp_min}, max={temp_max}"
            )

            if temp_max and temp_value > temp_max:
                goal_predicates.append("    (ac-on)")
                print(f"🔥 AC ON: {temp_value} > {temp_max}")
            elif temp_min and temp_max and temp_min <= temp_value <= temp_max:
                goal_predicates.append("    (not (ac-on))")
                print(f"✅ AC OFF: {temp_value} in range [{temp_min}, {temp_max}]")
            elif temp_min and temp_value < temp_min:
                goal_predicates.append("    (not (ac-on))")
                print(f"🧊 AC OFF: {temp_value} < {temp_min}")
            else:
                goal_predicates.append("    (not (ac-on))")
                print(f"❓ AC OFF: fallback case for {temp_value}")

        # Humidity
        if state["sensors"]["humidity"]:
            humidity_value = float(state["sensors"]["humidity"]["value"])
            humidity_config = config.get("humidity", {})
            humidity_max = humidity_config.get("max")
            humidity_min = humidity_config.get("min")

            print(
                f"💧 HUMIDITY DEBUG: value={humidity_value}, config={humidity_config}, min={humidity_min}, max={humidity_max}"
            )

            if humidity_max and humidity_value > humidity_max:
                goal_predicates.append("    (ventilation-on)")
                print(f"🌪️  VENT ON: {humidity_value} > {humidity_max}")
            elif (
                humidity_min
                and humidity_max
                and humidity_min <= humidity_value <= humidity_max
            ):
                goal_predicates.append("    (not (ventilation-on))")
                print(
                    f"✅ VENT OFF: {humidity_value} in range [{humidity_min}, {humidity_max}]"
                )
            elif humidity_min and humidity_value < humidity_min:
                goal_predicates.append("    (not (ventilation-on))")
                print(f"🏜️  VENT OFF: {humidity_value} < {humidity_min}")
            else:
                goal_predicates.append("    (not (ventilation-on))")
                print(f"❓ VENT OFF: fallback case for {humidity_value}")

        # Motion
        if state["sensors"]["motion"]:
            motion_detected = state["sensors"]["motion"]["value"].lower() == "true"
            if motion_detected:
                goal_predicates.append("    (light-on)")
            else:
                goal_predicates.append("    (not (light-on))")

        # Pressure
        if state["sensors"]["pressure"]:
            pressure_value = int(state["sensors"]["pressure"]["value"])
            pressure_config = config.get("pressure", {})
            pressure_max = pressure_config.get("threshold")

            if pressure_max and pressure_value > pressure_max:
                goal_predicates.append("    (alarm-on)")
            else:
                goal_predicates.append("    (not (alarm-on))")

        return "\n".join(goal_predicates)
