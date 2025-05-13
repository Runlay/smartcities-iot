import redis

# Connect to Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# Write data into Redis
key = "user:1"
value = "Alice"

# redis_client.set(key, value)

# print(f"Data written to Redis: {key} -> {value}")

# print(redis_client.get(key))