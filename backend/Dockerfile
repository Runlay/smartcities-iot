FROM python:3.13-slim

# Install system dependencies for psycopg compilation
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    g++ \
    make \
    libc6-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN pip install uv

WORKDIR /backend

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache

COPY src/ ./src/

ENV PYTHONPATH=/backend/src

CMD ["uv", "run", "fastapi", "run", "src/main.py"]