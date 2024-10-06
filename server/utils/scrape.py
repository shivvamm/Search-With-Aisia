from bs4 import BeautifulSoup
import urllib.request
import json
import requests
import urllib.parse

class BingSearch:
    def __init__(self, default_query="cats", default_num_results=5, max_pages=2):
        self.default_query = '+'.join(default_query.split())
        self.default_num_results = default_num_results
        self.max_pages = max_pages
        self.image_results = []
        self.video_results = []
        self.news_results = []
        self.header = {
            'User-Agent': "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/43.0.2357.134 Safari/537.36"
        }

    def get_soup(self, url):
        return BeautifulSoup(urllib.request.urlopen(
            urllib.request.Request(url, headers=self.header)),
            'html.parser')

    async def search_images(self, query=None, num_images=None):
        query = query or self.default_query
        num_images = num_images or self.default_num_results
        
        self.image_results = []  # Reset results for new search
        base_url = f"http://www.bing.com/images/search?q={'+'.join(query.split())}&FORM=HDRSC2"

        current_page = 0
        results_per_page = 35  # Bing typically returns 35 images per page

        while len(self.image_results) < num_images and current_page < self.max_pages:
            url = f"{base_url}&first={current_page * results_per_page}"
            soup = self.get_soup(url)

            raw_results = soup.find_all("a", {"class": "iusc"})

            if not raw_results:
                break  # Exit if there are no more results

            for result in raw_results:
                if len(self.image_results) >= num_images:
                    break

                m = json.loads(result["m"])
                murl, turl = m["murl"], m["turl"]  # Mobile image, desktop image

                # Extracting metadata
                metadata = {
                    "image_name": urllib.parse.urlsplit(murl).path.split("/")[-1],
                    "murl": murl,
                    "turl": turl,
                    "width": m.get("width", "N/A"),
                    "height": m.get("height", "N/A"),
                    "size": m.get("size", "N/A")  # Size might not be available
                }
                self.image_results.append(metadata)

            current_page += 1  # Go to the next page

        return self.image_results

    async def search_videos(self, query=None, num_videos=None):
        query = query or self.default_query
        num_videos = num_videos or self.default_num_results
        
        self.video_results = []  # Reset results for new search
        base_url = f"http://www.bing.com/videos/search?q={'+'.join(query.split())}"

        current_page = 0
        results_per_page = 35  # Bing typically returns 35 videos per page

        while len(self.video_results) < num_videos and current_page < self.max_pages:
            url = f"{base_url}&first={current_page * results_per_page}"
            soup = self.get_soup(url)

            # Find video links with a specific selector
            raw_results = soup.find_all("a", {"class": "video"})

            for result in raw_results:
                if len(self.video_results) >= num_videos:
                    break
                
                if "href" in result.attrs:
                    video_url = result["href"]
                    title = result.get_text(strip=True) or "No title"

                    # Ensure the video_url is complete
                    if not video_url.startswith('http'):
                        video_url = f"http://www.bing.com{video_url}"

                    self.video_results.append({
                        "video_url": video_url,
                        "title": title
                    })

            current_page += 1  # Go to the next page

        return self.video_results

    async def search_news(self, query=None, num_news=None):
        query = query or self.default_query
        num_news = num_news or self.default_num_results

        self.news_results = []  # Reset results for new search
        base_url = f"https://www.bing.com/news/search?q={'+'.join(query.split())}"

        current_page = 0

        while len(self.news_results) < num_news and current_page < self.max_pages:
            url = f"{base_url}&first={current_page * 10}"  # 10 news articles per page
            soup = self.get_soup(url)

            # Find news articles
            raw_results = soup.find_all("a", {"class": "title"})

            for result in raw_results:
                if len(self.news_results) >= num_news:
                    break

                news_url = result["href"]
                title = result.get_text(strip=True) or "No title"
                summary = result.find_next("div", class_="snippet").get_text(strip=True) if result.find_next("div", class_="snippet") else "No summary"

                # Ensure the news_url is complete
                if not news_url.startswith('http'):
                    news_url = f"https://www.bing.com{news_url}"

                self.news_results.append({
                    "news_url": news_url,
                    "title": title,
                    "summary": summary
                })

            current_page += 1  # Go to the next page

        return self.news_results


def is_valid_url(url):
    try:
        response = requests.head(url, allow_redirects=True)
        return response.status_code == 200
    except requests.RequestException:
        return False


# if __name__ == "__main__":
#     bing_search = BingSearch(max_pages=2)  # Limit to 2 pages

#     # Search for images
#     image_results = bing_search.search_images(query="Aliens", num_images=5)
#     print("Image Results:")
#     for image in image_results:
#         print(image)

    # # Search for videos
    # video_results = bing_search.search_videos(query="Aliens", num_videos=5)
    # print("\nVideo Results:")
    # for video in video_results:
    #     print(video)

    # Search for news
    # news_results = bing_search.search_news(query="cat", num_news=5)
    # print("\nNews Results:")
    # for news in news_results:
    #     print(news)
