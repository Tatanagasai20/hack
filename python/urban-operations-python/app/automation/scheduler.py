import time
import schedule
import requests
import pandas as pd
from loguru import logger
from app.etl.fetch_traffic_data import fetch_traffic_data
from app.api.send_to_backend import send_results_to_backend

AI_API_URL = "http://127.0.0.1:9000/predict"

def process_data():
    logger.info("🧠 Starting scheduled ETL + prediction cycle...")

    # Step 1: Fetch data
    df = fetch_traffic_data(n=5)

    # Step 2: Predict speeds via FastAPI model
    predictions = []
    for _, row in df.iterrows():
        payload = {
            "latitude": float(row["latitude"]),
            "longitude": float(row["longitude"]),
            "hour": int(row["hour"])
        }

        try:
            res = requests.post(AI_API_URL, json=payload)
            if res.status_code == 200:
                pred_speed = res.json().get("predicted_speed", 0)
                predictions.append(pred_speed)
                logger.info(f"Predicted speed: {pred_speed:.2f} km/h")
            else:
                predictions.append(0)
                logger.warning(f"Prediction API error: {res.status_code}")
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            predictions.append(0)

    # Add predictions to DataFrame
    df["predicted_speed"] = predictions

    # Step 3: Send results to backend
    send_results_to_backend(df)

    logger.success("✅ ETL + Prediction + Backend pipeline completed.")

# Schedule every 30 minutes (adjust as needed)
schedule.every(30).minutes.do(process_data)

logger.info("⏰ Scheduler started. Waiting for next run...")
process_data()  # optional immediate first run

while True:
    schedule.run_pending()
    time.sleep(10)
