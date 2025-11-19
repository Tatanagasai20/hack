import requests
import pandas as pd
from loguru import logger
from ..config.settings import WEATHER_API_URL


def fetch_weather_data():
    """
    Fetch hourly temperature data for a given location using Open-Meteo API.
    Returns a pandas DataFrame with hour and temperature columns.
    """
    try:
        logger.info("🌦 Fetching weather data from API...")

        # Fetch data from Open-Meteo
        res = requests.get(WEATHER_API_URL, timeout=10)
        res.raise_for_status()  # Raises HTTPError if status != 200

        data = res.json()
        hourly = data.get("hourly", {})
        temperature_data = hourly.get("temperature_2m", [])

        # Use only first 5 hours for testing/demo
        hours = list(range(len(temperature_data[:5])))

        df = pd.DataFrame({
            "hour": hours,
            "temperature_celsius": temperature_data[:5]
        })

        logger.info(f"✅ Weather data fetched successfully with {len(df)} records.")
        return df

    except Exception as e:
        logger.error(f"❌ Failed to fetch weather data: {e}")
        return pd.DataFrame()


if __name__ == "_main_":
    df = fetch_weather_data()
    print("Weather Data Sample:")
    print(df.head())