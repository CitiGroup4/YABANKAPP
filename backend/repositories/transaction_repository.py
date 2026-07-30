import csv
from database.mongodb import get_database
from bson.decimal128 import Decimal128
from fastapi import HTTPException

ACCOUNTS_FILE_PATH = "database/accounts.csv"
TRANSACTIONS_FILE_PATH = "database/transactions.csv"

db = get_database()
transactions_collection = db["transactions"]

def get_all_transactions():
    collection_retrieved = transactions_collection
    cursor_obj = collection_retrieved.find({})

    document_list = []
    for document in cursor_obj:
        document_list.append(document)
    return document_list


def update_transaction_record(new_transaction_record):
    try:
        result = transactions_collection.insert_one(new_transaction_record)
    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to add transaction record: {e}"
        )

    return new_transaction_record
