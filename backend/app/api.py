from flask import Flask, request, jsonify
from flask_cors import CORS
from .graph_builder import get_walk_graph, get_origin_node
from .score_builder import build_node_score_map
from .route_finder import find_loop
from .tag_presets import preset_map

app = Flask(__name__)
CORS(app, supports_credentials=True)

suggested_routes = []
@app.route('/generate-route', methods=['POST'])
def generate_route():
    global suggested_routes
    suggested_routes = []
    print("ルート生成リクエストを受信しました")
    data = request.json
    lat = data.get('lat', 36.6431)
    lon = data.get('lon', 138.1887)
    distance_km = float(data.get('distance', 3.0))
    lambda_score = data.get('lambda_score', 0.0)
    theme = data.get('theme')
    if not theme:
        print("テーマが指定されていません. デフォルトのテーマを使用します。")
        theme = ['default']
    print(f"Received data: lat={lat}, lon={lon}, distance={distance_km}, lambda_score={lambda_score}, theme={theme}")
    graph_dist = distance_km * 500
    G = get_walk_graph(lat, lon, graph_dist)
    orig_node = get_origin_node(G, lat, lon)

    tag_score_list = preset_map.get(theme[0])
    node_score = build_node_score_map(G, (lat, lon), tag_score_list, dist=graph_dist)

    print("ルート生成中...")
    suggested_routes = find_loop(G, orig_node, distance_km, node_score, lambda_score)
    print(f"生成されたルート数{len(suggested_routes)}")

    if suggested_routes:
        best_route = suggested_routes[0]
        return jsonify({
            "path": best_route['path_positions'],
            "num_paths": len(suggested_routes),
            "mid_nodes": best_route['mid_nodes'],
            "distance": best_route['total_km']
        })
    else:
        return jsonify({"error": "ルートが見つかりませんでした"}), 404
    
@app.route('/select-route/<route_index>', methods=["GET"])
def select_route(route_index):
    global suggested_routes
    print(f"ルート選択リクエストを受信: インデックス {route_index}/ {len(suggested_routes)}")
    try:
        index = int(route_index)
        if 0 <= index < len(suggested_routes):
            selected_route = suggested_routes[index]
            return jsonify({
                "path": selected_route['path_positions'],
                "mid_nodes": selected_route['mid_nodes'],
                "distance": selected_route['total_km']
            })
        else:
            print(f"無効なルートインデックス: {index}")
            return jsonify({"error": "無効なルートインデックス"}), 400
    except ValueError:
        print("ルートインデックスは整数でなければなりません")
        return jsonify({"error": "ルートインデックスは整数でなければなりません"}), 400