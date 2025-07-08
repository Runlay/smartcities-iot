-- Initialize the environment_config table
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Clean up any existing table and sequences to ensure a fresh start
DROP SEQUENCE IF EXISTS environment_config_id_seq CASCADE;
DROP TABLE IF EXISTS environment_config CASCADE;

-- Create the environment_config table
CREATE TABLE environment_config (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    config JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on updated_at for better query performance
CREATE INDEX idx_environment_config_updated_at ON environment_config(updated_at DESC);
