import psycopg2


class PostgresHandler:
    def __init__(self, dbname, user, password, host, port):
        try:
            self._conn = psycopg2.connect(
                dbname=dbname, user=user, password=password, host=host, port=port
            )
        except Exception as e:
            print("Error connecting to PostgreSQL database.", e)
