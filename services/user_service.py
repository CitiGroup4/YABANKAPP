from repositories import user_repository
from datetime import datetime

def register_user(user):
    # Implementation for registering a new user
    new_user_id = user_repository.get_next_user_id()
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    user_data = {
        "user_id": new_user_id,
        "name": user.name,
        "email": user.email,
        "created_at": created_date
    }


    #Send the new user to the database
    user_repository.create_user(user_data)

    print("Registering new user: ", new_user_id)
    return new_user_id