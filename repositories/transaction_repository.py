import csv

ACCOUNTS_FILE_PATH = "database/accounts.csv"
TRANSACTIONS_FILE_PATH = "database/transactions.csv"

def get_all_transactions():

    transactions = []

    with open(TRANSACTIONS_FILE_PATH, "r") as file:

        reader = csv.DictReader(file)

        for row in reader:
            transactions.append(row)

    return transactions

def update_transaction_record(new_transaction_record):
    # Then, update transaction table with new entry.
    with open(TRANSACTIONS_FILE_PATH, "a", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "txn_id",
                "account_id",
                "txn_type",
                "amount",
                "created_at"
            ]
        )

        writer.writerow(new_transaction_record)

    return new_transaction_record