from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/schedule")
async def schedule():
    return {"message": "Task scheduled successfully"}