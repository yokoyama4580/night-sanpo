# 📘 API 仕様書（Flask）
## Base URL
http://localhost:8000/

---
## 📥 POST `/diary/`（日記の新規作成）

- Request Body
```json
{
  "id": "string",
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