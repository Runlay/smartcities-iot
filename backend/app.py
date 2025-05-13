import redis
from fastapi import FastAPI
import uvicorn

app = FastAPI()

# Connect to Redis
# Use the service name ('redis') if using Docker Compose, or the appropriate host
redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

@app.get("/")
async def root():
    # Write data into Redis
    key = "user:1"
    value = "Alice"
    
    if not redis_client.exists(key):
        redis_client.set(key, value)

    stored_value = redis_client.get(key)
    
    return {
        "message": "Success",
        "redis_value": stored_value.decode('utf-8') if stored_value else None
    }