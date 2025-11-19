import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from joblib import dump
from ..config.settings import AI_MODEL_PATH


def generate_dummy_traffic_data(n=1000):
    """Generate synthetic traffic data for model training."""
    rng = np.random.RandomState(42)
    # 'T' deprecated -> use 'min'
    timestamps = pd.date_range(end=pd.Timestamp.now(), periods=n, freq="min")

    df = pd.DataFrame({
        "latitude": 12.97 + rng.rand(n) * 0.02,
        "longitude": 77.59 + rng.rand(n) * 0.02,
        "hour": timestamps.hour,
        "speed": rng.normal(loc=30, scale=8, size=n)
    })
    return df


def train_and_save_model(path=AI_MODEL_PATH):
    """Train RandomForest model and save it to the models folder."""
    print("🚀 Training Traffic Prediction Model...")

    # Generate dummy data
    df = generate_dummy_traffic_data()
    X = df[["latitude", "longitude", "hour"]]
    y = df["speed"]

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)

    # Ensure models folder exists
    os.makedirs(os.path.dirname(path), exist_ok=True)

    # Save model file
    dump(model, path)
    print(f"✅ Model trained and saved successfully at: {path}")
    print(f"📅 Training completed on: {pd.Timestamp.now()}")


if __name__ == "__main__":
    train_and_save_model()
