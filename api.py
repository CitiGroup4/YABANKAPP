import uvicorn
from fastapi import FastAPI, HTTPException
import csv
from datetime import datetime
import copy


from services import account_service, transaction_service, user_service
from models import models
from decimal import Decimal

from database.mongodb import client, close_database

# EXAMPLE OF IN-MEMORY STORAGE FOR TOKEN.
TOKEN_STO = []

app = FastAPI(
    title="YA Bank API",
    description="""
    REST API for the YA Bank application.

    Features:
    - Create Accounts
    - Retrieve Account Details
    - Deposit Funds
    - Withdraw Funds
    - View Transaction History
    """,
    version="1.0.0"
)

@app.on_event("startup")
def startup():
    try:
        client.admin.command("ping")
        print("MongoDB connected")
    except Exception as e:
        print(e)

@app.on_event("shutdown")
def shutdown_event():
    close_database()


@app.get("/")
def read_root():
    return {"message": "Bank API Running"}

@app.post("/api/register")
def register(user: models.Users):
    # call register function here
    print("calling register endpoint: ", user)

    new_user_id = user_service.register_user(user)

    return {
        "message": "User registered successfully",
        "user_id": new_user_id
    }


@app.post("/api/login")
def login(user: models.LoginRequest):

    logged_in_user = user_service.login_user(user)

    # JWT token generator here.
    new_token = user_service.generate_jwt(logged_in_user)
    TOKEN_STO.append(new_token)

    return {
        "message": "Login successful",
        "user_id": logged_in_user["user_id"],
        "name": logged_in_user["name"],
        "email": logged_in_user["email"],
        "new_token": new_token
    }

# Test function for in-memory storage example
@app.post("/api/tokentest")
def test_token(token: models.Token):
    # Test the token and verify
    try:
        if token.token in TOKEN_STO:
            user_service.verify_jwt(token.token)
        else:
            raise Exception("Token not detected in the in-mem storage!")
        return {"message": "success"}
    except Exception as e:
        return {"message": e}

@app.post("/api/accounts")
def create_account(account: models.Accounts):
    # call account creation function here
    print("calling create account service")
    account_id = account_service.create_account(account)
    return {
        "message": "Account created",
        "account_id": str(account_id)
    }




@app.get("/api/accounts/{account_id}")
def get_account(account_id: int):
    found_account = account_service.get_account_serialized(account_id)

    if not found_account:
        raise HTTPException(
            status_code=404,
            detail=f"Account with ID {account_id} was not found"
        )

    return found_account



@app.post("/api/accounts/{id}/deposit")
def deposit_money(id: int, account_request: models.AccountMoneyRequest):

    # call deposit function here
    success = account_service.update_balance(account_id=id, amount=account_request.amount, deposit=True)

    # MongoDB call to create a record of this.
    transaction_service.create_transaction(id, account_request.amount)

    if success == 0:
        return {
            "account_id": id,
            "message": "Account not found"
        }

    return {
        "account_id": id,
        "message": "Deposit successful"
    }



# /api/accounts/1/withdraw
@app.post("/api/accounts/{id}/withdraw")
def withdraw_money(id: int, account_request: models.AccountMoneyRequest):
    print(id)
    print(account_request)
    # call withdraw function here
    success = account_service.update_balance(account_id=id, amount=account_request.amount, deposit=False)

    # MongoDB call to create a record of this.
    transaction_service.create_transaction(id, -account_request.amount)

    # NOTE: amount is negative here.
    if success == -1:
        return {
            "account_id": id,
            "message": "Insufficient funds for withdrawal"
        }
    elif success == 0:
        return {
            "account_id": id,
            "message": "Account not found"
        }

    return {
        "account_id": id,
        "message": "Withdrawal successful"
    }


@app.post("/api/accounts/transfer")
def transfer_funds(sender_id: int, receiver_id: int, amount: Decimal):
    # call transfer function here
    account_service.transfer_funds(sender_id=sender_id, receiver_id=receiver_id, amount=amount)
    
    # TODO: implement mongodb itegration for transaction collection
    return {
        "sender_account_id": sender_id,
        "receiver_account_id": receiver_id, 
        "message": "Transfer successful"
    }

# ---------------------------------------------------------
# Transaction History Endpoint
# ---------------------------------------------------------
#
# Returns all transactions associated with an account.
#
# HTTP Method:
# GET
#
# URL Example:
# /api/accounts/1/transactions
#
# Request Flow:
#
# 1. Client provides account ID.
# 2. API calls transaction_service.find_transactions().
# 3. Service retrieves transactions.
# 4. API returns transaction history.
#
# Example response:
#
# {
#     "account_id": 1,
#     "transactions": [
#         {
#             "type": "deposit",
#             "amount": 500
#         }
#     ]
# }
#
@app.get("/api/accounts/{id}/transactions")
def get_transactions(id: int):
    # call transaction history function here

    # Get the account, then find transactions associated with this account.
    # found_account = account_service.find_account_from_id(id)

    # Then, pass in the collection name and then the data you want to transfer
    transaction_list = transaction_service.find_transactions(id)

    return {
        "account_id": id
        #"transactions": transaction_list
    }

#Use 8000/docs to view the API documentation.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
