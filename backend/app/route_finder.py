import networkx as nx
import random
from geopy.distance import geodesic

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

def find_loop(G, orig_node, target_distance_km, node_score, lambda_score, N=2):
    custom_weight = custom_weight_builder(node_score, lambda_score)
    best_path = None
    best_diff = float('inf')
    nodes = filter_far_nodes(G, orig_node, min_distance_m=400)
    for _ in range(10):
        nodes = filter_far_nodes(G, orig_node, min_distance_m=400)
        mid_nodes = [node for node in random.sample(nodes, N)]

        try:
            route_nodes = [orig_node] + mid_nodes + [orig_node]
            path = []
            for u, v in zip(route_nodes[:-1], route_nodes[1:]):
                segment = nx.astar_path(G, u, v, weight=custom_weight)
                path += segment if not path else segment[1:]

            total_length = sum([G.get_edge_data(u, v)[0]['length'] for u, v in zip(path[:-1], path[1:])])
            total_km = total_length / 1000.0

            diff = abs(total_km - target_distance_km)
            if diff < best_diff:
                best_path = path
                best_diff = diff
                best_mid_nodes = mid_nodes
        except:
            continue
    return best_path, best_diff, best_mid_nodes
