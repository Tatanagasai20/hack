import pandas as pd
import numpy as np
from loguru import logger

def fetch_traffic_data(n=5):
    """
    Simulates fetching latest traffic readings from sensors or APIs.
    Replace this with actual API calls or DB queries later.
    """
    logger.info(" Fetching simulated traffic data...")
    rng = np.random.RandomState()
    data = {
        "latitude": 12.97 + rng.rand(n) * 0.02,
        "longitude": 77.59 + rng.rand(n) * 0.02,
        "hour": pd.Timestamp.now().hour + rng.randint(-1, 2, size=n)
    }
    df = pd.DataFrame(data)
    logger.info(f"Fetched {len(df)} records.")
    return df
