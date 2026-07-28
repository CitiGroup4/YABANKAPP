from repositories import transaction_repository
from services import account_service
from datetime import datetime
from decimal import Decimal

def find_transactions(account_id: int):
    # We should have an account ID by now. Use that, ask R/W layer to find latest transactions for this user.
    transactions = transaction_repository.get_all_transactions()

    # List comprehension to get ALL transactions that match this ID.
    found_transactions = [x for x in transactions if x['account_id'] == str(account_id)]

    return found_transactions


def create_transaction(user_id, transaction_amount: Decimal):
    user_data = account_service.find_account_from_id(user_id)
    transactions = transaction_repository.get_all_transactions()

    # Generate new account ID
    ids = [
        int(a["txn_id"])
        for a in transactions
        if a["txn_id"]
    ]


    if ids:
        new_id = max(ids) + 1
    else:
        new_id = 101


    # Generate creation date
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    new_transaction_data = {
        "txn_id": new_id,
        "account_id": user_data["account_id"],
        "txn_type": user_data["account_type"],
        "amount": transaction_amount,
        "created_at": created_date
    }
    print(f"\nTransaction record created with ID: {new_id}")

    transaction_repository.update_transaction_record(new_transaction_data)