import uvicorn
from fastapi import FastAPI, HTTPException
import csv
from datetime import datetime
import copy

from ex.mongoEX import MongoDBObject
from services import account_service, transaction_service
from models import models
from decimal import Decimal




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

# Connect to instance on launch.
MongoDB = MongoDBObject()

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
    new_account = account_service.create_account(account)

    # CREATE A DEEP COPY FIRST BEFORE CALLING, as "insert_one" changes new_account.
    return_account_data = copy.deepcopy(new_account)

    # Then, pass in the collection name and then the data you want to transfer
    MongoDB.write_to_collection("accounts", new_account)

    return {
        "message": "Account created",
        "account": return_account_data
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
def deposit_money(account_request: models.AccountMoneyRequest):
    # call deposit function here
    success = account_service.update_balance(account_id=account_request.account_id, amount=account_request.amount, deposit=True)
    transaction_service.create_transaction(account_request.account_id, account_request.amount)
    if success == 0:
        return {
            "account_id": account_request.account_id,
            "message": "Account not found"
        }
    return {
        "account_id": account_request.account_id,
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
def withdraw_money(account_request: models.AccountMoneyRequest):
    # call withdraw function here
    success = account_service.update_balance(account_id=account_request.account_id, amount=account_request.amount, deposit=False)

    # NOTE: amount is negative here.
    transaction_service.create_transaction(account_request.account_id, Decimal(-account_request.amount))
    if success == -1:
        return {
            "account_id": account_request.account_id,
            "message": "Insufficient funds for withdrawal"
        }
    elif success == 0:
        return {
            "account_id": account_request.account_id,
            "message": "Account not found"
        }
    return {
        "account_id": account_request.account_id,
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
    transaction_list = transaction_service.find_transactions(id)

    return {
        "account_id": id,
        "transactions": transaction_list
    }
#Use 8000/docs to view the API documentation.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
