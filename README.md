# DARTS Transporatation Scheduler
*by Ian, Derin, Omar and Daniel* (team Thurs-54)

## Installation Instructions
### Frontend
```bash
cd frontend
npm install
npx expo start
# if you wanna do a hard restart of expo, run
npx expo start --clear
# to clear the cache

### for the voice feature
npx expo prebuild
npx expo run:ios # if IOS
npx expo run:android # if ur on android studio
```

### Backend
```bash
cd backend

# if you haven't made the virtual environment file yet, do 
python3 -m venv .venv 
#first  

# Mac
source .venv/bin/activate
pip install -r requirements.txt
fastapi run main.py

# Windows
python -m venv .venv 
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

```
