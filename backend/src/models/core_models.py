# this is the file to store the models - the stuff that's going in and out of the db 
# basically making sure everything is standardized 
from datetime import datetime
from pydantic import BaseModel

class Event(BaseModel):
    name: str
    date: str
    location: str

    def to_firestore(self):
        return {
            "name": self.name,
            "date": self.date,
            "location": self.location
        }