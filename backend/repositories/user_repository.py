from backend.database.mongodb import get_database
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
        print("defaulting to id 1.")
        return 1

def create_user(user):
    # Implementation for creating a new user
    users_collection.insert_one(user)
    return user["user_id"]

def get_user_by_email(email):
    user = users_collection.find_one(
        {"email": email}
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return user