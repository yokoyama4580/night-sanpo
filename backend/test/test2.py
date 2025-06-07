import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"  # Flaskアプリが起動しているURL

def create_diary_entry():
    payload = {
        "text": "今日は散歩したい気分です。",
        "created_at": datetime.utcnow().isoformat()
    }
    res = requests.post(f"{BASE_URL}/diary/", json=payload)
    res.raise_for_status()
    print("✅ 日記作成:", res.json())
    return res.json()

def generate_routes(categories,entry_id):
    payload = {
        "lat": 36.6431,
        "lon": 138.1887,
        "distance": 3.0,
        "lambda_score": 0.0,
        "categories": categories,
        "entry_id": entry_id
    }
    res = requests.post(f"{BASE_URL}/generate-route", json=payload)
    res.raise_for_status()
    print("✅ ルート生成:", res.json())
    return res.json()

def save_selected_route(entry_id, index):
    payload = {"index": index}
    res = requests.post(f"{BASE_URL}/diary/{entry_id}/paths", json=payload)
    res.raise_for_status()
    print("✅ ルート保存:", res.json())
    return res.json()

def get_saved_route(entry_id):
    res = requests.get(f"{BASE_URL}/diary/{entry_id}/paths")
    res.raise_for_status()
    print("✅ 保存済みルート:", res.json())
    return res.json()

if __name__ == "__main__":
    # print("🧪 テスト開始：日記ルートフロー")
    # entry = create_diary_entry()
    # suggest=generate_routes(entry["categories"],entry["id"])

    # selected_index = 0  # 仮に最初のルートを選択
    # save_selected_route(entry["id"], selected_index)
    get_saved_route("2f22df22-bed9-4d4d-829c-8b7e8cf25c2")
