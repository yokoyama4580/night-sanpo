import requests
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000/diary"

def create_entry(entry_id: str, text: str):
    payload = {
        "id": entry_id,
        "text": text,
        "created_at": datetime.now().isoformat()
    }
    try:
        r = requests.post(BASE_URL, json=payload)
        print(f"[POST] Status Code: {r.status_code}")
        try:
            print("JSON Response:", r.json())
        except requests.exceptions.JSONDecodeError:
            print("⚠️ JSON形式ではありません。レスポンス:")
            print(r.text)
    except requests.exceptions.RequestException as e:
        print("❌ リクエスト失敗:", e)

def get_all_entries():
    r = requests.get(BASE_URL + "/")
    print(f"[GET all] {r.status_code} {r.json()}")

def get_entry(entry_id: str):
    r = requests.get(f"{BASE_URL}/{entry_id}")
    print(f"[GET {entry_id}] {r.status_code} {r.json()}")

def update_entry(entry_id: str, new_text: str):
    r = requests.put(f"{BASE_URL}/{entry_id}", json={"text": new_text})
    print(f"[PUT {entry_id}] {r.status_code} {r.json()}")

def delete_entry(entry_id: str):
    r = requests.delete(f"{BASE_URL}/{entry_id}")
    print(f"[DELETE {entry_id}] {r.status_code} {r.json()}")

if __name__ == "__main__":
    # 一連の操作例
    create_entry("test1", "今日は気分がいいです")
    get_all_entries()
    get_entry("test1")
    update_entry("test1", "とても楽しい一日だった")
    get_entry("test1")
    create_entry("test2", "つらたん")
    create_entry("test3", "わくわく")
    get_entry("test2")
    delete_entry("test2")
    get_all_entries()
