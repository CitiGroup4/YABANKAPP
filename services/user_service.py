from repositories import user_repository
from datetime import datetime, timezone, timedelta
from security.password import hash_password, verify_password
from fastapi import HTTPException

from core.config import settings
import jwt
from jwt import ExpiredSignatureError

def register_user(user):
    # Implementation for registering a new user
    new_user_id = user_repository.get_next_user_id()
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    print(user.password)
    print(len(user.password))
    print(type(user.password))

    user_data = {
        "user_id": new_user_id,
        "name": user.name,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "created_at": created_date
    }


    #Send the new user to the database
    user_repository.create_user(user_data)

    print("Registering new user: ", new_user_id)
    return new_user_id

def login_user(login_request):

    db_user = user_repository.get_user_by_email(
        login_request.email
    )

    password_correct = verify_password(
        login_request.password,
        db_user["password_hash"]
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid password."
        )

    return db_user


# Using user data, generate a jwt token and return
def generate_jwt(user_data):
    token_time_limit = str(datetime.now(timezone.utc) + timedelta(minutes=int(settings.EXPIRATION_TIME)))

    # Create payload
    payload_data = {
        "name": user_data["name"],
        "email": user_data["email"],
        "timestamp": token_time_limit  # timestamp of current request == settings.EXPIRATION_TIME
    }

    my_secret = settings.TOKEN_SECRET

    # Encode JWT, send back.
    token = jwt.encode(
        payload=payload_data,
        key=my_secret
    )

    return token

# Verify a token based on our secret.
# This takes in an unverified header for now.
def verify_jwt(token):
    try:
        header_data = jwt.get_unverified_header(token)
        jwt.decode(token, key=settings.TOKEN_SECRET, algorithms=header_data['alg'])
    except ExpiredSignatureError as e:
        print("Error:\n"+str(e))
        return {"result": "Cannot decode token. Something is wrong with the auth token itself."}
    return {"result": "Token established."}