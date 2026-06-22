import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "meditech-dev-secret")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/meditech")
    MONGO_DB = os.getenv("MONGO_DB", "meditech")
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
        ).split(",")
        if origin.strip()
    ]
    MODEL_DIR = BASE_DIR / "models"
