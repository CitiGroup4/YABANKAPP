from pymongo import MongoClient
from pymongo.server_api import ServerApi

from core.config import settings


client = MongoClient(
    settings.MONGODB_URI,
    server_api=ServerApi("1")
)


database = client[settings.MONGODB_DATABASE]


def get_database():
    return database


def close_database():
    client.close()