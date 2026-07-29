from database.mongodb import get_database
from bson import ObjectId
from bson.decimal128 import Decimal128
from fastapi import HTTPException


ACCOUNTS_FILE_PATH = "database/accounts.csv"
USERS_FILE_PATH = "database/users.csv"


db = get_database()
account_collection = db["accounts"]




def find_account_by_id(account_id: int):

    account = account_collection.find_one(
        {
            "account_id": account_id
        }
    )
    if account is None:
        raise HTTPException(
            status_code=404,
            detail=f"Account with ID {account_id} was not found"
        )
    return account

def get_all_accounts():
    accounts = list(account_collection.find({}))

    for account in accounts:
        account["_id"] = str(account["_id"])

        if isinstance(account["balance"], Decimal128):
            account["balance"] = str(account["balance"].to_decimal())

    return accounts

def get_next_account_id():
    try:
        account = account_collection.find_one(
            sort=[("account_id", -1)]
        )

        if account is None:
            return 101 # when accounts collection is empty return 101 (min for account id)

        return account["account_id"] + 1

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to determine the next account ID."
        )


def save_account(account):
    result = account_collection.insert_one(account)
    account["_id"] = result.inserted_id
    print(f"Account created with ID: {account['_id']}")
    return account['_id']


def update_account_balance(account_id, new_amount):
    if new_amount < 0:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient funds in account {account_id}."
        )
    try:
        result = account_collection.update_one(
            {"account_id": account_id},
            {
                "$set": {
                    "balance": Decimal128(str(new_amount))
                }
            }
        )

        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Account {account_id} not found."
            )

        return result.modified_count > 0

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to update account balance: {e}"
        )

