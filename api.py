from fastapi import FastAPI
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
@app.get("/api/accounts/{id}")
def get_account(id: int):
    # call get account function here
    #call a service
    return {
        "account_id": id
    }


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
