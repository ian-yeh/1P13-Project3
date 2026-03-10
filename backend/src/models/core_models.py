# this is the file to store the models - the stuff that's going in and out of the db 
# basically making sure everything is standardized 
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Event(BaseModel):
    name: str
    date: datetime
    location: str
    arrival_time: datetime
    departure_time: datetime
    user_id: str
    status: str

    def to_firestore(self):
        data = {
            "name": self.name,
            "date": self.date.isoformat(),
            "location": self.location,
            "arrival_time": self.arrival_time.isoformat(),
            "departure_time": self.departure_time.isoformat(),
            "user_id": self.user_id,
            "status": self.status
        }

        return data

class User(BaseModel):
    name: str
    passenger_number: str
    mobility_details: str
    user_id: str

    def to_firestore(self):
        return {
            "name": self.name,
            "passenger_number": self.passenger_number,
            "mobility_details": self.mobility_details,
            "user_id": self.user_id
        }
