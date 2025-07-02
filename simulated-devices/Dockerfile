FROM python:3.13-slim

RUN pip install uv

WORKDIR /simulated-devices

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache

COPY src/ ./src/

ENV PYTHONPATH=/simulated-devices/src

CMD ["uv", "run", "src/main.py"]