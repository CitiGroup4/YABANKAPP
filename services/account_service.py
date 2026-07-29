from repositories import account_repository
from datetime import datetime
from decimal import Decimal
from bson.decimal128 import Decimal128


def create_account(account):

    new_id = account_repository.get_next_account_id()

    # Generate creation date
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    account_data = {
        "account_id": new_id,
        "user_id": account.user_id,
        "balance": Decimal128(str(account.balance)),
        "account_type": account.account_type,
        "created_at": created_date
    }

    return account_repository.save_account(account_data)

def get_account(account_id: int):
    return account_repository.find_account_by_id(account_id)


def update_balance(account_id: int, amount: Decimal, deposit: bool = False, withdrawal: bool = False):
    print("Looking for account with ID: ", account_id)
    # Get the account first
    account = get_account(account_id)

    # Get current balance from this account
    current_balance = account["balance"].to_decimal()

    # Deposit adds value, withdrawal subtracts it
    if deposit:
        new_balance = current_balance + amount
    else:
        new_balance = current_balance - amount
        
    # Update the account balance in the repository
    account_repository.update_account_balance(account_id, new_balance)


def transfer_funds(sender_id: int, receiver_id: int, amount: Decimal):

    sender_account = get_account(sender_id)
    receiver_account = get_account(receiver_id)
    
    sender_balance = sender_account["balance"].to_decimal()
    
    print(f"Transferring {amount} from account {sender_id} to account {receiver_id}")
    sender_balance -= amount
    receiver_balance = receiver_account["balance"].to_decimal() + amount
    account_repository.update_account_balance(sender_id, sender_balance)
    account_repository.update_account_balance(receiver_id, receiver_balance)
    