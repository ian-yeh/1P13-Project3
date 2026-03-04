from fastapi import FastAPI
from src.workers.database import DatabaseWorker
from src.models.core_models import Event

app = FastAPI()
database_worker = DatabaseWorker()

@app.get("/")
async def root():
<<<<<<< HEAD
    return {"message": "Hello World"}
=======
    return {"message": "Hello World"}

@app.post("/api/schedule")
async def schedule(event_data: Event):
    database_worker.write_event(
        event_data.name, 
        event_data.date, 
        event_data.location
    )

    return {"message": "Task scheduled successfully"}
>>>>>>> 3d2c596a1b7e09972fabccf436c0813f26c07862
