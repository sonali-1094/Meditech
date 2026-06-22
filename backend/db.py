from datetime import datetime, timezone

from pymongo import MongoClient
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from config import Config


client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=1500)
db = client[Config.MONGO_DB]


def mongo_available():
    try:
        client.admin.command("ping")
        return True
    except ServerSelectionTimeoutError:
        return False


def save_ai_event(event_type, payload, result):
    try:
        db.ai_events.insert_one(
            {
                "eventType": event_type,
                "payload": payload,
                "result": result,
                "createdAt": datetime.now(timezone.utc),
            }
        )
    except PyMongoError:
        # API responses should not fail just because analytics storage is offline.
        return False
    return True
