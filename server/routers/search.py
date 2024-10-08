import asyncio
from fastapi import APIRouter,HTTPException,Query,status
from fastapi.responses import JSONResponse
from models.schemas import Query,SearchType
from typing import List
from utils.search import search_handler
from utils.scrape import  BingSearch,is_valid_url
from utils.scrapegoogle import GoogleScrape
from utils.chat import get_decision,chat_handler,get_search_type
router = APIRouter()



@router.post("/search",status_code=status.HTTP_200_OK)
async def search(query: Query, search_type: str):
    try:
        resources = []
        results=[]
        response=""
        if search_type == "text":
            to_sreach = await get_decision(query.query)
            
            if to_sreach:
                results = await search_handler(query.query, search_type)
                response = await chat_handler(query.query,query.session_id,results,resources="")
            else:
                response = await chat_handler(query.query,query.session_id,results="",resources="")
            return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": status.HTTP_200_OK,
                "data": response,
                "resources": resources,
                "message": "Search completed successfully."
            }
        )
        
        elif search_type == "other":
            print(query.search_type_resources)
            valid_search_types = ["Image", "News", "Maps","Video"]
            requested_search_type = query.search_type_resources
            if not all(item in valid_search_types for item in requested_search_type):
                return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "Invalid search type provided."}
                )     
            results=await search_handler(query.query, "text")
            if len(query.search_type_resources) > 0:
                resources = await asyncio.gather(*(search_handler(query.query, i.lower()) for i in requested_search_type))
               


            response = await chat_handler(query.query,query.session_id,results,resources)
            return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": status.HTTP_200_OK,
                "data": response,
                "resources": resources,
                "message": "Search completed successfully."
            }
            )
    except HTTPException as http_exc:
        raise http_exc
    
    except ValueError as val_exc:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": str(val_exc)}
        )
    
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "An unexpected error occurred. Please try again later."}
        )
    

@router.get("/autocomplete")
async def recommmendation(input:str):
    try:
        # response = await auto_recommendation(query.query, search_type)
        return {"response": "fr"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/searchnew", status_code=status.HTTP_200_OK)
async def search_new(query: Query, search_type: list[SearchType]):
    try:
        # Input validation
        if not query.query or not isinstance(query.query, str):
            raise ValueError("Query must be a non-empty string.")
        
        resources = {}
        results = []
        image_data = []
        response = ""

        search_type_info = await get_search_type(query.query)
        if "Text" in search_type_info or len(search_type_info["search_types"]) == 0:
            to_search = await get_decision(query.query)
            if to_search:
                results = await search_handler(query.query, search_type_info)
                response = await chat_handler(query.query, query.session_id, results, resources="")
            else:
                response = await chat_handler(query.query, query.session_id, results="", resources="")
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": status.HTTP_200_OK,
                    "data": response,
                    "resources": resources,
                    "message": "Search completed successfully."
                }
            )

        valid_search_types = {stype.value for stype in SearchType}
        requested_search_types = set(search_type)

        if not requested_search_types.issubset(valid_search_types):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"status": "error", "message": "Invalid search type provided."}
            )

        results = await search_handler(query.query, "text")

        for search in requested_search_types:
            if search == SearchType.Images:
                bing_search = BingSearch(max_pages=2)  
                image_results, image_data = await bing_search.search_images(query=query.query, num_images=15)
                valid_images = [image for image in image_results if is_valid_url(image['murl'])][:8]
                resources["Images"] = valid_images

            elif search == SearchType.Videos:
                google_search = GoogleScrape()
                resources["Videos"] = await google_search.scrape_videos(query.query, num_results=5)

            elif search == SearchType.News:
                bing_search = BingSearch(max_pages=2)  
                resources["News"] = await bing_search.search_news(query=query.query, num_news=5)

            elif search == SearchType.Shopping:
                google_search = GoogleScrape()
                resources["Shopping"] = await google_search.scrape_shopping(query.query, num_results=5)

            elif search == SearchType.Books:
                google_search = GoogleScrape()
                resources["Books"] = await google_search.scrape_books(query.query, num_results=5)

            elif search == SearchType.Flights:
                google_search = GoogleScrape()
                resources["Flights"] = await google_search.scrape_flights(query.query, num_results=5)

            elif search == SearchType.Finance:
                google_search = GoogleScrape()
                resources["Finance"] = await google_search.scrape_finance(query.query, num_results=5)

        response = await chat_handler(query.query, query.session_id, results, resources)

        if "Images" in resources:
            for key, value in image_data.items():
                for image in resources["Images"]:
                    if image['murl'] == key:
                        image['data'] = value

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": status.HTTP_200_OK,
                "data": response,
                "resources": resources,
                "message": "Search completed successfully."
            }
        )

    except ValueError as val_exc:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"status": "error", "message": str(val_exc)}
        )
    
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "message": "An unexpected error occurred. Please try again later."}
        )

