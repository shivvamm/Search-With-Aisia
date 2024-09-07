from fastapi import APIRouter,HTTPException
from models.schemas import Query
from typing import Optional
from utils.search import search_handler

router = APIRouter()


@router.post("/search")
async def search(query: Query, search_type: Optional[str] = "text"):
    try:
        response = await search_handler(query.query, search_type)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/autocomplete")
async def recommmendation(input:str):
    try:
        # response = await auto_recommendation(query.query, search_type)
        return {"response": "fr"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))