from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat,search
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOW_ORIGINS", "*")],  # Allow specific origins or use "*" for all
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(chat.router)
app.include_router(search.router)



