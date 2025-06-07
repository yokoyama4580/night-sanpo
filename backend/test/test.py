# test_diary_and_route.py
import requests
from datetime import datetime
import time

BASE_URL = "http://127.0.0.1:8000"
BASE_URL = "http://127.0.0.1:8000"
DIARY_URL = f"{BASE_URL}/diary"
HEADERS = {"Content-Type": "application/json"}

def create_diary(text: str):
    payload = {
        "text": text,
        "created_at": "2025-06-03-00:00:00"
    }
    r = requests.post(f"{BASE_URL}/diary", json=payload)
    try:
        response_json = r.json()
        print(f"[POST /diary] {r.status_code} {response_json}")
        return response_json  # ← カテゴリ取得に使用
    except requests.exceptions.JSONDecodeError:
        print("❌ JSON decode error on diary POST.")
        print(r.text)
        return None

def generate_route(categories: list):
    payload = {
        "lat": 36.6431,
        "lon": 138.1887,
        "distance": 3.0,
        "lambda_score": 0.5,
        "categories": categories
    }
    r = requests.post(f"{BASE_URL}/generate-route", json=payload)
    try:
        print(f"[POST /generate-route] {r.status_code} {r.json()}")
    except requests.exceptions.JSONDecodeError:
        print("❌ JSON decode error on route generation.")
        print(r.text)

def select_route(index=0):
    r = requests.get(f"{BASE_URL}/select-route/{index}")
    try:
        print(f"[GET /select-route/{index}] {r.status_code} {r.json()}")
    except requests.exceptions.JSONDecodeError:
        print("❌ JSON decode error on route select.")
        print(r.text)

def get_all_entries():
    print("\n[GET /diary]")
    r = requests.get(DIARY_URL)
    print(f"Status: {r.status_code}")
    print("Response:", r.json())

def get_entry(entry_id: str):
    print(f"\n[GET /diary/{entry_id}]")
    r = requests.get(f"{DIARY_URL}/{entry_id}")
    print(f"Status: {r.status_code}")
    print("Response:", r.json())
    return r.json()

def update_entry(entry_id: str, new_text: str):
    payload = {"text": new_text}
    print(f"\n[PUT /diary/{entry_id}] {payload}")
    r = requests.put(f"{DIARY_URL}/{entry_id}", headers=HEADERS, json=payload)
    print(f"Status: {r.status_code}")
    print("Response:", r.json())

def delete_entry(entry_id: str):
    print(f"\n[DELETE /diary/{entry_id}]")
    r = requests.delete(f"{DIARY_URL}/{entry_id}")
    print(f"Status: {r.status_code}")
    print("Response:", r.json())

if __name__ == "__main__":
    # ステップ①: 日記投稿 & カテゴリ推論
    text = "今日はとても疲れていて、静かな場所で癒されたい気分です。"
    diary_entry = create_diary(text)

    # generate_route(diary.get("categories"))
    # get_all_entries()
    # entry = get_entry("test123")
    # print(entry)
    # update_entry("test123", "少し疲れが溜まっていたが、自然に癒された。")
    # delete_entry("test123")
    # get_all_entries()