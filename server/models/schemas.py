from pydantic import BaseModel
from typing import List
from enum import Enum

class Query(BaseModel):
    query: str
    session_id: str
    search_type_resources:List


class SearchType(str, Enum):
    Images = "Images"
    News = "News"
    Maps = "Maps"
    Videos = "Videos"
    Shopping = "Shopping"
    Books = "Books"
    Flights = "Flights"
    Finance = "Finance"


