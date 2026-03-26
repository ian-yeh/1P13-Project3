from fastapi import FastAPI
from src.workers.caller import CallingAgent
from src.workers.database import DatabaseWorker
from src.models.core_models import Event, User
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

# loading env vars
load_dotenv()
SID = os.getenv("SID")
TOKEN = os.getenv("TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER")
OMAR = os.getenv("OMAR")

app = FastAPI()
database_worker = DatabaseWorker()
calling_agent = CallingAgent(SID, TOKEN, TWILIO_NUMBER)
origins = ["*"]  # allow all (good for development)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def root():

    return {"message": "Hello World"}

# event routes
@app.post("/api/create_event")
async def create_event(event_data: Event):
    database_worker.write_event(event_data.to_firestore())
    
    # building a hybrid message with event info
    mp3_link = "https://drive.google.com/uc?export=download&id=1CnUncHXdaykLl1FmLfdcO83AQVZ8m_DX"
    details = f"New booking: {event_data.name}. Location: {event_data.location}. Arrival at {event_data.arrival_time.strftime('%I:%M %p')}. Departure at {event_data.departure_time.strftime('%I:%M %p')}."
    
    twiml = f"""
    <Response>
        <Play>{mp3_link}</Play>
        <Say voice="Polly.Joey-Neural">Hi! {details}. Thank you, and see you then!</Say>
    </Response>
    """
    
    call_result = calling_agent.call(OMAR, twiml)
    print(f"Hybrid call sid: {call_result}")


    return {"message": "Event created successfully"}

@app.put("/api/update_event/{event_id}")
async def update_event(event_id: str, event_data: Event):
    database_worker.update_event(
        event_id,
        name=event_data.name,
        date=event_data.date,
        location=event_data.location,
        arrival_time=event_data.arrival_time,
        departure_time=event_data.departure_time
    )

    return {"message": "Event updated successfully"}

@app.get("/api/get_events/{user_id}")
async def get_all_events(user_id: str):
    event_array = database_worker.get_events(user_id)
    #event_array = [1, 2, 3, 4]

    if not event_array:
        return {"message": "failed to fetch the events"}


    return event_array

# user routes
@app.post("/api/update_user/{user_id}")
async def update_user(user_id: str, user_data: User):
    database_worker.update_user(
        user_id,
        name=user_data.name,
        passenger_number=user_data.passenger_number,
        mobility_details=user_data.mobility_details
    )

    return {"message": "User updated successfully"}

@app.get("/api/get_user/{user_id}")
async def get_user(user_id: str):
    user = database_worker.get_user(user_id)
    if user:
        return user
    else:
        return {"message": "User not found"}, 404
