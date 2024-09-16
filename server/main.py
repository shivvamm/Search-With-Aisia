from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import chat,search
from typing import Dict
import os
from config.llm import llm,chat,audiomodel,client
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOW_ORIGINS", "*")],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.include_router(chat.router)
app.include_router(search.router)


@app.get("/", response_model=Dict[str, str])
async def read_root():
    """
    Root endpoint that returns a welcome message.
    """
    return {"message": "Welcome to the Search with alisia app!"}

@app.get("/health", response_model=Dict[str, str])
async def health_check():
    """
    Health check endpoint that returns the status of the application.
    """
    try:
        messages = [
        ("system", "You are a helpful translator. Translate the user sentence to French."),
        ("human", "I love programming."),
        ]
        await  llm.invoke(messages)

        await chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Explain the importance of low latency LLMs",
            }
        ],
        model="llama3-8b-8192",
        )
    except Exception as e:
        # Log the exception and return a 500 error response
        print(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")

        return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


