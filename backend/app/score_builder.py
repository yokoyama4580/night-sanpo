import osmnx as ox
import networkx as nx
from typing import Tuple, Dict, List

def build_node_score_map(G: nx.Graph, center_point: Tuple[float, float], tag_score_list: List[Dict], dist: float=2000) -> Dict[int, int]:
    node_score = {}
    if not tag_score_list:
        print("タグスコアリストが空です。")
        return node_score
    for tags, score in tag_score_list:
        try:
            gdf = ox.features.features_from_point(center_point, tags=tags, dist=dist)
            for _, row in gdf.iterrows():
                try:
                    node = ox.distance.nearest_nodes(G, row.geometry.x, row.geometry.y)
                    node_score[node] = node_score.get(node, 0) + score
                except:
                    continue
        except Exception as e:
            print(f"タグ {tags} の取得に失敗: {e}")
    return node_score