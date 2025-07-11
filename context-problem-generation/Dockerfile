FROM python:3.13-slim

RUN pip install uv

WORKDIR /context

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache

COPY src/ ./src/

ENV PYTHONPATH=/context/src

CMD ["uv", "run", "src/mqtt_client.py"]