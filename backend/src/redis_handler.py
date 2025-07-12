import redis


class RedisHandler:
    def __init__(self):
        # Initialize Redis client
        self._client = None
        self.connect()

    def connect(self):
        try:
            self._client = redis.StrictRedis(host="redis", port=6379, db=0)
            # Return session information
            info = self._client.info()
        except Exception as e:
            print("Error while connecting.")
            print(e)

    def set_value(self, key, value):
        try:
            self._client.set(key, value)
        except Exception as e:
            print("Error while setting value.", e)

    def lpush(self, key, value):
        try:
            self._client.lpush(key, value)
        except Exception as e:
            print("Error while pushing value to list.", e)

    def get_value(self, key):
        try:
            return self._client.get(key)
        except Exception as e:
            print("Error while getting value.", e)

    def get_list_values(self, key):
        try:
            return self._client.lrange(key, 0, -1)
        except Exception as e:
            print("Error while getting value.", e)
