from fastapi import FastAPI
from src.workers.database import DatabaseWorker
from src.models.core_models import Event, User

app = FastAPI()
database_worker = DatabaseWorker()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/schedule")
async def schedule(event_data: Event):
    database_worker.write_event(
        event_data.name, 
        event_data.date, 
        event_data.location
    )

    return {"message": "Task scheduled successfully"}

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