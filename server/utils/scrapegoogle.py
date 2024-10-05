import requests
from bs4 import BeautifulSoup
import urllib.parse

class GoogleScrape:
    def __init__(self):
        self.base_url = "https://www.google.com/search?q="
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def search(self, category, query, num_results):
        search_query = f"{category} {query}"
        print(f"Searching for: {search_query}")

        
        url = f"{self.base_url}{urllib.parse.quote(search_query)}"
        
        
        response = requests.get(url, headers=self.headers)

        
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

    def scrape_shopping(self, query, num_results=10):
        return self.search("Shopping", query, num_results)

    def scrape_books(self, query, num_results=10):
        return self.search("Books", query, num_results)

    def scrape_flights(self, query, num_results=10):
        return self.search("Flights", query, num_results)

    def scrape_finance(self, query, num_results=10):
        return self.search("Finance", query, num_results)

# def main():
#     scraper = GoogleScrape()

   
#     query = "best deals" 
#     num_results = 5      

#     shopping_results = scraper.scrape_shopping(query, num_results)
#     books_results = scraper.scrape_books(query, num_results)
#     flights_results = scraper.scrape_flights(query, num_results)
#     finance_results = scraper.scrape_finance(query, num_results)

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

# if __name__ == "__main__":
#     main()
