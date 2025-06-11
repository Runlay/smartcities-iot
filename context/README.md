# Context Service

The Context Service transforms **Output (Environment State):**

````json
{
  "temperature": "ok",
  "humidity": "too_high",
  "motion": "motion",
  "pressure": "ok",
  "timestamp": "2025-06-11T17:41:57.085503Z"
}
```readings into discrete states that can be processed by the AI planner. It subscribes to sensor data via MQTT and publishes environment state changes.

## Functionality

### State Mapping

The service converts continuous sensor values into discrete categories:

- **Temperature**: `ok`, `too_high`, `too_low` based on target ± tolerance
- **Humidity**: `ok`, `too_high`, `too_low` based on target ± tolerance
- **Motion**: `motion`, `no_motion` (boolean values)
- **Pressure**: `ok`, `too_high` based on threshold

### MQTT Topics

**Subscribed Topics:**

- `sensor/temperature` - Raw temperature readings
- `sensor/humidity` - Raw humidity readings
- `sensor/motion` - Motion detection (boolean)
- `sensor/pressure` - Pressure/weight readings

**Published Topics:**

- `env/state` - Current environment context state

### Message Format

**Input (Sensor Data):**

```json
{
  "type-id": "de.uni-stuttgart.sciot.aeon/temperature",
  "instance-id": "0x608c62b",
  "timestamp": "2025-06-11T17:35:37.154960Z",
  "value": {
    "degrees": "23.0"
  }
}
````

**Different sensor types:**

- **Temperature**: `value.degrees` (string, converted to float)
- **Humidity**: `value.percent` (string, converted to float)
- **Motion**: `value.detected` (string "0" or "1", converted to boolean)
- **Pressure**: `value.kg` (string, converted to float)

**Output (Environment State):**

```json
{
  "temperature": "ok",
  "humidity": "too_high",
  "motion": "motion",
  "pressure": "ok",
  "timestamp": 1749656132.153
}
```

## Configuration

Environment variables for threshold configuration:

- `MQTT_BROKER` - MQTT broker hostname (default: localhost)
- `MQTT_PORT` - MQTT broker port (default: 1883)
- `TEMPERATURE_TARGET` - Target temperature in Celsius (default: 22.0)
- `TEMPERATURE_TOLERANCE` - Temperature tolerance (default: 2.0)
- `HUMIDITY_TARGET` - Target humidity percentage (default: 50.0)
- `HUMIDITY_TOLERANCE` - Humidity tolerance (default: 10.0)
- `PRESSURE_THRESHOLD` - Pressure threshold for too_high state (default: 1000.0)

## Development

```bash
# Install dependencies
uv pip install -e .

# Run locally
python main.py

# Build Docker image
docker build -t context-service .
```

## Integration

The Context Service is part of the SmartStore IoT system workflow:

1. Gateway publishes sensor readings
2. Context Service processes and categorizes data
3. Environment state changes trigger AI planning
4. Plans are executed via orchestration service
