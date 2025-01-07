import asyncio
import logging
from fastapi import APIRouter,HTTPException,Query,status, Request
from fastapi.responses import JSONResponse
from models.schemas import Query
from typing import Optional,List
from utils.search import search_handler
from utils.scrape import  BingSearch,is_valid_url
from utils.scrapegoogle import GoogleScrape
from utils.gemini import get_descision_gemini
from utils.chat import get_decision,chat_handler,get_search_type,get_search_query
router = APIRouter()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/search",status_code=status.HTTP_200_OK)
async def search(request: Request,query: Query, search_type: str):
    try:
        logger.info(f"Request URL: {request.url}")
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
                # for i in query.search_type_resources:
                    # resources.append(search_handler(query.query, i.lower()))



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


@router.post("/searchnew",status_code=status.HTTP_200_OK)
async def search_new(request:Request,query: Query):
    try:
        print(query)
        resources = {}
        results=[]
        image_data = []
        response=""
        search_type = await get_search_type(query.query)
        search_query  = await get_search_query(query.query,"".join(search_type))
        new_query = search_query["query"]
        print(new_query)
        print(search_type)
        if "Text" in search_type or len(search_type["search_types"]) == 0:
            to_sreach = await get_decision(query.query)

            if to_sreach:
                results = await search_handler(search_query["query"], search_type)
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

        elif len(search_type["search_types"]) >0:
            valid_search_types = ["Images", "News", "Maps","Videos","Shopping","Books","Flights","Finance"]
            requested_search_type = search_type["search_types"]
            if not all(item in valid_search_types for item in requested_search_type):
                return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "Invalid search type provided."}
                )
            results=await search_handler(query.query, "text")
            for i in requested_search_type:
                if i == "Images":
                    bing_search = BingSearch(max_pages=2)
                    image_results,image_data = await bing_search.search_images(query=new_query, num_images=15)
                    valid_images = []
                    for image in image_results:
                        if is_valid_url(image['murl']):
                            valid_images.append(image)
                            if len(valid_images) >= 8:
                                break
                    resources["Images"] = valid_images
                elif i == "Videos":
                    google_search = GoogleScrape()
                    resources["Videos"] = await google_search.scrape_videos(new_query, num_results=6)
                elif i == "News":
                    bing_search = BingSearch(max_pages=2)
                    resources["News"] = await bing_search.search_news(query=new_query, num_news=5)
                elif i == "Shopping":
                    google_search = GoogleScrape()
                    resources["Shopping"] = await google_search.scrape_shopping(new_query, num_results=5)
                elif i == "Books":
                    google_search = GoogleScrape()
                    resources["Books"] = await google_search.scrape_books(new_query, num_results=5)
                elif i == "Flights":
                    google_search = GoogleScrape()
                    resources["Flights"] = await google_search.scrape_flights(new_query, num_results=5)
                elif i == "Finance":
                    google_search = GoogleScrape()
                    resources["Finance"] = await google_search.scrape_finance(new_query, num_results=5)


            response = await chat_handler(query.query,query.session_id,results,resources)
            if "Images" in resources:
                for key,value in image_data.items():
                            for i in  resources["Images"]:
                                if i['murl'] == key:
                                    i['data'] = value
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
