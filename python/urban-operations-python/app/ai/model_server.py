from datetime import datetime
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from ..config.settings import AI_MODEL_PATH
from app.etl.fetch_weather_data import fetch_weather_data
from app.etl.fetch_pollution_data import fetch_pollution_data


app = FastAPI(title="Traffic Prediction Model Server")


class PredictRequest(BaseModel):
    latitude: float
    longitude: float
    hour: int


class PredictResponse(BaseModel):
    predicted_speed: float


model = None

HOTSPOTS = [
    {
        "id": "blr-cbd",
        "location": "MG Road, CBD",
        "latitude": 12.9738,
        "longitude": 77.6095,
    },
    {
        "id": "whitefield-tech",
        "location": "Whitefield Tech Park",
        "latitude": 12.9698,
        "longitude": 77.7499,
    },
    {
        "id": "electronic-city",
        "location": "Electronic City",
        "latitude": 12.8440,
        "longitude": 77.6636,
    },
    {
        "id": "hebbal-junction",
        "location": "Hebbal Junction",
        "latitude": 13.0358,
        "longitude": 77.5970,
    },
]


@app.on_event("startup")
async def load_model():
    global model
    try:
        model = joblib.load(AI_MODEL_PATH)
        print("Model loaded from", AI_MODEL_PATH)
    except Exception as e:
        print("Warning: model failed to load (using dummy). Error:", e)
        model = None


def _predict_speed(latitude: float, longitude: float, hour: int) -> float:
    global model
    X = np.array([[latitude, longitude, hour]])

    try:
        if model is not None:
            pred = model.predict(X)[0]
            print(f"Predicted speed: {pred}")
        else:
            # Basic fallback curve to mimic rush-hour slow-down
            print("⚠️ Model not loaded, using fallback value")
            pred = 35.0 - abs(12 - hour)  # slower near noon/evening

        return float(max(pred, 5.0))
    except Exception as e:
        print("❌ Prediction failed:", e)
        return 0.0


@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    speed = _predict_speed(req.latitude, req.longitude, req.hour)
    return {"predicted_speed": round(speed, 2)}


@app.get("/predictions")
async def get_batch_predictions():
    hour = datetime.utcnow().hour
    payload = []

    for spot in HOTSPOTS:
        speed = _predict_speed(spot["latitude"], spot["longitude"], hour)
        congestion_index = max(0.0, min(100.0, 100.0 - speed * 2))

        payload.append(
            {
                **spot,
                "hour": hour,
                "predicted_speed": round(speed, 2),
                "congestion_index": round(congestion_index, 2),
            }
        )

    return payload
    
    
@app.get("/weather")
def get_weather_data():
    df = fetch_weather_data()
    return df.to_dict(orient="records")

@app.get("/pollution")
def get_pollution_data():
    df = fetch_pollution_data()
    return df.to_dict(orient="records") 
