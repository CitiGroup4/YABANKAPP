from repositories import account_repository
from datetime import datetime


def create_account(account):

    accounts = account_repository.get_all_accounts()


    # Generate new account ID
    ids = [
        int(a["account_id"])
        for a in accounts
        if a["account_id"]
    ]


    if ids:
        new_id = max(ids) + 1
    else:
        new_id = 101


    # Generate creation date
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    account_data = {
        "account_id": new_id,
        "user_id": account.user_id,
        "balance": account.balance,
        "account_type": account.account_type,
        "created_at": created_date
    }
    print(f"\nAccount created with ID: {new_id}")

    return account_repository.save_account(account_data)


# Find an account based on ID.
# Possible refactor: find account based on dict key and value.
def find_account_from_id(id):
    accounts = account_repository.get_all_accounts()

    # Find first instance of this account id in the list using comprehension
    found_account = next((x for x in accounts if x['account_id'] == str(id)), None)

    if not found_account:
        return None

    return found_account

# Find an account based on ID.
# Possible refactor: find account based on dict key and value.
def find_account(account_id: int):
    account = account_repository.get_account_by_id(account_id)

    if account is None:
        return None

    user = account_repository.get_user_by_id(
        int(account["user_id"])
    )

    return {
        "accountId": int(account["account_id"]),
        "userName": user["name"] if user else None,
        "balance": float(account["balance"])
    }

def find_transactions(account_id: int):
    # We should have an account ID by now. Use that, ask R/W layer to find latest transactions for this user.
    transactions = account_repository.get_all_transactions()

    # List comprehension to get ALL transactions that match this ID.
    found_transactions = [x for x in transactions if x['account_id'] == str(account_id)]

    return found_transactions
