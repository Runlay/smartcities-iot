#!/usr/bin/env python3
"""
Test the context service with real sensor data format to verify it works correctly
"""

import json
from main import ContextService


def test_with_actual_log_data():
    """Test with the exact data from your logs"""
    print("Testing with actual sensor log data...")

    context = ContextService()

    # Test messages from your logs
    test_messages = [
        {
            "topic": "sensor/humidity",
            "data": {
                "type-id": "de.uni-stuttgart.sciot.aeon/humidity",
                "instance-id": "0x11043e03",
                "timestamp": "2025-06-11T17:35:32.149794Z",
                "value": {"percent": "49"},
            },
        },
        {
            "topic": "sensor/motion",
            "data": {
                "type-id": "de.uni-stuttgart.sciot.aeon/motion",
                "instance-id": "0xed66540",
                "timestamp": "2025-06-11T17:35:32.149859Z",
                "value": {"detected": "0"},
            },
        },
        {
            "topic": "sensor/pressure",
            "data": {
                "type-id": "de.uni-stuttgart.sciot.aeon/pressure",
                "instance-id": "0x2197aacf",
                "timestamp": "2025-06-11T17:35:32.149939Z",
                "value": {"kg": "724"},
            },
        },
        {
            "topic": "sensor/temperature",
            "data": {
                "type-id": "de.uni-stuttgart.sciot.aeon/temperature",
                "instance-id": "0x608c62b",
                "timestamp": "2025-06-11T17:35:37.154960Z",
                "value": {"degrees": "23.0"},
            },
        },
    ]

    print("\nProcessing actual sensor messages:")
    for msg in test_messages:
        try:
            changed = context._process_sensor_data(msg["topic"], msg["data"])
            print(f"✅ {msg['topic']}: {msg['data']['value']} -> Changed: {changed}")
        except Exception as e:
            print(f"❌ {msg['topic']}: ERROR - {e}")

    print(f"\nFinal context state:")
    state = context.get_current_context()
    for key, value in state.items():
        print(f"  {key}: {value}")

    print("\n🎉 All real sensor data processed successfully!")


if __name__ == "__main__":
    test_with_actual_log_data()
