import redis
from fastapi import FastAPI
import uvicorn
from mqtt import init_mqtt
from database_handler import DatabaseHandler



app = FastAPI()

# Connect to Redis
# Use the service name ('redis') if using Docker Compose, or the appropriate host
init_mqtt()

redis_client = DatabaseHandler()

@app.get("/")
async def root():
    # Write data into Redis
    key = "sensors:temp"
    value = "12"
    
    if not redis_client.exists(key):
        redis_client.set(key, value)

    else: 
        redis_client.lpush(key, value)
    
    return {
        "message": "Success",
    }

@app.get("/api/history")
async def get_history():
    # Fetch data from Redis
    key = "sensors:temp"
    stored_value = redis_client.get(key)
    
    if stored_value:
        return {
            "message": "Data retrieved successfully",
            "redis_value": stored_value.decode('utf-8')
        }
    else:
        return {
            "message": "No data found"
        }