from fastapi import FastAPI


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
