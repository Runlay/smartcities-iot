import redis
from fastapi import FastAPI
import uvicorn
from mqtt import init_mqtt
from database_handler import DatabaseHandler
import json
import time
import random

app = FastAPI()

# Connect to Redis
# Use the service name ('redis') if using Docker Compose, or the appropriate host
init_mqtt()

redis_client = redis.StrictRedis(host='redis', port=6379, db=0)#DatabaseHandler()

@app.get("/")
async def root():
   
    # Simulate data
    random_value = random.random()

    data = {
        "typeId": "sensorType1",
        "instanceId": "temp",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "value": {"randomValue": random_value},
    }

    # Use instanceId as part of the key for grouping
    key = f"sensors:{data['instanceId']}"

    # Serialize data to JSON
    json_data = json.dumps(data)

    # Push to Redis list
    redis_client.lpush(key, json_data)
    
    return {
        "message": "Success",
    }

@app.get("/api/history")
async def get_history():
    # Fetch data from Redis
    key = "sensors:temp"
    stored_values = redis_client.lrange(key, 0, 9)  # Last 10 entries


    if stored_values:
        return {
            "message": "Data retrieved successfully",
            "redis_value": str(stored_values)
        }
    else:
        return {
            "message": "No data found"
        }