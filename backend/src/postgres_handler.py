import psycopg
import json


class PostgresHandler:
    def __init__(self, dbname, user, password, host, port):
        try:
            self._conn = psycopg.connect(
                dbname=dbname, user=user, password=password, host=host, port=port
            )
            self.ensure_table()
        except Exception as e:
            print("Error connecting to PostgreSQL database.", e)

    def ensure_table(self):
        # Table is now created via initialization script in db-init/
        # This method is kept for compatibility but does nothing
        pass

    def create_config(self, config):
        with self._conn.cursor() as cur:
            cur.execute(
                "INSERT INTO environment_config (config) VALUES (%s)",
                [json.dumps(config)],
            )
            self._conn.commit()

    def get_latest_config(self):
        with self._conn.cursor() as cur:
            cur.execute(
                "SELECT config FROM environment_config ORDER BY updated_at DESC, id DESC LIMIT 1"
            )
            row = cur.fetchone()
            return row[0] if row else None
