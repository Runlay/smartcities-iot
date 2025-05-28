import redis

class DatabaseHandler():
    def __init__(self):
        # Initialize Redis client
        self._client = None
        self.connect()
    
    def connect(self):
        try: 
            self._client = redis.StrictRedis(host='host.docker.internal', port=6379, db=0) 
            # Return session information
            info = self._client.info()
            print("Connected to Redis. Session info:")
            print(f"Redis version: {info.get('redis_version')}")
            print(f"Connected clients: {info.get('connected_clients')}")
            print(f"Used memory: {info.get('used_memory_human')}")
        except Exception as e:
            print("Error while connecting.")
            print(e)
        

    def set_value(self, key, value):
        try:
            self._client.set(key, value)
        except:
            print("Error while setting value.")
    
    def lpush(self, key, value):
        try:
            self._client.lpush(key, value)
        except:
            print("Error while pushing value to list.")

    def get_value(self, key):
        try:
            return self._client.get(key)
        except:
            print("Error while getting value.")

    def get_list_values(self, key):
        try:
            return self._client.lrange(key, 0, -1)
        except:
            print("Error while getting value.")