import os
import re
from fastapi import HTTPException , status
from datetime import datetime
from constants.prompts import user_message_without_resources, user_message_with_resources
from groq import AsyncGroq
from typing import List
from config.llm import llm,chat
from pydantic import BaseModel, Field
from utils.search import format_search_results
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser,JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder,PromptTemplate
from langchain_community.chat_message_histories import RedisChatMessageHistory
from dotenv import load_dotenv
from constants.prompts import to_search_or_not,to_get_search_types

load_dotenv()
parser = JsonOutputParser()

class descision(BaseModel):
    to_search: bool = Field(description="Ture if there is a need to search the web for the query and if not need to search the web then False")
   
class SearchDecision(BaseModel):
    search_types: List[str] = Field(
        default_factory=list,
        description="A list of types of searches needed (e.g., images, news, videos, maps, shopping, books, flights, finance)."
    )


system_without_resources = ChatPromptTemplate.from_messages(
    [
        ("system", user_message_without_resources),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)

system_with_resources = ChatPromptTemplate.from_messages(
    [
        ("system", user_message_with_resources),
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
        else:
            output = False
    else:
        output = False
    print(output)
    return output



async def get_search_type(query: str):
    current_date = datetime.now()
    formatted_date = current_date.strftime("%d %B %Y")
    parser = JsonOutputParser(pydantic_object=SearchDecision)
    prompt = PromptTemplate(template=to_get_search_types,input_variables=["Query","Date"],partial_variables={"format_instructions": parser.get_format_instructions()})
    chain = prompt | chat | parser
    output = chain.invoke({"Query":query,"Date":formatted_date})
    print(type(output))
    return output


async def chat_handler(query,session_id,results,resources):
    try:
        if resources == "":
            prompt = system_without_resources
            context = "" 
        else:
            prompt = system_with_resources
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
                {"context": context,"resources": resources, "input": query},
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