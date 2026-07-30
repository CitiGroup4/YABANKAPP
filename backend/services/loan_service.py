from repositories import loan_repository
from datetime import datetime
from decimal import Decimal
from bson.decimal128 import Decimal128

def pay_amount(loan_amount: Decimal, interest_rate: Decimal, time_period: int) -> Decimal:
    """
    Calculate the total amount to be paid for a loan based on the loan amount, interest rate, and time period.

    :param loan_amount: The principal amount of the loan.
    :param interest_rate: The annual interest rate (as a percentage).
    :param time_period: The time period of the loan in years.
    :return: The total amount to be paid (principal + interest).
    """
    r = interest_rate / 100 / 12
    n = time_period
    pay = loan_amount * (r * (1 + r)**n) / ((1 + r)**n - 1) + loan_amount

    return pay.quantize(Decimal('0.01'))  # Round to 2 decimal places
def create_loan(loan):
    # Generate creation date
    created_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )
    new_id = loan_repository.get_next_loan_id()
    loan_data = {
        "loan_id": new_id,
        "account_id": loan.account_id,
        "loan_amount": Decimal128(loan.loan_amount),
        "interest_rate": Decimal128(loan.interest_rate),
        "amount_left":Decimal128(str( pay_amount(loan.loan_amount, loan.interest_rate, loan.time_period))),
        "collateral": loan.collateral,
        "time_period": loan.time_period,
        "status": loan.status,
        "created_at": created_date
    }

    return loan_repository.create_new_loan(loan_data)

def get_loan(loan_id, account_id):
    loan = loan_repository.find_loan_by_id(loan_id, account_id)
    return loan

def get_active_loans(account_id):
    active_loans = loan_repository.find_active_loans(account_id)
    return active_loans

def get_closed_loans(account_id):   
    closed_loans = loan_repository.find_closed_loans(account_id)
    return closed_loans

def repay_loan(loan_id, account_id, amount):
    payment_result = loan_repository.repay_loan(loan_id, account_id, amount)
    return payment_result


