from sqlalchemy import create_engine
from loguru import logger
from ..config.settings import DB_URI
import pandas as pd

def get_engine():
    if not DB_URI:
        raise ValueError("DB_URI not configured in environment")
    engine = create_engine(DB_URI, pool_pre_ping=True)
    return engine

def load_to_mysql(df: pd.DataFrame, table_name: str = "traffic_data"):
    if df is None or df.empty:
        logger.info("No data to load to DB")
        return
    engine = get_engine()
    df.to_sql(table_name, con=engine, if_exists="append", index=False)
    logger.info("Loaded %d rows into %s", len(df), table_name)