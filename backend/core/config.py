import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    MONGODB_URI = os.getenv("MONGODB_URI")
    MONGODB_DATABASE = os.getenv("MONGODB_DATABASE")
    TOKEN_SECRET = os.getenv("TOKEN_SECRET")
    EXPIRATION_TIME = os.getenv("EXPIRATION_TIME")


settings = Settings()