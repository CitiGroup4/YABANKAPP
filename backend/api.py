
from bson import Decimal128
import uvicorn
from fastapi import FastAPI, HTTPException
import csv
from datetime import datetime
import copy
from services import user_service, account_service, transaction_service, loan_service 
from models import models
from decimal import Decimal

from database.mongodb import client, close_database

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="YA Bank API",
    description="REST API for YA Bank",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173" # change to frontend deployed site
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.post("/register")
def register(user: models.Users):
    # call register function here
    print("calling register endpoint: ", user)

    new_user_id = user_service.register_user(user)

    return {
        "message": "User registered successfully",
        "user_id": new_user_id
    }


@app.post("/login")
def login(user: models.LoginRequest):

    logged_in_user = user_service.login_user(user)

    return {
        "message": "Login successful",
        "user_id": logged_in_user["user_id"],
        "name": logged_in_user["name"],
        "email": logged_in_user["email"]
    }

@app.post("/api/accounts")
def create_account(account: models.Accounts):
    # call account creation function here
    print("calling create account service")
    account_id = account_service.create_account(account)
    return {
        "message": "Account created",
        "account_id": str(account_id)
    }


#get accounts by user
@app.get("/api/users/{user_id}/accounts")
def get_accounts_by_user(user_id: int):
    accounts = account_service.get_accounts_by_user(user_id)
    return accounts

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
    transaction_service.create_transaction(id, account_request.amount, "Deposit")


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
    transaction_service.create_transaction(id, -account_request.amount, "Withdraw")


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

    transaction_service.create_transaction(sender_id, -amount, "Transfer to " + str(receiver_id)
    transaction_service.create_transaction(receiver_id, amount, "Transfer from account " +  str(sender_id))

    return {
        "sender_account_id": sender_id,
        "receiver_account_id": receiver_id, 
        "message": "Transfer successful"
    }

@app.delete("/api/accounts/{account_id}")
def close_account(account_id:int):
    account_service.close_account(account_id)
    return {
        "account_id": account_id,
        "message": "Account closed successfully"
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
        "account_id": id,
        "transactions": transaction_list
    }



### API Endpoints for Loans
@app.post("/api/loans")
def create_loan(loan: models.Loans):
    # call loan creation function here

    print("calling create loan service")
    loan_id = loan_service.create_loan(loan)
    return {
        "message": "Loan created successfully for account ID: " + str(loan.account_id),
        "loan_id": str(loan_id)
    }

@app.get("/api/loans/{loan_id}")
def get_loan_by_id(loan_id: int, account_id: int):
    found_loan = loan_service.get_loan(loan_id, account_id)  # Assuming account_id is not required for this endpoint
    return found_loan

@app.get("/api/accounts/{account_id}/loans/active")
def get_active_loans(account_id: int):
    active_loans = loan_service.get_active_loans(account_id)
    return {
        "account_id": account_id,
        "active_loans": active_loans
    }

@app.get("/api/accounts/{account_id}/loans/closed")
def get_closed_loans(account_id: int):
    closed_loans = loan_service.get_closed_loans(account_id)
    return {
        "account_id": account_id,
        "closed_loans": closed_loans
    }

@app.post("/api/accounts/{account_id}/loans/{loan_id}/repay")
def repay_loan(account_id: int, loan_id: int, amount: Decimal):
    loan_service.repay_loan(loan_id, account_id, amount)
    account_service.pay_loan(account_id, amount)
    transaction_service.create_transaction(account_id, -amount, note=f"Loan repayment for loan ID {loan_id}")

    return {
        "account_id": account_id,
        "loan_id": loan_id,
        "message": "Loan repayment successful"
    }

@app.get("/api/users/{user_id}/transactions")
def get_transaction_history(user_id: int):
    # call transaction history function here
    transaction_list = transaction_service.find_user_transactions(user_id)

    return transaction_list

#Use 8000/docs to view the API documentation.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
