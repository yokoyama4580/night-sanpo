# app/daiary_app/diary_model.py
from pydantic import BaseModel
from datetime import datetime

class DiaryEntry(BaseModel):
    id: str
    text: str
    created_at: datetime
    categories: list = []
    description: str = ""
