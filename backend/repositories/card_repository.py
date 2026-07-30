from backend.database.mongodb import get_database

db = get_database()
cards_collection = db["cards"]

def add_card_to_db(card):
    result = cards_collection.insert_one(card)
    card["_id"] = result.inserted_id
    print(f"Card created with ID: {card['_id']}")
    return card['_id']



def find_cards_by_account(account_id: int):
    return cards_collection.find({"account_id": account_id})


def get_all_cards_for_user():
    collection_retrieved = cards_collection
    cursor_obj = collection_retrieved.find({})

    document_list = []
    for document in cursor_obj:
        document_list.append(document)
    return document_list