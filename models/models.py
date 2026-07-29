# import pydantic
from typing import Optional
from pydantic import BaseModel, Field
import datetime
from decimal import Decimal
from repositories.account_repository import get_next_account_id

"""
user_id INT PRIMARY KEY AUTO_INCREMENT, 
name VARCHAR(100), 
email VARCHAR(100) UNIQUE, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
"""
class Users(BaseModel):
    user_id: int = Field(default_factory=()) # Autoincrement.
    name: str = Field(max_length=100)
    email: str = Field(max_length=100)
    created_at: Optional[datetime.date] = Field(default_factory=datetime.date.today) # Datetime type
    pass

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
    created_at: Optional[datetime.date] = Field(default_factory=datetime.date.today) # Datetime type
    pass

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
    created_at: Optional[datetime.date] = Field(default_factory=datetime.date.today) # Datetime type
    pass



"""
EXTRA BODY MODELS FOR API CALLS HERE
"""

# For withdrawal and deposits, use this model.
# BOTH FIELDS ARE REQUIRED.
class AccountMoneyRequest(BaseModel):
    amount: Decimal
    pass