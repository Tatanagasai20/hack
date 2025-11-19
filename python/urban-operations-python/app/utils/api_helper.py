import requests
from loguru import logger

def get_json_with_retries(url, params=None, headers=None, max_retries=3, timeout=10):
    attempt = 0
    while attempt < max_retries:
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=timeout)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            attempt += 1
            logger.warning(f"Request failed ({attempt}/{max_retries}) for {url}: {e}")
            logger.error(f"All retries failed for {url}")
            return None