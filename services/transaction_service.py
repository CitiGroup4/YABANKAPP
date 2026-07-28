from repositories import transaction_repository

def find_transactions(account_id: int):
    # We should have an account ID by now. Use that, ask R/W layer to find latest transactions for this user.
    transactions = transaction_repository.get_all_transactions()

    # List comprehension to get ALL transactions that match this ID.
    found_transactions = [x for x in transactions if x['account_id'] == str(account_id)]

    return found_transactions