from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
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



@app.on_event("startup")
async def load_model():
    global model
    try:
        model = joblib.load(AI_MODEL_PATH)
        print("Model loaded from", AI_MODEL_PATH)
    except Exception as e:
        print("Warning: model failed to load (using dummy). Error:", e)

        model = None

@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    global model
    X = np.array([[req.latitude, req.longitude, req.hour]])

    try:
        if model is not None:
            pred = model.predict(X)[0]
            print(f"Predicted speed: {pred}")
        else:
            print("⚠️ Model not loaded, using fallback value")
            pred = 25.0  # fallback default speed

        # ✅ Always return a valid dictionary
        return {"predicted_speed": float(pred)}

    except Exception as e:
        print("❌ Prediction failed:", e)
        # ✅ Return valid response even if error occurs
        return {"predicted_speed": 0.0}
    
    
@app.get("/weather")
def get_weather_data():
    df = fetch_weather_data()
    return df.to_dict(orient="records")

@app.get("/pollution")
def get_pollution_data():
    df = fetch_pollution_data()
    return df.to_dict(orient="records") 
