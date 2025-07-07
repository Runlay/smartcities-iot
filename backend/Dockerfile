FROM python:3.13-slim

RUN pip install uv

WORKDIR /backend

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache

COPY src/ ./src/

ENV PYTHONPATH=/backend/src

CMD ["uv", "run", "fastapi", "run", "src/main.py"]