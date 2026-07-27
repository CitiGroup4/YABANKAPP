from decimal import Decimal

from fastapi import FastAPI
from pydantic import BaseModel
import datetime

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/users/register")
def register_user():

    pass

@app.get("/users/view")
def view_user():
    pass
