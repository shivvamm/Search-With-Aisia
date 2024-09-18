from pydantic import BaseModel
from typing import List

class Query(BaseModel):
    query: str
    session_id: str
    search_type_resources:List


