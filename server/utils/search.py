import httpx
from duckduckgo_search import DDGS

# DuckDuckGo API initialization
ddgs = DDGS()

async def search_handler(query: str, search_type: str):
    if search_type == "text":
        results = list(ddgs.text(query))
        return results
    elif search_type == "images":
        results = list(ddgs.images(query))
        return results
    elif search_type == "news":
        results = list(ddgs.news(query))
        return results
    elif search_type == "maps":
        results = list(ddgs.maps(query))
        return results
    else:
        raise ValueError("Invalid search type")
