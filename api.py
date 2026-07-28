import uvicorn
from fastapi import FastAPI, HTTPException
import csv
from datetime import datetime
from services import account_service
from models import models


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Bank API Running"}

# Create Account
@app.post("/api/accounts")
def create_account(account: models.Accounts):
    # call account creation function here
    print("calling create account service")
    new_account = account_service.create_account(account)
    return {
        "message": "Account created",
        "account": new_account
    }

# Get Account Details
@app.get("/api/accounts/{account_id}")
def get_account(account_id: int):
    found_account = account_service.find_account(account_id)

    if found_account is None:
        raise HTTPException(
            status_code=404,
            detail=f"Account with ID {account_id} was not found"
        )

    return found_account


# Deposit Money
@app.post("/api/accounts/{id}/deposit")
def deposit_money(id: int):
    # call deposit function here
    return {
        "account_id": id,
        "message": "Deposit successful"
    }


# Withdraw Money
@app.post("/api/accounts/{id}/withdraw")
def withdraw_money(id: int):
    # call withdraw function here
    return {
        "account_id": id,
        "message": "Withdrawal successful"
    }


# Transaction History
@app.get("/api/accounts/{id}/transactions")
def get_transactions(id: int):
    # call transaction history function here
    return {
        "account_id": id,
        "transactions": []
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
