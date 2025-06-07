from backend.app.route_app.route_service import generate_routes
from backend.app.route_app.visualizer import plot_paths
import logging

logging.basicConfig(
    level = logging.INFO,
    format = '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)
if __name__ == "__main__":
    center_point = (36.6435, 138.1880)
    dist=3.0
    l = 0.3
    user_input = """今日は朝から頭が重くて、人混みや騒音がすごくつらかった。
少しでも静かで緑のある場所に行って、ゆっくり歩いて気分をリセットしたい。
できればベンチに座って水の流れでも眺めたい。"""
    suggested_routes,map_objects = generate_routes(center_point[0],center_point[1],dist,l,user_input,debug=True)
    G,gdf,tags=map_objects
    print(tags)
    for i in range(5):
        plot_paths(G,suggested_routes[i]["short_path_nodeids"],suggested_routes[i]["path_nodeids"],gdf,tags)

    # for suggest in suggested_route:
    #     plot_paths(G,suggest['short_path_nodeids'],suggest['path_nodeids'])