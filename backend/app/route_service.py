from .graph_builder import get_walk_graph, get_origin_node
from .score_builder import get_tag_score, build_node_score_map
from .route_finder import find_loop
from typing import Any, Dict, List
import logging

def generate_routes(lat: float, lon: float, distance_km: float, lambda_score: float, theme: List[str])-> List[Dict[str, Any]]:
    graph_dist = distance_km * 0.5 * 1000  # 目的距離/2[m]四方のグラフを生成
    G = get_walk_graph(lat, lon, graph_dist)
    orig_node = get_origin_node(G, lat, lon)
    tag_score_list = get_tag_score(theme)
    logging.info(f"これらのtagでルートを評価します　ー＞　{tag_score_list}")
    node_score = build_node_score_map(G, (lat, lon), tag_score_list, dist=graph_dist)
    
    suggested_routes = find_loop(G, orig_node, distance_km, node_score, lambda_score)
    return suggested_routes