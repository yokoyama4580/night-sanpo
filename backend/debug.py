from app.route_service import generate_routes
from app.visualizer import plot_path_on_graph
import logging

logging.basicConfig(
    level = logging.INFO,
    format = '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)
if __name__ == "__main__":
    center_point = (35.681236, 139.767125)
    dist=1.5
    l = 0.3
    user_input = "今日は静かで自然の多い場所を歩きたい"
    suggested_route,G = generate_routes(center_point[0],center_point[1],dist,l,user_input)
    for suggest in suggested_route:
        plot_path_on_graph(G,suggest["path_nodeids"])