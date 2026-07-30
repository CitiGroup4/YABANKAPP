from backend.database.mongodb import get_database

db = get_database()
cards_collection = db["cards"]

def find_cards_by_user(user_id: int):
    return cards_collection.find({"user_id": user_id})


def get_all_cards_for_user():
    collection_retrieved = cards_collection
    cursor_obj = collection_retrieved.find({})

    document_list = []
    for document in cursor_obj:
        document_list.append(document)
    return document_list