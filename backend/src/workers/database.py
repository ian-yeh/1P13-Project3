# creating database here

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from fastapi import FastAPI

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

class DatabaseWorker:
    def __init__(self):
        self.db = db

    def write_event(self, name, date, location):
        new_event = self.db.collection("events").document()
        new_event.set({
            "name": name,
            "date": date,
            "location": location
        })