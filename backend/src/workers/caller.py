# this is the code for the calling agent.
from twilio.rest import Client
class CallingAgent:
    def __init__(self,sid, auth_token, from_number):
        self.client = Client(sid, auth_token)
        self.from_number = from_number

    def call(self, phone_number, mp3):
        self.client.calls.create(
            to=phone_number,
            from_=self.from_number,
            twiml=f'<Response><Play>{mp3}</Play></Response>')
        