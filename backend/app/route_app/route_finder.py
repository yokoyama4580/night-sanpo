# route_finder.py

import networkx as nx
import random
from geopy.distance import geodesic
from itertools import combinations
import math
from shapely.geometry import Polygon
from pyproj import Geod
from typing import Dict, Any, Callable, List, Tuple
import logging

geod = Geod(ellps="WGS84")  

def custom_weight_builder(node_score: Dict[int,int], lambda_score: float) -> Callable:
    def custom_weight(u:int, v:int, data:Dict[str,Any]) -> float:
        base_cost = data.get('length', 1.0)
        bonus = node_score.get(v, 0) + node_score.get(u, 0)
        return max(0.0, base_cost - lambda_score * bonus)
    return custom_weight

def filter_far_nodes(G: nx.Graph, orig_node: int, min_distance_m: float=400) -> List[int]:
    ox, oy = G.nodes[orig_node]['x'], G.nodes[orig_node]['y']
    far_nodes = []
    for node in G.nodes:
        x, y = G.nodes[node]['x'], G.nodes[node]['y']
        dist = geodesic((oy, ox), (y, x)).meters
        if dist >= min_distance_m:
            far_nodes.append(node)
    return far_nodes

def angle_between_nodes(node1: Tuple[float,float], node2: Tuple[float, float], origin: Tuple[float, float]) -> float:
    # node = (lat, lon)
    vec1 = (node1[0] - origin[0], node1[1] - origin[1])
    vec2 = (node2[0] - origin[0], node2[1] - origin[1])

    # 内積とノルム
    dot = vec1[0]*vec2[0] + vec1[1]*vec2[1]
    norm1 = math.hypot(*vec1)
    norm2 = math.hypot(*vec2)
    
    # コサインから角度を算出（0〜180度）
    cos_theta = dot / (norm1 * norm2 + 1e-8)
    cos_theta = max(-1.0, min(1.0, cos_theta))  # 安全性のためクランプ
    angle_rad = math.acos(cos_theta)
    return math.degrees(angle_rad)

def average_angle_diversity(G: nx.Graph ,mid_nodes: List[int], origin: Tuple[float, float]) -> float:
    angles = []
    for n1, n2 in combinations(mid_nodes, 2):
        node1 = (G.nodes[n1]['y'], G.nodes[n1]['x'])
        node2 = (G.nodes[n2]['y'], G.nodes[n2]['x'])
        angle = angle_between_nodes(node1, node2, origin)
        angles.append(angle)
    return sum(angles) / len(angles) if angles else 0

def compute_route_area(path_positions: List[Tuple[float,float]]) -> float:
    if len(path_positions) < 3:
        return 0.0
    lons, lats = zip(*[(lon, lat) for lat, lon in path_positions])#緯度，経度の順に入れ替えてアンジップ
    area, _ = geod.polygon_area_perimeter(lons, lats)
    return abs(area)

def score_route(total_km: float, target_km: float, angle:float, angle_threshold: float, area:float, area_threshold:float) -> float:
    diff = abs(total_km -target_km)
    angle_penalty = max(0, angle_threshold - angle) * 0.5
    area_penalty = max(0, area_threshold - area) * 0.5 / 1000
    return diff + angle_penalty + area_penalty

def extract_geometry_path(G: nx.Graph, path: List[int]) -> List[Tuple[float,float]]:
    coords=[]
    for u, v in zip(path[:-1],path[1:]):
        edge_data = G.get_edge_data(u,v)[0]
        if 'geometry' in edge_data:
            edge_coords = list(edge_data['geometry'].coords)
        else:
            edge_coords = [(G.nodes[u]['x'], G.nodes[u]['y']), (G.nodes[v]['x'],G.nodes[v]['y'])]
        if not coords:
            coords.extend(edge_coords)
        else:
            coords.extend(edge_coords[1:])
    return[(y,x)for x,y in coords]

def find_loop(G: nx.Graph, orig_node: int, target_distance_km: float, node_score: Dict[int,int], lambda_score: float, N: int=2, debug: bool=False) -> List[Dict[str,Any]]:
    custom_weight = custom_weight_builder(node_score, lambda_score)
    nodes = filter_far_nodes(G, orig_node, min_distance_m=target_distance_km * 25)
    route_suggestions = []
    area_threshold = 20000 * target_distance_km**2  # 最小面積の閾値（平方メートル）
    angle_threshold = 60
    for _ in range(100): # 100回試行
        mid_nodes = [node for node in random.sample(nodes, N)]
        try:
            route_nodes = [orig_node] + mid_nodes + [orig_node]
            path,short_path = [],[]
            for u, v in zip(route_nodes[:-1], route_nodes[1:]):
                segment = nx.astar_path(G, u, v, weight=custom_weight)
                path += segment if not path else segment[1:]
                if debug:
                    short_seg = nx.astar_path(G, u, v, weight="length")
                    short_path += short_seg if not short_path else short_seg[1:] 
            path_positions = extract_geometry_path(G, path)

            total_length = sum([G.get_edge_data(u, v)[0]['length'] for u, v in zip(path[:-1], path[1:])])
            total_km = total_length / 1000.0
            angle = average_angle_diversity(G, mid_nodes, (G.nodes[orig_node]['y'], G.nodes[orig_node]['x']))
            area = compute_route_area(path_positions)

            score = score_route(total_km, target_distance_km, angle, angle_threshold, area, area_threshold)
            result = {
                'path_positions': path_positions,
                'path_nodeids': path,
                'short_path_nodeids': short_path,
                'total_km': round(total_km, 3),
                'mid_nodes': mid_nodes,
                'score': round(score, 3)
            }
            route_suggestions.append(result)
            route_suggestions.sort(key=lambda x: x['score']) # 小さいほどいい
        except Exception as e:
            logging.error(f"ルートの生成に失敗しました{e}")
            continue
    return route_suggestions[:5] if len(route_suggestions) > 5 else route_suggestions
