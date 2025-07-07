from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from redis_handler import RedisHandler
from postgres_handler import PostgresHandler
from mqtt_worker import start_mqtt_worker
import json
import threading


# Start the MQTT worker in a separate thread
threading.Thread(target=start_mqtt_worker, daemon=True).start()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = RedisHandler()
postgres_client = PostgresHandler(
    dbname="postgres",
    user="admin",
    password="admin",
    host="postgres",
    port=5432,
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Sensor Data API",
        "status": "Running",
        "endpoints": {
            "/api/history": "Get sensor data history",
            "/api/push-data": "Push new sensor data",
        },
    }


@app.get("/api/history/temperature")
async def get_history():
    # Fetch data from Redis
    key = "sensors:temperature"
    stored_values = redis_client.get_list_values(key)

    if stored_values:
        return {"message": "Data retrieved successfully", "redis_value": stored_values}
    else:
        return {"message": "No data found"}


@app.post("/api/fetch-data")
async def fetch_data(data: dict):
    """
    Fetch data from Redis based on typeId and instanceId.

    instanceId: The specific instance of the sensor (e.g., "temperature").
    """

    key = f"sensors:{data['instanceId']}"

    # Fetch data from Redis
    stored_values = redis_client.get_list_values(key)

    if stored_values:
        return {
            "message": "Data retrieved successfully",
            "data": [json.loads(value) for value in stored_values],
        }
    else:
        return {"message": "No data found for the specified typeId and instanceId"}


@app.post("/api/push-data")
async def push_data(data: dict):
    """
    Push data to Redis with a key based on instanceId.

    data = {
        "typeId": "sensorType1",
        "instanceId": "temperature",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "value": {"sensorvaluetype": value},
    }

    """
    # Use instanceId as part of the key for grouping
    key = f"sensors:{data['instanceId']}"

    # Serialize data to JSON
    json_data = json.dumps(data)

    redis_client.lpush(key, json_data)

    return {"message": "Data pushed successfully", "data": data}


@app.get("/api/config")
async def get_config():
    config = postgres_client.get_latest_config()
    if config:
        return {"message": "Configuration retrieved successfully", "config": config}
    else:
        return {"message": "No configuration found", "config": None}
