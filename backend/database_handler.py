import redis

class DatabaseHandler():
    def __init__(self):
        # Initialize Redis client
        self._client = None
        self.connect()
    
    def connect(self):
        try: 
            self._client = redis.StrictRedis(host='redis', port=6379, db=0)
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