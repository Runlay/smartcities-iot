def transform_sensor_value(sensor_type, sensor_value):
    match sensor_type:
        case "temperature":
            temperature = sensor_value

            temperature_predicate = ""
            if temperature < 18:
                temperature_predicate = "(temperature-low)"
            elif 18 <= temperature <= 22:
                temperature_predicate = "(temperature-ok)"
            else:
                temperature_predicate = "(temperature-high)"

            return temperature_predicate
        case "humidity":
            humidity = sensor_value

            humidity_predicate = ""

            if humidity < 40:
                humidity_predicate = "(humidity-low)"
            elif 40 <= humidity <= 60:
                humidity_predicate = "(humidity-ok)"
            else:
                humidity_predicate = "(humidity-high)"

            return humidity_predicate
        case "motion":
            motion = sensor_value

            motion_predicate = "(motion-detected)" if motion else "(no-motion-detected)"

            return motion_predicate
        case "pressure":
            pressure = sensor_value

            pressure_predicate = ""

            if pressure < 1000:
                pressure_predicate = "(pressure-ok)"
            else:
                pressure_predicate = "(pressure-high)"

            return pressure_predicate


# def generate_goals(sensor_predicates):
#     goals = []

#     if "(temperature-high)" in sensor_predicates:
#         goals.append("(ac-on)")
#     elif "(temperature-ok)" or "(temperature-low)" in sensor_predicates:
#         goals.append("(ac-off)")

#     if "(humidity-low)" in sensor_predicates:
#         goals.append("(humidifier-on)")
#     elif "(humidity-high)" in sensor_predicates:
#         goals.append("(humidifier-off)")

#     if "(motion-detected)" in sensor_predicates:
#         goals.append("(alarm-off)")
#     elif "(no-motion-detected)" in sensor_predicates:
#         goals.append("(alarm-on)")

#     return goals
