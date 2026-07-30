from backend.database.mongodb import get_database
from bson import ObjectId
from decimal import Decimal
from bson.decimal128 import Decimal128
from fastapi import HTTPException

db = get_database()
loan_collection = db["loans"]

def find_all_loans(account_id:int):
    all_loans = list(loan_collection.find({"account_id": account_id}))
    if not all_loans:
        raise HTTPException(
            status_code=404,
            detail=f"No loans found for account ID {account_id}"
        )
    for loan in all_loans:
        if isinstance(loan["loan_amount"], Decimal128):
            loan["loan_amount"] = loan["loan_amount"].to_decimal()
        if isinstance(loan["interest_rate"], Decimal128):
            loan["interest_rate"] = loan["interest_rate"].to_decimal()
        if isinstance(loan["amount_left"], Decimal128):
            loan["amount_left"] = loan["amount_left"].to_decimal()
    return all_loans

def find_loan_by_id(loan_id:int, account_id:int):
    loan = loan_collection.find_one({"loan_id": loan_id, "account_id": account_id})
    if loan is None:
        raise HTTPException(
            status_code=404,
            detail=f"Loan with ID {loan_id} was not found"
        )
    loan.pop("_id")
    if isinstance(loan["loan_amount"], Decimal128):
        loan["loan_amount"] = loan["loan_amount"].to_decimal()
    if isinstance(loan["interest_rate"], Decimal128):
        loan["interest_rate"] = loan["interest_rate"].to_decimal()
    if isinstance(loan["amount_left"], Decimal128):
        loan["amount_left"] = loan["amount_left"].to_decimal()
    return loan

def find_active_loans(account_id:int):
    active_loans = list(loan_collection.find({"account_id": account_id, "status": "active"}))
    for loan in active_loans:
        loan.pop("_id")
        if isinstance(loan["amount_left"], Decimal128):
            loan["amount_left"] = loan["amount_left"].to_decimal()
        if isinstance(loan["loan_amount"], Decimal128):
            loan["loan_amount"] = loan["loan_amount"].to_decimal()
        if isinstance(loan["interest_rate"], Decimal128):
            loan["interest_rate"] = loan["interest_rate"].to_decimal()
        
    return active_loans

def find_closed_loans(account_id:int):
    closed_loans = list(loan_collection.find({"account_id": account_id, "status": "closed"}))
    if not closed_loans:
        raise HTTPException(
            status_code=404,
            detail=f"No closed loans found for account ID {account_id}"
        )
    for loan in closed_loans:
        loan.pop("_id")
        if isinstance(loan["amount_left"], Decimal128):
            loan["amount_left"] = loan["amount_left"].to_decimal()
        if isinstance(loan["loan_amount"], Decimal128):
            loan["loan_amount"] = loan["loan_amount"].to_decimal()
        if isinstance(loan["interest_rate"], Decimal128):
            loan["interest_rate"] = loan["interest_rate"].to_decimal()
        
    return closed_loans

def get_next_loan_id():
    try:
        loan = loan_collection.find_one(
            sort=[("loan_id", -1)]
        )

        if loan is None:
            return 101 # when loans collection is empty return 101 (min for loan id)

        return loan["loan_id"] + 1

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to determine the next loan ID."
        )

def repay_loan(loan_id:int, account_id:int, amount:Decimal):
    loan = find_loan_by_id(loan_id, account_id)
    
    current_amount_left = loan["amount_left"]
    print(f"Current amount left for loan ID {loan_id}: {current_amount_left}")
    new_amount_left = current_amount_left - amount

    if new_amount_left < 0:
        raise HTTPException(
            status_code=400,
            detail=f"Payment amount exceeds the remaining loan balance."
        )

    # Update the loan amount left in the repository
    loan_collection.update_one(
        {"loan_id": loan_id},
        {"$set": {"amount_left": Decimal128(new_amount_left)}}
    )

    # If the new amount left is 0, mark the loan as closed
    if new_amount_left == 0:
        loan_collection.update_one(
            {"loan_id": loan_id},
            {"$set": {"status": "closed"}}
        )

def create_new_loan(loan):
    result = loan_collection.insert_one(loan)
    loan["_id"] = result.inserted_id
    print(f"Loan created with ID: {loan['_id']}")
    return loan['_id']