FROM python:3.13-slim

RUN pip install uv
# Install Docker CLI
RUN apt-get update && apt-get install -y docker.io
RUN apt-get update && apt-get install -y sudo


WORKDIR /orchestration

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache

COPY . .

ENV PYTHONPATH=/orchestration/src

CMD ["uv", "run", "orchestration.py"]