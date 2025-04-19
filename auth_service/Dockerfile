FROM python:3.11-slim
ENV PYTHONUNBUFFERED 1

WORKDIR /ecommerce
COPY requirements.txt .

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .
ENTRYPOINT["sh", "/ecommerce/entrypoint.sh"]