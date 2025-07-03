# MQTT Messages

## Environment State (published to `env/state` by context component)

```json
{
  "sensors": {
    "temperature": {
      "value": <string>,
      "unit": <string>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    },
    "humidity": {
      "value": <string>,
      "unit": <string>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    },
    "motion": {
      "value": <string>,
      "unit": <string>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    },
    "pressure": {
      "value": <string>,
      "unit": <string>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    }
  },
  "actuators": {
    "ac": {
      "isOn": <boolean>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    },
    "ventilation": {
      "isOn": <boolean>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    },
    "light": {
      "isOn": <boolean>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    },
    "alarm": {
      "isOn": <boolean>,
      "timestamp": <string (ISO 8601)>,
      "instanceId": <string>
    }
  }
}
```

## Environment Configuration (published to `env/config` by frontend component)

```json
{
  "temperature": {
    "min": <number>,
    "max": <number>
  },
  "humidity": {
    "min": <number>,
    "max": <number>
  },
  "motion": {
    "lightDuration": <integer>
  },
  "pressure": {
    "threshold": <integer>
  }
}
```

## Raw Sensor Data (published to `sensor/+` by gateway (and/or simulated sensors) component)

Published to corresponding sub-topics:

- temperature (unit: °C)
- humidity (unit: %)
- motion (value: true or false, unit: "")
- pressure (unit: kg)

```json
{
  "type": <string>, // "temperature", "humidity", "motion", or "pressure"
  "value": <string>,
  "unit": <string>, // °C, %, "", kg
  "timestamp": <string (ISO 8601), // e.g. 2025-06-30T07:06:15Z
  "instanceId": <string> // automatically generated
}
```

### Example

```json
{
  "type": "motion",
  "value": "false",
  "unit": "",
  "timestamp": "2025-06-30T07:05:32Z",
  "instanceId": "0xe238dbw3c277"
}
```

## Actuator Commands (published to `actuator/+/command` by orchestration/context component)

```json
{
  "command": <string> // "ON" if corresponding should be turned on, "OFF" otherwise
}
```

## Actuator State (published to `actuator/+/state` by gateway component after state changed)

```json
{
  "state": <string> // "ON" if corresponding is currently on, "OFF" otherwise
}
```

## Problem Instances (publishes to `planner/problem`)

```json
{
  "id": <string>,
  "content": <string>,
  "timestamp": <string (ISO 8601)
}
```
