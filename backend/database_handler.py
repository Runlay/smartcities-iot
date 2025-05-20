import redis

class DatabaseHandler():
    def __init__(self):
        # Initialize Redis client
        self._client = None
        self.connect()
    
    def connect(self):
        try: 
            self._client = redis.StrictRedis(host='host.docker.internal', port=6379, db=0)
        except:
            print("Error while connecting.")

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