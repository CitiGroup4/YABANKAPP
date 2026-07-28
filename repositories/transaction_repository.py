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


def update_transaction(account_id, new_amount):
    rows = []

    with open(ACCOUNTS_FILE_PATH, "r", newline="") as file:
        reader = csv.DictReader(file)
        fieldnames = reader.fieldnames

        for row in reader:
            # As long as account_id is unique, this is fine.
            if row["account_id"] == str(account_id):
                row["balance"] = str(new_amount)

            # Every row is appended and the whole file is rewritten.
            rows.append(row)

    with open(ACCOUNTS_FILE_PATH, "w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return True