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

