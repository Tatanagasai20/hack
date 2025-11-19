import requests
from loguru import logger
import os
from dotenv import load_dotenv

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_API_URL", "http://localhost:8081/api/predictions")

def send_results_to_backend(df):
    """
    Sends processed predictions to backend service for visualization/storage.
    """
    if df.empty:
        logger.warning("⚠️ No data to send.")
        return

    try:
        payload = df.to_dict(orient="records")
        logger.info(f"📡 Sending {len(payload)} records to backend: {BACKEND_URL}")
        res = requests.post(BACKEND_URL, json=payload)

        if res.status_code == 200:
            logger.success("✅ Data successfully sent to backend.")
        else:
            logger.warning(f"⚠️ Backend responded with {res.status_code}: {res.text}")
    except Exception as e:
        logger.error(f"❌ Failed to send data to backend: {e}")
