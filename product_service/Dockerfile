FROM python:3.11-slim
ENV PYTHONBUFFERED 1

WORKDIR /app
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
    
    
COPY . .
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
