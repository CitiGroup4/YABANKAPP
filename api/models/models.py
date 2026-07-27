# import pydantic
from pydantic import BaseModel
import datetime
from decimal import Decimal

"""
user_id INT PRIMARY KEY AUTO_INCREMENT, 
name VARCHAR(100), 
email VARCHAR(100) UNIQUE, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
"""
class Users(BaseModel):
    user_id: int
    name: str
    email: str
    created_at: datetime.datetime # Datetime type
    pass

"""
CREATE TABLE accounts ( 
 account_id INT PRIMARY KEY AUTO_INCREMENT,  user_id INT, 
 balance DECIMAL(10,2) DEFAULT 0, 
 account_type VARCHAR(50), 
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  FOREIGN KEY (user_id) REFERENCES users(user_id) ); 
"""
class Accounts(BaseModel):
    account_id: int
    balance: Decimal # should be decimal, fix this for precision
    account_type: str
    created_at: datetime.datetime # Datetime type
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
    txn_type: str
    amount: Decimal # should be decimal, fix this for precision
    created_at: datetime.datetime # Datetime type
    pass