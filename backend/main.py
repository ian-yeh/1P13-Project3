from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
<<<<<<< HEAD
    return {"message": "Hello World"}
=======
    return {"message": "Hello World"}

@app.post("/schedule")
async def schedule():
    return {"message": "Task scheduled successfully"}
>>>>>>> 3d2c596a1b7e09972fabccf436c0813f26c07862
