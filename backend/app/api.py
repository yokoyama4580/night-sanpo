from flask import Flask, request, jsonify
from flask_cors import CORS
from .graph_builder import get_walk_graph, get_origin_node
from .score_builder import build_node_score_map
from .route_finder import find_loop
from .tag_presets import preset_map

app = Flask(__name__)
CORS(app)

@app.route('/generate-route', methods=['POST'])
def generate_route():
    data = request.json
    lat = data.get('lat', 36.6431)
    lon = data.get('lon', 138.1887)
    distance_km = data.get('distance', 3.0)
    lambda_score = data.get('lambda_score', 0.0)
    theme = data.get('theme', [])

    graph_dist = distance_km * 500
    G = get_walk_graph(lat, lon, graph_dist)
    orig_node = get_origin_node(G, lat, lon)

    tag_score_list = preset_map.get(theme[0])
    node_score = build_node_score_map(G, (lat, lon), tag_score_list, dist=graph_dist)

    print("ルート生成中...")
    best_path, total_km, best_mid_nodes = find_loop(G, orig_node, distance_km, node_score, lambda_score)
    best_pos_list = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in best_path]

    if best_path:
        return jsonify({
            "path": best_pos_list,
            "mid_nodes": best_mid_nodes,
            "distance": round(total_km, 2)
        })
    else:
        return jsonify({"error": "ルートが見つかりませんでした"}), 404
