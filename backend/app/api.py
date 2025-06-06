from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from .route_service import generate_routes
from typing import Tuple, List, Dict, Any, Union
import networkx as nx

app = Flask(__name__)
CORS(app, supports_credentials=True)

def parse_request(data: Dict[str, Any])-> Tuple[float, float, float, float, List[str]]:
    lat = float(data.get('lat', 36.6431))
    lon = float(data.get('lon', 138.1887))
    distance_km = float(data.get('distance', 3.0))
    lambda_score = float(data.get('lambda_score', 0.0))
    theme = data.get('theme', None)
    if not theme:
        theme = ['default']
    return lat, lon, distance_km, lambda_score, theme

def build_response(suggested_routes: List[Dict[str,Any]]) -> Union[Response, Tuple[Response, int]]:
    if not suggested_routes:
        return jsonify({"error": "ルートが見つかりませんでした"}), 404
    
    best_route = suggested_routes[0]
    return jsonify({
        "num_paths": len(suggested_routes),
    })

app.suggested_routes = []
@app.route('/generate-route', methods=['POST'])
def generate_route():
    data = request.json
    lat, lon, distance_km, lambda_score, theme = parse_request(data)
    app.suggested_routes = generate_routes(lat, lon, distance_km, lambda_score, theme)
    return build_response(app.suggested_routes)

@app.route('/select-route/<route_index>', methods=["GET"])
def select_route(route_index):
    try:
        index = int(route_index)
        routes = getattr(app, 'suggested_routes', [])
        if 0 <= index < len(routes):
            return jsonify({
                "path": routes[index]['path_positions'],
                "mid_nodes": routes[index]['mid_nodes'],
                "distance": routes[index]['total_km']
            })
        else:
            return jsonify({"error": "無効なルートインデックス"}), 400
    except ValueError:
        return jsonify({"error": "ルートインデックスは整数でなければなりません"}), 400