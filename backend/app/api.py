from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from .route_app.route_service import generate_routes, select_categories
from typing import Tuple, List, Dict, Any, Union
import logging
from datetime import datetime
from .diary_app.diary_logic import DiaryService
from .diary_app.diary_model import DiaryEntry

logging.basicConfig(
    level = logging.INFO,
    format = '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)

app = Flask(__name__)
CORS(app, supports_credentials=True)

# ------------Route-app-API----------------------------------------------------------------------
def parse_request(data: Dict[str, Any])-> Tuple[float, float, float, float, List[str]]:
    lat = float(data.get('lat', 36.6431))
    lon = float(data.get('lon', 138.1887))
    distance_km = float(data.get('distance', 3.0))
    lambda_score = float(data.get('lambda_score', 0.0))
    categories = data.get("categories",[])
    return lat, lon, distance_km, lambda_score, categories

def build_response(suggested_routes: List[Dict[str,Any]]) -> Union[Response, Tuple[Response, int]]:
    if not suggested_routes:
        return jsonify({"error": "ルートが見つかりませんでした"}), 404
    
    num_paths = len(suggested_routes)
    distances = [result['total_km'] for result in suggested_routes]
    return jsonify({
        "num_paths": num_paths,
        "distances": distances
    })

app.suggested_routes = []
@app.route('/generate-route', methods=['POST'])
def generate_route():
    logging.info("ルート生成リクエストを受け取りました")
    data = request.json
    lat, lon, distance_km, lambda_score , categories= parse_request(data)
    app.suggested_routes,_ = generate_routes(lat, lon, distance_km, lambda_score, categories)
    return build_response(app.suggested_routes)

@app.route('/select-route/<route_index>', methods=["GET"])
def select_route(route_index):
    try:
        index = int(route_index)
        routes = getattr(app, 'suggested_routes', [])
        if 0 <= index < len(routes):
            return jsonify({
                "path": routes[index]['path_positions'],
            })
        else:
            return jsonify({"error": "無効なルートインデックス"}), 400
    except ValueError:
        return jsonify({"error": "ルートインデックスは整数でなければなりません"}), 400

# ----------dialy-app-API------------------------------------------------------------------------- 
service = DiaryService()
@app.route("/diary/", methods=["GET"])
def list_entries():
    return jsonify([entry.model_dump() for entry in service.get_all()])

@app.route("/diary/<entry_id>", methods=["GET"])
def get_entry(entry_id):
    entry = service.get_entry(entry_id)
    if entry is None:
        return jsonify({"error": "Entry not found"}), 404
    return jsonify(entry.model_dump())

@app.route("/diary", methods=["POST"])
def create_entry():
    data = request.json
    try:
        # カテゴリ推論
        user_text = data["text"]
        categories, ai_comment = select_categories(user_text) or []

        # Entry作成
        entry = DiaryEntry(
            id=data["id"],
            text=user_text,
            created_at=datetime.now(),
            categories=categories,  # ←追加
            description = ai_comment
        )
        service.add_entry(entry)
        return jsonify(entry.model_dump()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/diary/<entry_id>", methods=["PUT"])
def update_entry(entry_id):
    data = request.json
    new_text = data.get("text")
    if not new_text:
        return jsonify({"error": "text is required"}), 400
    success = service.update_entry(entry_id, new_text)
    if not success:
        return jsonify({"error": "Entry not found"}), 404
    return jsonify({"message": "Entry updated"})

@app.route("/diary/<entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    success = service.delete_entry(entry_id)
    if not success:
        return jsonify({"error": "Entry not found"}), 404
    return jsonify({"message": "Entry deleted"})

