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

    def update_event(self, event_id, name=None, date=None, location=None):
        event_ref = self.db.collection("events").document(event_id)
        update_data = {}
        if name:
            update_data["name"] = name
        if date:
            update_data["date"] = date
        if location:
            update_data["location"] = location
        event_ref.update(update_data)

    def write_user(self, name, passenger_number, mobility_details):
        new_user = self.db.collection("users").document()
        new_user.set({
            "name": name,
            "passenger_number": passenger_number,
            "mobility_details": mobility_details
        })

    def update_user(self, user_id, name=None, passenger_number=None, mobility_details=None):
        user_ref = self.db.collection("users").document(user_id)

        # if the user doesn't exist, create a new one
        if not user_ref.get().exists:
            self.write_user(name or "Unknown", passenger_number or 0, mobility_details or "None")

        update_data = {}
        if name:
            update_data["name"] = name
        if passenger_number:
            update_data["passenger_number"] = passenger_number
        if mobility_details:
            update_data["mobility_details"] = mobility_details

        user_ref.update(update_data)