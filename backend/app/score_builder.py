import osmnx as ox

def build_node_score_map(G, center_point, tag_score_list, dist=2000):
    node_score = {}
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