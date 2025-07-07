import psycopg2
import json


class PostgresHandler:
    def __init__(self, dbname, user, password, host, port):
        try:
            self._conn = psycopg2.connect(
                dbname=dbname, user=user, password=password, host=host, port=port
            )
            self.ensure_table()
        except Exception as e:
            print("Error connecting to PostgreSQL database.", e)

    def ensure_table(self):
        with self._conn.cursor() as cur:
            try:
                # Try to create the table normally
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS environment_config (
                        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                        config JSONB NOT NULL,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    """
                )
                self._conn.commit()
            except psycopg2.Error as e:
                # If there's a sequence conflict, clean up and recreate
                if "environment_config_id_seq" in str(e) and "already exists" in str(e):
                    print("Sequence conflict detected, cleaning up...")
                    self._conn.rollback()  # Rollback the failed transaction

                    # Clean up the orphaned sequence and table
                    cur.execute("DROP TABLE IF EXISTS environment_config CASCADE;")
                    cur.execute(
                        "DROP SEQUENCE IF EXISTS environment_config_id_seq CASCADE;"
                    )

                    # Now create the table fresh
                    cur.execute(
                        """
                        CREATE TABLE environment_config (
                            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                            config JSONB NOT NULL,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );
                        """
                    )
                    self._conn.commit()
                    print("Table and sequence created successfully after cleanup.")
                else:
                    # Re-raise if it's a different error
                    raise

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
