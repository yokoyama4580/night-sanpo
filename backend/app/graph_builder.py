import osmnx as ox

def get_walk_graph(lat, lon, dist=2000):
    return ox.graph_from_point((lat, lon), dist=dist, network_type='walk')

def get_origin_node(G, lat, lon):
    return ox.distance.nearest_nodes(G, X=lon, Y=lat)

