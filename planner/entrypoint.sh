#!/bin/bash
# filepath: /Volumes/WD_Black SN770/Users/raycuement/GitHub Repositories/smartcities-iot/planner/entrypoint.sh

# Run Fast Downward
/fast-downward/fast-downward.py "$@"

# Run your Python script
pip install -r /requirements.txt
python3 /mqtt_client.py