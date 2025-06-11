#!/usr/bin/env python3
"""
Test script for the Context Service functionality
"""

import json
import time
from main import (
    ContextService,
    TemperatureState,
    HumidityState,
    MotionState,
    PressureState,
)


def test_context_mappings():
    """Test the context mapping logic without MQTT"""
    print("Testing Context Service mappings...")

    # Create context service instance
    context = ContextService()

    # Test temperature mapping
    print("\n--- Temperature Tests ---")
    context._update_temperature_context(19.0)  # too low (< 20.0)
    print(f"19.0°C -> {context.context.temperature.value}")
    assert context.context.temperature == TemperatureState.TOO_LOW

    context._update_temperature_context(22.0)  # ok
    print(f"22.0°C -> {context.context.temperature.value}")
    assert context.context.temperature == TemperatureState.OK

    context._update_temperature_context(25.0)  # too high (> 24.0)
    print(f"25.0°C -> {context.context.temperature.value}")
    assert context.context.temperature == TemperatureState.TOO_HIGH

    # Test humidity mapping
    print("\n--- Humidity Tests ---")
    context._update_humidity_context(35.0)  # too low (< 40.0)
    print(f"35.0% -> {context.context.humidity.value}")
    assert context.context.humidity == HumidityState.TOO_LOW

    context._update_humidity_context(50.0)  # ok
    print(f"50.0% -> {context.context.humidity.value}")
    assert context.context.humidity == HumidityState.OK

    context._update_humidity_context(65.0)  # too high (> 60.0)
    print(f"65.0% -> {context.context.humidity.value}")
    assert context.context.humidity == HumidityState.TOO_HIGH

    # Test motion mapping
    print("\n--- Motion Tests ---")
    context._update_motion_context(True)
    print(f"True -> {context.context.motion.value}")
    assert context.context.motion == MotionState.MOTION

    context._update_motion_context(False)
    print(f"False -> {context.context.motion.value}")
    assert context.context.motion == MotionState.NO_MOTION

    # Test pressure mapping
    print("\n--- Pressure Tests ---")
    context._update_pressure_context(500.0)  # ok
    print(f"500.0 -> {context.context.pressure.value}")
    assert context.context.pressure == PressureState.OK

    context._update_pressure_context(1500.0)  # too high
    print(f"1500.0 -> {context.context.pressure.value}")
    assert context.context.pressure == PressureState.TOO_HIGH

    print("\n--- All Tests Passed! ---")


def test_context_change_detection():
    """Test context change detection"""
    print("\n--- Context Change Detection Test ---")

    context = ContextService()

    # Initial state should cause change
    changed = context._process_sensor_data(
        "sensor/temperature", {"value": {"degrees": "19.0"}}
    )
    print(f"Initial temperature change: {changed}")
    assert changed

    # Same value should not cause change
    changed = context._process_sensor_data(
        "sensor/temperature", {"value": {"degrees": "19.0"}}
    )
    print(f"Same temperature change: {changed}")
    assert not changed

    # Different value that results in same state should not cause change
    changed = context._process_sensor_data(
        "sensor/temperature", {"value": {"degrees": "18.5"}}
    )
    print(f"Different value, same state change: {changed}")
    assert not changed

    # Value that changes state should cause change
    changed = context._process_sensor_data(
        "sensor/temperature", {"value": {"degrees": "22.0"}}
    )
    print(f"State changing value change: {changed}")
    assert changed

    print("Context change detection working correctly!")


def test_environment_state_output():
    """Test the environment state output format"""
    print("\n--- Environment State Output Test ---")

    context = ContextService()

    # Set some values
    context._update_temperature_context(25.0)  # too high
    context._update_humidity_context(35.0)  # too low
    context._update_motion_context(True)  # motion
    context._update_pressure_context(1500.0)  # too high
    context.context.last_updated = time.time()

    # Get current context
    state = context.get_current_context()
    print(f"Current context: {json.dumps(state, indent=2)}")

    expected = {
        "temperature": "too_high",
        "humidity": "too_low",
        "motion": "motion",
        "pressure": "too_high",
    }

    for key, expected_value in expected.items():
        assert state[key] == expected_value, (
            f"Expected {key}={expected_value}, got {state[key]}"
        )

    print("Environment state format correct!")


def test_real_sensor_data_format():
    """Test parsing real sensor data format"""
    print("\n--- Real Sensor Data Format Test ---")

    context = ContextService()

    # Test temperature sensor data (like from the logs)
    temp_data = {
        "type-id": "de.uni-stuttgart.sciot.aeon/temperature",
        "instance-id": "0x608c62b",
        "timestamp": "2025-06-11T17:35:37.154960Z",
        "value": {"degrees": "23.0"},
    }
    changed = context._process_sensor_data("sensor/temperature", temp_data)
    print(f"Temperature 23.0°C -> {context.context.temperature.value}")
    assert context.context.temperature == TemperatureState.OK

    # Test humidity sensor data
    humidity_data = {
        "type-id": "de.uni-stuttgart.sciot.aeon/humidity",
        "instance-id": "0x1913b812",
        "timestamp": "2025-06-11T17:35:42.155020Z",
        "value": {"percent": "61"},
    }
    changed = context._process_sensor_data("sensor/humidity", humidity_data)
    print(f"Humidity 61% -> {context.context.humidity.value}")
    assert context.context.humidity == HumidityState.TOO_HIGH

    # Test motion sensor data
    motion_data = {
        "type-id": "de.uni-stuttgart.sciot.aeon/motion",
        "instance-id": "0xadbe211",
        "timestamp": "2025-06-11T17:35:38.158792Z",
        "value": {"detected": "1"},
    }
    changed = context._process_sensor_data("sensor/motion", motion_data)
    print(f"Motion detected=1 -> {context.context.motion.value}")
    assert context.context.motion == MotionState.MOTION

    # Test pressure sensor data
    pressure_data = {
        "type-id": "de.uni-stuttgart.sciot.aeon/pressure",
        "instance-id": "0x2197aacf",
        "timestamp": "2025-06-11T17:35:32.149939Z",
        "value": {"kg": "724"},
    }
    changed = context._process_sensor_data("sensor/pressure", pressure_data)
    print(f"Pressure 724kg -> {context.context.pressure.value}")
    assert context.context.pressure == PressureState.OK

    print("Real sensor data format parsing working correctly!")


if __name__ == "__main__":
    test_context_mappings()
    test_context_change_detection()
    test_environment_state_output()
    test_real_sensor_data_format()
    print("\n🎉 All tests passed! Context Service is working correctly.")
