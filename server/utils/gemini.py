import typing_extensions as typing
from dotenv import load_dotenv  
import google.generativeai as genai
import os
import re
from constants.prompts import to_search_or_not_gemini
from datetime import datetime
load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel(
    "gemini-1.5-flash",
    generation_config={"response_mime_type": "application/json"}
)


class Descision(typing.TypedDict):
    to_search: bool


async def get_descision_gemini(query: str):
    pattern = r'"to_search":\s*(true|false)'
    current_date = datetime.now()
    formatted_date = current_date.strftime("%d %B %Y")
    prompt = to_search_or_not_gemini.format(Query=query, Date=formatted_date)
    output =result = model.generate_content(
    "Please list 5 popular cookie recipes.",
    generation_config=genai.GenerationConfig(
        response_mime_type="application/json",
        response_schema = list[Descision]
    ),
    request_options={"timeout": 600},  # timeout
)
    # match = re.search(pattern, output, re.IGNORECASE)
    # if match:
    #     value = match.group(1)
    #     flag = value.lower() == 'true'
    
    #     if flag:
    #         output= True
    #     else:
    #         output = False
    # else:
    #     output = False
    result=output.text
    print(type(result))
    print(result)
    return result






