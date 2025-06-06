#route_service.py

from .graph_builder import get_walk_graph, get_origin_node
from .score_builder import build_node_score_map
from .route_finder import find_loop
from .suggest_theme import predict_categories, get_tag_score_list
from typing import Any, Dict, List
import logging

def generate_routes(lat: float, lon: float, distance_km: float, lambda_score: float, user_input: str)-> List[Dict[str, Any]]:
    graph_dist = distance_km * 0.5 * 1000  # 目的距離/2[m]四方のグラフを生成
    G = get_walk_graph(lat, lon, graph_dist)
    orig_node = get_origin_node(G, lat, lon)
    categories = predict_categories(user_input)
    logging.info(f"選ばれたカテゴリ{categories}")
    tag_score_list = get_tag_score_list(categories)
    logging.info(f"これらのtagでルートを評価します　ー＞　{tag_score_list}")
    node_score = build_node_score_map(G, (lat, lon), tag_score_list, dist=graph_dist)
    logging.info(f"ルート生成開始．．．")
    suggested_routes = find_loop(G, orig_node, distance_km, node_score, lambda_score)
    logging.info(f"ルート生成完了！！！  生成されたルートの数：{len(suggested_routes)}")
    return suggested_routes,G