import pandas as pd
import numpy as np
from loguru import logger


def fetch_pollution_data():
    try:
        logger.info("🌫 Generating simulated pollution data...")
        pollutants = ["PM2.5", "PM10", "NO2", "O3", "CO", "SO2"]
        values = np.random.uniform(10, 80, size=len(pollutants))

        df = pd.DataFrame({
            "pollutant": pollutants,
            "value": values,
            "unit": ["µg/m³"] * len(pollutants)
        })

        logger.info(f"✅ Simulated pollution data generated with {len(df)} records.")
        return df

    except Exception as e:
        logger.error(f"❌ Failed to generate pollution data: {e}")
        return pd.DataFrame()


if __name__ == "_main_":
    df = fetch_pollution_data()
    print("Pollution Data Sample:")
    print(df)