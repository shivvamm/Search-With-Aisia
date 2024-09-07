from fastapi import APIRouter,HTTPException
from utils.chat import chat_handler
from models.schemas import Query

router = APIRouter()


@router.post("/chat")
async def chat(query: Query):
    try:
        response = await chat_handler(query.query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/complete/")
async def autocomplete(input:str):
    try:
        pass
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
