from datetime import datetime
from decimal import Decimal
from bson.decimal128 import Decimal128

def clean_transaction_records(records: dict | list):
    # Make sure this is a dict or list, otherwise throw error
    assert(isinstance(records, dict | list))

    # If we have one record, clean and return single.
    if isinstance(records, dict):
        # Remove '_id' section from each (this is MongoDB specific and we don't need it).
        records.pop("_id")

        # Decimal128 does not serialize properly for JSON returns.
        # You MUST run .to_decimal() to convert back to decimal beforehand, otherwise you cannot return this in the response.
        records.update(
            {
                "amount": records.get("amount").to_decimal()
            }
        )
        return records


    # If we have a list of records rather than a single, clean the whole list.
    if isinstance(records, list):
        cleaned_transaction_list = []
        for transaction in records:
            # Remove '_id' section from each (this is MongoDB specific and we don't need it), return in list
            transaction.pop("_id")

            # Decimal128 does not serialize properly for JSON returns.
            # You MUST run .to_decimal() to convert back to decimal beforehand, otherwise you cannot return this in the response.
            transaction.update(
                {
                    "amount": transaction.get("amount").to_decimal()
                }
            )

            cleaned_transaction_list.append(transaction)
        return cleaned_transaction_list

    return None