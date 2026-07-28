import csv


ACCOUNTS_FILE_PATH = "database/accounts.csv"
USERS_FILE_PATH = "database/users.csv"
TRANSACTIONS_FILE_PATH = "database/transactions.csv"



def get_all_accounts():

    accounts = []

    with open(ACCOUNTS_FILE_PATH, "r") as file:

        reader = csv.DictReader(file)

        for row in reader:
            accounts.append(row)

    return accounts



def save_account(account):

    with open(ACCOUNTS_FILE_PATH, "a", newline="") as file:

        writer = csv.DictWriter(
            file,
            fieldnames=[
                "account_id",
                "user_id",
                "balance",
                "account_type",
                "created_at"
            ]
        )

        writer.writerow(account)


    return account


def get_all_transactions():

    transactions = []

    with open(TRANSACTIONS_FILE_PATH, "r") as file:

        reader = csv.DictReader(file)

        for row in reader:
            transactions.append(row)

    return transactions