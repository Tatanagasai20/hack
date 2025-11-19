import os
from dotenv import load_dotenv
load_dotenv()


TRAFFIC_API_URL = os.getenv("TRAFFIC_API_URL")
WEATHER_API_URL = os.getenv("WEATHER_API_URL")
POLLUTION_API_URL = os.getenv("POLLUTION_API_URL")
BACKEND_API_URL = os.getenv("BACKEND_API_URL")
DB_URI = os.getenv("DB_URI")
AI_MODEL_PATH = os.getenv("AI_MODEL_PATH", "./models/traffic_model.joblib")
AI_API_URL = os.getenv("AI_API_URL")


ENV = os.getenv("ENV", "development")


# Scheduler config
INGESTION_INTERVAL_MINUTES = int(os.getenv("INGESTION_INTERVAL_MINUTES", "60"))