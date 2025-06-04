import networkx as nx
import random
from geopy.distance import geodesic
from itertools import combinations
import math

def custom_weight_builder(node_score, lambda_score):
    def custom_weight(u, v, data):
        base_cost = data.get('length', 1.0)
        bonus = node_score.get(v, 0) + node_score.get(u, 0)
        return base_cost - lambda_score * bonus
    return custom_weight

def filter_far_nodes(G, orig_node, min_distance_m=400):
    ox, oy = G.nodes[orig_node]['x'], G.nodes[orig_node]['y']
    far_nodes = []
    for node in G.nodes:
        x, y = G.nodes[node]['x'], G.nodes[node]['y']
        dist = geodesic((oy, ox), (y, x)).meters
        if dist >= min_distance_m:
            far_nodes.append(node)
    return far_nodes

def angle_between_nodes(node1, node2, origin):
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

def average_angle_diversity(G,mid_nodes, origin):
    angles = []
    for n1, n2 in combinations(mid_nodes, 2):
        node1 = (G.nodes[n1]['y'], G.nodes[n1]['x'])
        node2 = (G.nodes[n2]['y'], G.nodes[n2]['x'])
        angle = angle_between_nodes(node1, node2, origin)
        angles.append(angle)
    return sum(angles) / len(angles) if angles else 0

def find_loop(G, orig_node, target_distance_km, node_score, lambda_score, N=2):
    custom_weight = custom_weight_builder(node_score, lambda_score)
    best_path = None
    best_diff = float('inf')
    nodes = filter_far_nodes(G, orig_node, min_distance_m=target_distance_km * 25)
    route_suggestions = []
    for _ in range(500): # 500回試行
        mid_nodes = [node for node in random.sample(nodes, N)]
        angle = average_angle_diversity(G, mid_nodes, (G.nodes[orig_node]['y'], G.nodes[orig_node]['x']))
        angle_penalty = max(0, 60 - angle) 
        try:
            route_nodes = [orig_node] + mid_nodes + [orig_node]
            path = []
            for u, v in zip(route_nodes[:-1], route_nodes[1:]):
                segment = nx.astar_path(G, u, v, weight=custom_weight)
                path += segment if not path else segment[1:]
            path_positions = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in path]

            total_length = sum([G.get_edge_data(u, v)[0]['length'] for u, v in zip(path[:-1], path[1:])])
            total_km = total_length / 1000.0

            diff = abs(total_km - target_distance_km)
            score = diff + 0.5 * angle_penalty
            result = {
                'path': path,
                'path_positions': path_positions,
                'total_km': round(total_km, 3),
                'diff': round(diff, 3),
                'mid_nodes': mid_nodes,
                'angle': round(angle, 3),
                'score': round(score, 3)
            }
            route_suggestions.append(result)
            route_suggestions.sort(key=lambda x: x['score']) # 小さいほどいい
        except:
            continue
    return route_suggestions[:5] if len(route_suggestions) > 5 else route_suggestions
