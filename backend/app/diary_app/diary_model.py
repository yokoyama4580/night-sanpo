from sqlalchemy import Column, String, DateTime, Integer, Title, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from .base import Base
from datetime import datetime
import uuid
import json

class DiaryEntry(Base):
    __tablename__ = 'diary_entries'

    id = Column(String, primary_key=True, default=lambda:str(uuid.uuid4()))
    title = Column(Title, nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    categories = Column(Text, default=lambda: json.dumps([])) #JSON
    description = Column(Text, default="")

    paths = relationship("DiaryRoute", back_populates="diary", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "text": self.text,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "categories": json.loads(self.categories) if self.categories else [],
            "description": self.description
        }

class DiaryRoute(Base):
    __tablename__ = 'diary_routes'

    id = Column(Integer, primary_key=True)
    diary_id = Column(String, ForeignKey("diary_entries.id"))
    path = Column(Text)
    index = Column(Integer, nullable=False)  # ← インデックスを追加！
    total_km = Column(Float, nullable=True)
    score = Column(Float, nullable=True)

    diary = relationship("DiaryEntry", back_populates="paths")

    def to_dict(self):
        return {
            "id": self.id,
            "diary_id": self.diary_id,
            "index": self.index,
            "path": json.loads(self.path) if self.path else [],
            "total_km": self.total_km,
            "score": self.score
        }
