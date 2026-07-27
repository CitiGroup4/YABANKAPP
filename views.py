from pydantic import BaseModel
import csv
from pathlib import Path

# Handles creating the account from the pydantic impl and adds to csv file
def account_to_csv(request_body):
    with open(Path("database", "users.csv"), newline='') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        for row in csvreader:
            print(', '.join(row))
    pass