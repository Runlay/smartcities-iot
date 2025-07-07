import requests

r = requests.post(
    "http://localhost:4000/api/push-data",
    json={
        "typeId": "sensorType1",
        "instanceId": "temperature",
        "timestamp": "2023-10-01T12:00:00Z",
        "value": {"sensorvaluetype": 25.5},
    },
)
print(r.status_code)
print(r.json())


r = requests.post(
    "http://localhost:4000/api/fetch-data",
    json={
        "instanceId": "temperature",
    },
)
print(r.status_code)
print(r.json())
