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

    def write_event(self, event_data: dict):
        new_event = self.db.collection("events").document()
        new_event.set(event_data)

    def update_event(self, event_id, name=None, date=None, location=None, arrival_time=None, departure_time=None):
        event_ref = self.db.collection("events").document(event_id)
        event_ref.update({
            "name": name,
            "date": date,
            "location": location,
            "arrival_time": arrival_time,
            "departure_time": departure_time
        })

    def get_events(self, user_id):
        events_ref = self.db.collection("events").where("user_id", "==", user_id)
        events_list = events_ref.get()
        events = []

        for doc in events_list:
            data = doc.to_dict()
            data['id'] = doc.id # need this so the frontend can delete it
            events.append(data)

        return events

    def delete_event(self, event_id: str):
        self.db.collection("events").document(event_id).delete()
        return True

    def write_user(self):
        pass

    def update_user(self, user_id, name=None, passenger_number=None, mobility_details=None):
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
