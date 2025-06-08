# 📘 API 仕様書（Flask）
## Base URL
http://localhost:8000/

## 概要
ユーザーが入力したテキストに基づき日記を作成し、ルートを生成・選択・保存できるAPI。ルートは最大1件だけ保存され、再取得も可能。

- 📍 /generate-route (POST)
説明：
ルート候補を生成して app.suggested_routes に保持。

リクエスト形式：
```json
{
  "lat": 36.6431,
  "lon": 138.1887,
  "distance": 3.0,
  "lambda_score": 0.0,
  "categories": ["relax", "explore"],
  "entry_id": "string"
}
```
レスポンス形式（例）:
```json
{
  "num_paths": 3,
  "distances": [2.9, 3.1, 3.0],
  "entry_id": "faagf123"
}
```
- 📍 /select-route/<index> (GET)
説明：
生成されたルート候補から1つを取得。

パスパラメータ：
index: 候補のインデックス（0始まり）

レスポンス形式：
```json
{
  "path": [
    [36.6431, 138.1887],
    [36.6440, 138.1890],
    ...
  ]
}
```
- 📍 /diary/<entry_id>/paths (POST)
説明：
指定されたルート候補のうち、1件を選択して保存（既存がある場合は削除される）。

パスパラメータ：
entry_id: 保存対象の日記ID

リクエスト形式：
```json
{
  "index": 1
}
```
成功レスポンス形式：
```json
{
  "message": "インデックス 1 のルートを保存しました",
  "saved_route": {
    "index": 1,
    "path": [...],
    "total_km": 3.0,
    "score": 0.8
  }
}
```
- 📍 /diary/<entry_id>/paths (GET)
説明：
日記に紐づく保存済みのルートを取得（最大1件）。

パスパラメータ：
entry_id: 日記ID

成功レスポンス形式：
```json
[
  {
    "id": 5,
    "index": 1,
    "path": [[36.6431, 138.1887], [36.6440, 138.1890]],
    "total_km": 3.0,
    "score": 0.8
  }
]
```
- 🔐 その他の仕様と制限
suggested_routes は Flask アプリ内メモリに保存されるため、永続化されません。
POST /diary/<entry_id>/paths は 既存ルートを削除して1件だけ保存 します。
path は GeoJSON風のリスト形式で表現されます（例: [[lat1, lon1], [lat2, lon2], ...]）。
---
## 📥 POST `/diary/`（日記の新規作成）

- Request Body
```json
{
  "text": "string",
  "created_at": "ISO8601 string"
}
```
- Response
```json
{
  "id": "string",
  "text": "string",
  "created_at": "ISO8601 string"
}
```
---
## 📤 GET `/diary/`（日記一覧取得）
- Response
```json
[
  {
    "id": "string",
    "text": "string",
    "created_at": "ISO8601 string"
  },
  ...
]
```
---
## 📤 GET `/diary/{id}`（単一日記の取得）
- Response (200)
```
{
  "id": "string",
  "text": "string",
  "created_at": "ISO8601 string"
}
```
- Response(404)
```
{ "error": "Entry not found" }
```
---
## ✏️ PUT `/diary/{id}`（日記の更新）
- Request Body
```
{
  "text": "string"
}
```
-Response (200)
```json
{ "message": "Entry updated" }
```
- Response (404)
```json
{ "error": "Entry not found" }
```
## ❌ DELETE `/diary/{id}`（日記の削除）
- Response (200)
```json
{ "message": "Entry deleted" }
```
- Response (404)
```json
{ "error": "Entry not found" }
```