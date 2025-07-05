# from duckduckgo_search import AsyncDDGS
from duckduckgo_search import DDGS
from typing import List, Dict
import requests
from .scrapegoogle import GoogleScrape

def test_proxy(proxy):
    try:
        response = requests.get("http://httpbin.org/ip", proxies={"http": proxy, "https": proxy}, timeout=5)
        print("Proxy is working:", response.json())
        return True
    except requests.exceptions.RequestException as e:
        print("Proxy failed:", e)
        return False




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

    return "\n".join(formatted_results)



async def search_handler(query: str, search_type: str):
    if search_type == "text":
        # Try Google scraper first
        try:
            google_scraper = GoogleScrape()
            results = await google_scraper.scrape_text(query, num_results=10)
            if results:
                return results
        except Exception as e:
            print(f"Google scraper failed: {e}, falling back to DuckDuckGo")
        
        # Fallback to DuckDuckGo if Google fails
        try:
            results = list(DDGS().text(query, max_results=10))
            return results
        except Exception as e:
            print(f"DuckDuckGo also failed: {e}")
            return []
    
    elif search_type == "image":
        results = list(DDGS().images(query,max_results=5))
        return results
    elif search_type == "news":
        results = list(DDGS().news(query,max_results=5))
        return results
    elif search_type == "video":
        results = list(DDGS().videos(query,max_results=5))
        return results
    else:
        raise ValueError("Invalid search type")






async def fetch_recommendtions(input):
    pass
