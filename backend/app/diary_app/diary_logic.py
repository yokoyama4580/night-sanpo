from sqlalchemy.orm import Session
from .diary_model import DiaryEntry
import json

class DiaryService:
    def __init__(self, db_session: Session):
        self.db = db_session

    def get_all(self):
        return [entry.to_dict() for entry in self.db.query(DiaryEntry).all()]

    def get_entry(self, entry_id: str):
        entry = self.db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
        return entry.to_dict() if entry else None
    
    def add_entry(self, entry: DiaryEntry):
        self.db.add(entry)
        self.db.commit()

    def update_entry(self, entry_id: str, new_text: str):
        entry = self.db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
        if entry:
            entry.text = new_text
            self.db.commit()
            return True
        return False
    
    def delete_entry(self, entry_id: str):
        entry = self.db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
        if entry:
            self.db.delete(entry)
            self.db.commit()
            return True
        return False