from backend.repositories import card_repository
from backend.models import models
from datetime import datetime, timedelta
from decimal import Decimal
from bson.decimal128 import Decimal128
from backend.utils.backend_utils import clean_card_records

# add cart to mongo db
def add_new_card(card_detail):

    # model_dump auto fills our dict when it matches our model
    card_data = models.Cards.model_dump(card_detail)

    # Modify date fields
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    expiration_date = (datetime.now() + timedelta(hours=8)).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    card_data["id"] = created_date

    card_data["expiry"] = expiration_date

    # Fix decimal
    card_data["spendingLimit"] = Decimal128(card_data["spendingLimit"])

    return card_repository.add_card_to_db(card_data)

def find_cards(account_id):
    card_cursor_resp = card_repository.find_cards_by_account(account_id)

    returned_cards = [card for card in card_cursor_resp]

    clean_card_list = clean_card_records(returned_cards)

    # for card in card_cursor_resp:
    #     returned_cards.append(card)
    return clean_card_list