import openai
import os
from dotenv import load_dotenv
load_dotenv()

# OpenAI API key setup
openai.api_key = "YOUR_OPENAI_API_KEY"
from groq import AsyncGroq

client = AsyncGroq(
    api_key=os.getenv('GROQ_API_KEY'),
)



async def chat_handler(query: str):
    response = await openai.ChatCompletion.create(
        model="gpt-4",  # or another model you want to use
        messages=[
            {"role": "user", "content": query}
        ]
    )
    return response.choices[0].message['content']



async def transcribe_audio(file_content: bytes, file_name: str = "audio.m4a") -> str:
    """
    Transcribe the given audio file content using Groq API.
    
    :param file_content: The audio file content as bytes.
    :param file_name: The name of the file, default is "audio.m4a".
    :return: The transcription text.
    """
    try:
        # Create a transcription of the audio file
        transcription = await client.audio.transcriptions.create(
            file=(file_name, file_content), 
            model="distil-whisper-large-v3-en", 
            prompt="Specify context or spelling", 
            response_format="json",  
            language="en", 
            temperature=0.0 
        )
        
        return transcription.text
    
    except Exception as e:
        raise RuntimeError(f"Error during transcription: {str(e)}")