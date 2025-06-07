import osmnx as ox
import networkx as nx

def get_walk_graph(lat: float, lon: float, dist: float=2000) -> nx.Graph:
    return ox.graph_from_point((lat, lon), dist=dist, network_type='walk')

def get_origin_node(G: nx.Graph, lat:float, lon:float) -> int:
    return ox.distance.nearest_nodes(G, X=lon, Y=lat)

