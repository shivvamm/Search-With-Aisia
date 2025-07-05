import requests
from bs4 import BeautifulSoup
import urllib.parse
import httpx
class GoogleScrape:
    def __init__(self):
        self.base_url = "https://www.google.com/search?q="
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    async def search(self, category, query, num_results):
        search_query = f"{category} {query}"
        print(f"Searching for: {search_query}")

        
        url = f"{self.base_url}{urllib.parse.quote(search_query)}"
        
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)

        
        if response.status_code != 200:
            print(f"Failed to retrieve results for {search_query}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        search_results = soup.find_all('h3') 

        results = []
        for result in search_results[:num_results]:  
            link = result.find_parent('a', href=True)  
            if link:
                results.append({
                    "title": result.get_text(),
                    "url": link['href']
                })

        return results

    async def scrape_shopping(self, query, num_results=10):
        return await self.search("Shopping", query, num_results)

    async def scrape_books(self, query, num_results=10):
        return await self.search("Books", query, num_results)

    async def scrape_flights(self, query, num_results=10):
        return await self.search("Flights", query, num_results)

    async def scrape_finance(self, query, num_results=10):
        return await self.search("Finance", query, num_results)
    
    async def scrape_videos(self, query, num_results=10):
        category = "Videos"
        search_query = f"{category} {query}"
        print(f"Searching for: {search_query}")

        url = f"{self.base_url}{urllib.parse.quote(search_query)}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)

        if response.status_code != 200:
            print(f"Failed to retrieve results for {search_query}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        video_results = []

        search_results = soup.find_all('a', href=True)

        for link in search_results:
            href = link['href']

            if 'youtube.com/watch' in href or 'vimeo.com' in href:
                title = link.get_text(strip=True) or "No title"

                
                if 'youtube.com/watch?v=' in href:
                    video_id = href.split('v=')[-1]
                    embed_url = f"https://www.youtube.com/embed/{video_id}"
                elif 'vimeo.com/' in href:
                    video_id = href.split('/')[-1]
                    embed_url = f"https://player.vimeo.com/video/{video_id}"
                else:
                    continue
                
                video_results.append({
                    "title": title,
                    "url": embed_url
                })

            if len(video_results) >= num_results:
                break

        return video_results
    
    async def scrape_text(self, query, num_results=10):
        """Scrape Google text search results"""
        print(f"Searching Google for: {query}")
        
        url = f"{self.base_url}{urllib.parse.quote(query)}&num={num_results}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
        
        if response.status_code != 200:
            print(f"Failed to retrieve results for {query}")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []
        
        # Find all search result divs
        search_divs = soup.find_all('div', class_='g')
        
        for div in search_divs[:num_results]:
            try:
                # Extract title
                title_elem = div.find('h3')
                if not title_elem:
                    continue
                title = title_elem.get_text()
                
                # Extract URL
                link_elem = div.find('a', href=True)
                if not link_elem:
                    continue
                href = link_elem['href']
                
                # Extract snippet/description
                snippet = ""
                # Try to find snippet in various possible locations
                snippet_elem = div.find('span', class_='aCOpRe') or \
                              div.find('div', class_='VwiC3b') or \
                              div.find('div', class_='IsZvec') or \
                              div.find('span', class_='st')
                
                if snippet_elem:
                    snippet = snippet_elem.get_text(strip=True)
                
                results.append({
                    "title": title,
                    "href": href,
                    "body": snippet
                })
                
            except Exception as e:
                print(f"Error parsing result: {e}")
                continue
        
        return results



# def main():
#     scraper = GoogleScrape()

   
#     query = "best deals" 
#     num_results = 5      

#     shopping_results = scraper.scrape_shopping(query, num_results)
#     books_results = scraper.scrape_books(query, num_results)
#     flights_results = scraper.scrape_flights(query, num_results)
#     finance_results = scraper.scrape_finance(query, num_results)
#     videos_results = scraper.scrape_videos(query, num_results)

#     print("\nShopping Results:")
#     for result in shopping_results:
#         print(f"Title: {result['title']}, URL: {result['url']}")

#     print("\nBooks Results:")
#     for result in books_results:
#         print(f"Title: {result['title']}, URL: {result['url']}")

#     print("\nFlights Results:")
#     for result in flights_results:
#         print(f"Title: {result['title']}, URL: {result['url']}")

#     print("\nFinance Results:")
#     for result in finance_results:
#         print(f"Title: {result['title']}, URL: {result['url']}")

#     print("\nVideos Results:")
#     for result in videos_results:
#         print(f"Title: {result['title']}, URL: {result['url']}")

# if __name__ == "__main__":
#     main()
