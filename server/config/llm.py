import os
from langchain_groq import ChatGroq
from groq import AsyncGroq
from dotenv import load_dotenv
load_dotenv()

client = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY"),
)


chat = ChatGroq(temperature=0, 
                groq_api_key=os.getenv('GROQ_API_KEY'), 
                model_name="llama-3.1-70b-versatile")


llm = ChatGroq(
    groq_api_key=os.getenv('GROQ_API_KEY'),
    model="llama-3.1-70b-versatile",
    temperature=0,
)



audiomodel = ChatGroq(
groq_api_key=os.getenv('GROQ_API_KEY'),
model="distil-whisper-large-v3-en",
)