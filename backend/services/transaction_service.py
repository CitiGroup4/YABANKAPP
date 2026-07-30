from typing import Optional
from repositories import transaction_repository
from services import account_service
from datetime import datetime
from decimal import Decimal
from bson.decimal128 import Decimal128
from utils.backend_utils import clean_transaction_records

def find_transactions(account_id: int):
    # We should have an account ID by now. Use that, ask R/W layer to find latest transactions for this user.
    transactions = transaction_repository.get_all_transactions()

    # List comprehension to get ALL transactions that match this ID.
    found_transactions = [x for x in transactions if x['account_id'] == account_id]

    # Clean the records before returning (removing MongoDB specific information, other fields that need to be serialized).
    cleaned_transaction_list = clean_transaction_records(found_transactions)

    return cleaned_transaction_list


def create_transaction(user_id, transaction_amount: Decimal, transaction_type: str):
    user_data = account_service.get_account(user_id)

    # Generate creation date
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    new_transaction_data = {
        "txn_id": user_id,
        "account_id": user_data["account_id"],
        "txn_type": transaction_type,
        "amount": Decimal128(transaction_amount),
        "created_at": created_date
    }
    print(f"\nTransaction record created with ID: {user_id}")

    transaction_repository.update_transaction_record(new_transaction_data)

def find_user_transactions(user_id: int):
    accounts = account_service.get_accounts_by_user(user_id)
    if not accounts:
        return []

    # Extract all account IDs owned by this user
    user_account_ids = {account["account_id"] for account in accounts}

    all_raw_transactions = transaction_repository.get_all_transactions()

    user_transactions = [
        txn for txn in all_raw_transactions 
        if txn.get("account_id") in user_account_ids
    ]

    # 4. Use your existing utility to convert Decimal128 -> Decimal and strip _id
    cleaned_transactions = clean_transaction_records(user_transactions)

    return cleaned_transactions