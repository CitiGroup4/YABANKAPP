import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    MONGODB_URI = os.getenv("MONGODB_URI")
    MONGODB_DATABASE = os.getenv("DATABASE_NAME")


settings = Settings()