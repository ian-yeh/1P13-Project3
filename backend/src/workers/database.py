import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from fastapi import FastAPI

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# access point to firestore database
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
        pass

    def write_user(self):
        pass

    def update_user(self, user_id, name=None, passenger_number=None, mobility_details=None):
        print(f"Updating user {user_id} with name: {name}, passenger_number: {passenger_number}, mobility_details: {mobility_details}")
        user_ref = self.db.collection("users").document(user_id)
        user_ref.update({
            "name": name,
            "passenger_number": passenger_number,
            "mobility_details": mobility_details
        })

    def get_user(self, user_id):
        user_ref = self.db.collection("users").document(user_id)
        user_doc = user_ref.get()
        if user_doc.exists:
            return user_doc.to_dict()
        else:
            return None