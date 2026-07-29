from repositories import user_repository
from datetime import datetime
from security.password import hash_password, verify_password
from fastapi import HTTPException

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