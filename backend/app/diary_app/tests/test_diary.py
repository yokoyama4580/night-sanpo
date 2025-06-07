# app/daiary_app/test_diary.py
from datetime import datetime
from app.daiary_app.diary_model import DiaryEntry
from app.daiary_app.diary_logic import DiaryService


service = DiaryService()

# 新規追加
entry = DiaryEntry(id="1", text="初めての日記", created_at=datetime.now())
service.add_entry(entry)

# 一覧取得
for d in service.get_all():
    print(d)

# 編集
service.update_entry("1", "編集された日記の内容")

# 単体取得
print("単体取得:", service.get_entry("1"))

# 削除
service.delete_entry("1")
