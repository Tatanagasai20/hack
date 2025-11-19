import pandas as pd

def safe_parse_datetime(series):
    return pd.to_datetime(series, errors="coerce")

def clean_traffic_df(df):
    if df is None or df.empty:
        return df
    df = df.copy()
# Example cleaning steps
    if "speed" in df.columns:
        df["speed"] = pd.to_numeric(df["speed"], errors="coerce")
    if "timestamp" in df.columns:
        df["timestamp"] = safe_parse_datetime(df["timestamp"])
        df = df.dropna(subset=[c for c in ["latitude", "longitude", "timestamp"] if c in df.columns])
        return df