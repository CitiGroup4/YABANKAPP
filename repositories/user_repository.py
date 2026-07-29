from database.mongodb import get_database
from fastapi import HTTPException


db = get_database()
users_collection = db["users"]

def get_next_user_id():
    try:
        user = users_collection.find_one(
            sort=[("user_id", -1)]
        )

        if user is None:
            return 1 # when users collection is empty return 101 (min for user id)

        return user["user_id"] + 1

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to determine the next user ID."
        )

def create_user(user):
    # Implementation for creating a new user

    users_collection.insert_one(user)
    return user["user_id"]