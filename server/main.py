from fastapi import FastAPI
from routers import chat,search
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()


app.include_router(chat.router)
app.include_router(search.router)



