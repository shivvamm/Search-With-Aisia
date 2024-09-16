import os
import re
from fastapi import HTTPException , status
from datetime import datetime
from constants.prompts import user_message_without_results, user_message_with_results
from groq import AsyncGroq
from config.llm import llm,chat
from langchain_core.pydantic_v1 import BaseModel, Field
from utils.search import format_search_results
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser,JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder,PromptTemplate
from langchain_community.chat_message_histories import RedisChatMessageHistory
from dotenv import load_dotenv
from constants.prompts import to_search_or_not

load_dotenv()
parser = JsonOutputParser()

class descision(BaseModel):
    to_search: bool = Field(description="Ture if there is a need to search the web for the query and if not need to search the web then False")
   

system_without_results = ChatPromptTemplate.from_messages(
    [
        ("system", user_message_without_results),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)

system_with_results = ChatPromptTemplate.from_messages(
    [
        ("system", user_message_with_results),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)

def get_message_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(session_id, url=os.getenv("REDIS_URL"))



client = AsyncGroq(
    api_key=os.getenv('GROQ_API_KEY'),
)


async def get_descision(query: str):
    pattern = r'"to_search":\s*(true|false)'
    current_date = datetime.now()
    formatted_date = current_date.strftime("%d %B %Y")
    parser = JsonOutputParser(pydantic_object=descision)
    prompt = PromptTemplate(template=to_search_or_not,input_variables=["Query","Date"],partial_variables={"format_instructions": parser.get_format_instructions()})
    chain = prompt | chat | StrOutputParser()
    output = chain.invoke({"Query":query,"Date":formatted_date})
    match = re.search(pattern, output, re.IGNORECASE)
    if match:
        value = match.group(1)
        flag = value.lower() == 'true'
    
        if flag:
            output= True
            print(type(flag))
            print("The value is True.")
        else:
            output = False
            print("The value is False.")
    else:
        output = False
        print("No match found.")
    print(output)
    return output


async def chat_handler(query: str,session_id:str,results: dict) -> dict:
    try:
        if results is "":
            prompt = system_without_results
            context = "" 
        else:
            prompt = system_with_results
            context = format_search_results(results) 

        rag_chain = prompt | llm | StrOutputParser()
        with_message_history = RunnableWithMessageHistory(
                rag_chain,
                get_message_history,
                input_messages_key="input",
                history_messages_key="history",
            )
        context = format_search_results(results)

        final_response = await with_message_history.ainvoke(
                {"context": context, "input": query},
                config={"configurable": {"session_id": session_id}},
            )
        response_data = {
                "refined_results": final_response,
                "results": results
        }
        return response_data

    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred. Please try again later.")




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