# ===== Stage 1: Base Image =====
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependency file first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set environment variables (you can override via docker-compose or `docker run -e`)
ENV AI_MODEL_PATH=./app/models/traffic_model.joblib \
    AI_API_URL=http://127.0.0.1:9000/predict \
    BACKEND_API_URL=http://localhost:8081/api/predictions \
    DB_URL=mysql+pymysql://admin:Javabackend123@myapp-db.ch8skokui0sy.ap-south-1.rds.amazonaws.com:3306/myapp_db \
    LOG_DIR=./logs \
    PYTHONUNBUFFERED=1

# Expose the FastAPI port
EXPOSE 9000

# Command to start the model server
CMD ["uvicorn", "app.ai.model_server:app", "--host", "0.0.0.0", "--port", "9000"]

