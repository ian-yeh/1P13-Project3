from caller import CallingAgent
from dotenv import load_dotenv
import os

load_dotenv()

SID = os.getenv("SID")
TOKEN = os.getenv("TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER")
OMAR = os.getenv("OMAR")

agent = CallingAgent(SID, TOKEN, TWILIO_NUMBER)

mp3_link = "https://drive.google.com/uc?export=download&id=1CnUncHXdaykLl1FmLfdcO83AQVZ8m_DX"
call_result = agent.call(OMAR, mp3_link)

print(call_result)
