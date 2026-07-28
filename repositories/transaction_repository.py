import csv

TRANSACTIONS_FILE_PATH = "database/transactions.csv"

def get_all_transactions():

    transactions = []

    with open(TRANSACTIONS_FILE_PATH, "r") as file:

        reader = csv.DictReader(file)

        for row in reader:
            transactions.append(row)

    return transactions