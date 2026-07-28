from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from pathlib import Path
from environ import ImproperlyConfigured
import environ # For reading environment variables

BANKAPP_DATABASE = "bankapp_database"

class MongoDBObject:
    def __init__(self):
        # Set up .env
        BASE_DIR = Path(__file__).resolve().parent
        env = environ.Env(
            DEBUG=(bool, False)
        )
        environ.Env.read_env(os.path.join(BASE_DIR, 'atlas-credentials.env'))

        # Set this to what the env file is
        uri = env("MONGODB_URI")
        # Create a new client and connect to the server
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        # Send a ping to confirm a successful connection
        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

    # Writes one to the collection
    def write_to_collection(self, collection_name, data):
        collection_retrieved = self.client[BANKAPP_DATABASE][collection_name]
        collection_retrieved.insert_one(data)
        pass

    # Reads ALL options from collection
    def read_all_from_collection(self, collection_name):
        collection_retrieved = self.client[BANKAPP_DATABASE][collection_name]
        cursor_obj = collection_retrieved.find({})

        document_list = []
        for document in cursor_obj:
            document_list.append(document)
        return document_list