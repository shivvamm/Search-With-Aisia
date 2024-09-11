import httpx
from duckduckgo_search import AsyncDDGS
from typing import List, Dict

# DuckDuckGo API initialization
addgs = AsyncDDGS()


def format_search_results(results: List[Dict[str, str]]) -> str:
    formatted_results = []
    
    for result in results:
        title = result.get("title", "No title available")
        href = result.get("href", "No link available")
        body = result.get("body", "No description available")
        
        formatted_results.append(
            f"**Title:** {title}\n"
            f"**Link:** {href}\n"
            f"**Description:** {body}\n"
            "---"
        )
    
    # Join all the formatted results with a newline character
    return "\n".join(formatted_results)



async def search_handler(query: str, search_type: str):
    
    if search_type == "text":
        results = list(await addgs.atext(query,max_results=10))
        return results
    elif search_type == "images":
        results = list(await addgs.images(query))
        return results
    elif search_type == "news":
        results = list(await addgs.news(query))
        return results
    elif search_type == "maps":
        results = list(await addgs.maps(query))
        return results
    else:
        raise ValueError("Invalid search type")
    





async def fetch_recommendtions(input):
    pass



