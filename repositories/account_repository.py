import csv

ACCOUNTS_FILE_PATH = "database/accounts.csv"
USERS_FILE_PATH = "database/users.csv"

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

def update_account_balance(account_id, new_amount):
    rows = []

    # First, update the account-side.
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
    
    
    
