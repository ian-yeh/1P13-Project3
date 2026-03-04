from fastapi import FastAPI
from src.workers.caller import CallingAgent

app = FastAPI()

@app.get("/")
async def root():


    return {"message": "Hello World"}

@app.post("/schedule")
async def schedule():
    return {"message": "Task scheduled successfully"}

