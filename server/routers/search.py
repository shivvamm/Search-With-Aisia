from fastapi import APIRouter,HTTPException,Query
from fastapi.responses import JSONResponse
from models.schemas import Query
from typing import Optional,List
from utils.search import search_handler
from utils.chat import get_descision,chat_handler
router = APIRouter()


@router.post("/search")
async def search(query: Query, search_type: Optional[str] = "text"):
    try:
        valid_search_types = {"text", "images", "news", "maps"}
        if search_type not in valid_search_types:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "Invalid search type provided."}
            )
        to_sreach = await get_descision(query.query)
        print("this is the value of to searh",type(to_sreach))

        if to_sreach:
            results = await search_handler(query.query, search_type)
            response = await chat_handler(query.query,query.session_id,results)
        else:
            response = await chat_handler(query.query,query.session_id,results="")
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "data": response,
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
    

