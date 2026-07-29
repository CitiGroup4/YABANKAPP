import uvicorn
from fastapi import FastAPI, HTTPException
import csv
from datetime import datetime
import copy

from services import account_service, transaction_service
from models import models
from decimal import Decimal

from database.mongodb import client, close_database




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

# ---------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------
# Basic health-check endpoint.
#
# Purpose:
# - Verify that the API server is running.
# - Useful when deploying the application.
#
# HTTP Method:
# GET
#
# URL:
# /
#
# Example response:
# {
#     "message": "Bank API Running"
# }
@app.get("/")
def read_root():
    return {"message": "Bank API Running"}


# ---------------------------------------------------------
# Create Account Endpoint
# ---------------------------------------------------------
#
# Creates a new bank account.
#
# HTTP Method:
# POST
#
# URL:
# /api/accounts
#
# Request Flow:
#
# 1. Client sends account information.
# 2. FastAPI validates the request using models.Accounts.
# 3. Endpoint calls account_service.create_account().
# 4. Service handles account creation logic.
# 5. Created account is returned to the client.
#
# Example request body:
#
# {
#     "user_id": 1,
#     "balance": 500,
#     "account_type": "Checking"
# }
#
@app.post("/api/accounts")
def create_account(account: models.Accounts):
    # call account creation function here
    print("calling create account service")
    account_id = account_service.create_account(account)
    return {
        "message": "Account created",
        "account_id": str(account_id)
    }



# ---------------------------------------------------------
# Get Account Details Endpoint
# ---------------------------------------------------------
#
# Retrieves an account using its account ID.
#
# HTTP Method:
# GET
#
# URL Example:
# /api/accounts/1
#
# Request Flow:
#
# 1. Client sends account ID in URL.
# 2. API calls account_service.find_account_from_id().
# 3. Service searches for the account.
# 4. API returns account information.
#
@app.get("/api/accounts/{account_id}")
def get_account(account_id: int):
    found_account = account_service.find_account_from_id(account_id)

    if found_account is None:
        raise HTTPException(
            status_code=404,
            detail=f"Account with ID {account_id} was not found"
        )

    return found_account


# ---------------------------------------------------------
# Deposit Money Endpoint
# ---------------------------------------------------------
#
# Adds money to an existing account.
#
# HTTP Method:
# POST
#
# URL Example:
# /api/accounts/1/deposit
#
@app.post("/api/accounts/{id}/deposit")
def deposit_money(id: int, account_request: models.AccountMoneyRequest):

    # call deposit function here
    success = account_service.update_balance(account_id=id, amount=account_request.amount, deposit=True)

    if success == 0:
        return {
            "account_id": id,
            "message": "Account not found"
        }
    #TODO: implement mongodb itegration for transaction collection
    #transaction_service.create_transaction(id, account_request.amount)

    return {
        "account_id": id,
        "message": "Deposit successful"
    }


# ---------------------------------------------------------
# Withdraw Money Endpoint
# ---------------------------------------------------------

# Removes money from an existing account.

# HTTP Method:
# POST

# URL Example:
# /api/accounts/1/withdraw
@app.post("/api/accounts/{id}/withdraw")
def withdraw_money(id: int, account_request: models.AccountMoneyRequest):
    print(id)
    print(account_request)
    # call withdraw function here
    success = account_service.update_balance(account_id=id, amount=account_request.amount, deposit=False)

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
    #TODO: implement mongodb itegration for transaction collection
    #transaction_service.create_transaction(id, Decimal(-account_request.amount))
    return {
        "account_id": id,
        "message": "Withdrawal successful"
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
    transaction_list = MongoDB.read_all_from_collection("transactions")

    # transaction_list = transaction_service.find_transactions(id)

    return {
        "account_id": id,
        "transactions": transaction_list
    }
#Use 8000/docs to view the API documentation.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
