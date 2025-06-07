from sqlalchemy import Column, String, DateTime, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid
import json

Base = declarative_base()

class DiaryEntry(Base):
    __tablename__ = 'diary_entries'

    id = Column(String, primary_key=True, default=lambda:str(uuid.uuid4()))
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    categories = Column(Text, default=lambda: json.dumps([])) #JSON
    description = Column(Text, default="")

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "categories": json.loads(self.categories) if self.categories else [],
            "description": self.description 
        }