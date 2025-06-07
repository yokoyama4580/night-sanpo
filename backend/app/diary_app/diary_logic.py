# app/daiary_app/diary_logic.py
import json
from pathlib import Path
from typing import List, Optional
from .diary_model import DiaryEntry

class DiaryService:
    def __init__(self, file_path: str = "diary_data.json"):
        self.file_path = Path(file_path)
        self.file_path.touch(exist_ok=True)
        if self.file_path.stat().st_size == 0:
            self._save_all([])

    def _load_all(self) -> List[DiaryEntry]:
        with self.file_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
            return [DiaryEntry(**entry) for entry in data]

    def _save_all(self, entries: List[DiaryEntry]):
        with self.file_path.open("w", encoding="utf-8") as f:
            json.dump(
                [entry.model_dump() for entry in entries],
                f,
                indent=2,
                ensure_ascii=False,
                default=str
            )

    def get_all(self) -> List[DiaryEntry]:
        return self._load_all()

    def add_entry(self, entry: DiaryEntry):
        entries = self._load_all()
        entries.append(entry)
        self._save_all(entries)

    def update_entry(self, entry_id: str, new_text: str) -> bool:
        entries = self._load_all()
        updated = False
        for entry in entries:
            if entry.id == entry_id:
                entry.text = new_text
                updated = True
                break
        if updated:
            self._save_all(entries)
        return updated

    def delete_entry(self, entry_id: str) -> bool:
        entries = self._load_all()
        new_entries = [entry for entry in entries if entry.id != entry_id]
        if len(new_entries) != len(entries):
            self._save_all(new_entries)
            return True
        return False

    def get_entry(self, entry_id: str) -> Optional[DiaryEntry]:
        entries = self._load_all()
        for entry in entries:
            if entry.id == entry_id:
                return entry
        return None
