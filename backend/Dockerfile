FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies (kept minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app

EXPOSE 10000

# Render provides a $PORT environment variable at runtime.
# Default to 10000 if not provided so local runs are straightforward.
ENV PORT=${PORT:-10000}

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1"]
