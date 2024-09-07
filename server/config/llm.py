import os
from langchain_groq import ChatGroq
from groq import AsyncGroq

client = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY"),
)



llm = ChatGroq(
    groq_api_key=os.getenv('GROQ_API_KEY'),
    model="llama-3.1-70b-versatile",
    temperature=0,
)

audiomodel = ChatGroq(
groq_api_key=os.getenv('GROQ_API_KEY'),
model="distil-whisper-large-v3-en",
)