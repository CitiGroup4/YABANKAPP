import csv


FILE_PATH = "database/accounts.csv"
USERS_FILE_PATH = "database/users.csv"



def get_all_accounts():

    accounts = []

    with open(FILE_PATH, "r") as file:

        reader = csv.DictReader(file)

        for row in reader:
            accounts.append(row)

    return accounts



def save_account(account):

    with open(FILE_PATH, "a", newline="") as file:

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