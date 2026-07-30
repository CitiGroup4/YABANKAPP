# import pydantic
from typing import Optional
from pydantic import BaseModel, Field
# import datetime
from datetime import date, datetime, timedelta
from decimal import Decimal
from backend.repositories.account_repository import get_next_account_id
from backend.core.config import settings

"""
user_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
"""
class Users(BaseModel):
    #user id auto generated
    name: str = Field(max_length=100)
    email: str = Field(max_length=100)
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    token: str

"""
CREATE TABLE accounts (
account_id INT PRIMARY KEY AUTO_INCREMENT,  user_id INT,
balance DECIMAL(10,2) DEFAULT 0,
account_type VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  FOREIGN KEY (user_id) REFERENCES users(user_id) ); 
"""
class Accounts(BaseModel):
    user_id: int
    balance: Decimal = Field(default=0) # should be decimal, fix this for precision
    account_type: str = Field(max_length=50)
    created_at: Optional[date] = Field(default_factory=date.today) # Datetime type

"""
CREATE TABLE transactions (
txn_id INT PRIMARY KEY AUTO_INCREMENT,
account_id INT,
txn_type VARCHAR(20),
amount DECIMAL(10,2),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  FOREIGN KEY (account_id) REFERENCES accounts(account_id) ); 
"""
class Transactions(BaseModel):
    txn_id: int
    account_id: int
    txn_type: str = Field(max_length=20)
    amount: Decimal # should be decimal, fix this for precision
    created_at: Optional[date] = Field(default_factory=date.today) # Datetime type

"""
EXTRA BODY MODELS FOR API CALLS HERE
"""
# For withdrawal and deposits, use this model.
# BOTH FIELDS ARE REQUIRED.
class AccountMoneyRequest(BaseModel):
    amount: Decimal
    note: Optional[str]  # Optional note field for additional information

"""
Loan Model
"""
class Loans(BaseModel):
    account_id: int
    loan_amount: Decimal
    interest_rate: Decimal
    amount_left: Decimal = Field(default=0)
    collateral: Optional[str] = None
    time_period: int
    status: str = Field(max_length=20, default="active")

"""
CARDS MODEL
"""
class Cards(BaseModel):
    id: Optional[date] = Field(default_factory=date.today) # Datetime type
    account_id: int
    cardHolder: str
    cardNumber: int # PASSED IN FROM FRONTEND
    expiry: Optional[date] = Field(default_factory=
                                            (datetime.now() + timedelta(minutes=int(settings.EXPIRATION_TIME))).date
                                            ) # Datetime type
    type: str
    variant: str
    bgGradient: str
    status: str
    spendingLimit: Decimal
    pass

class CardQuery(BaseModel):
    account_id: int
    cardHolder: str
    cardNumber: int