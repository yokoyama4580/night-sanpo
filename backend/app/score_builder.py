import osmnx as ox
import networkx as nx
from .tag_presets import preset_map
import logging
from typing import Tuple, Dict, List,Any
from collections import defaultdict

def get_tag_score(theme):
    return [ts for t in theme for ts in preset_map.get(t, [])]

def merge_tags_for_overpass(tag_score_list: List[Tuple[Dict[str, Any], int]]) -> Dict[str, Any]:
    tag_map = defaultdict(set)
    for tags, _ in tag_score_list:
        for key, value in tags.items():
            tag_map[key].add(value)

    # Overpass API は list[str] も受け取れる
    return {k: list(vs) if len(vs) > 1 else list(vs)[0] for k, vs in tag_map.items()}

def build_node_score_map(G: nx.Graph, center_point: Tuple[float, float], tag_score_list: List[Tuple[Dict,int]], dist: float=2000) -> Dict[int, int]:
    node_score = {}
    if not tag_score_list:
        logging.warning(f"tag_score_listが空です{tag_score_list}")
        return node_score
    unique_tags = merge_tags_for_overpass(tag_score_list)
    try:
        gdf = ox.features.features_from_point(center_point, tags=unique_tags, dist=dist)
    except Exception as e:
        logging.error(f"Overpass APIからの取得に失敗: {e}")
        return node_score
    for _, row in gdf.iterrows():
        try:
            node = ox.distance.nearest_nodes(G, row.geometry.x, row.geometry.y)
        except Exception as e:
            continue
        for tags, score in tag_score_list:
            if all(row.get(k) == v for k, v in tags.items()):
                node_score[node] = node_score.get(node, 0) + score
    return node_score