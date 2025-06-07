from app.route_app.route_service import generate_routes,select_categories
from app.route_app.visualizer import plot_paths
import logging

logging.basicConfig(
    level = logging.INFO,
    format = '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)
if __name__ == "__main__":
    center_point = (35.681236, 139.767125)
    dist=1.5
    l = 0.3
    user_input = """今日は朝から頭が重くて、人混みや騒音がすごくつらかった。
少しでも静かで緑のある場所に行って、ゆっくり歩いて気分をリセットしたい。
できればベンチに座って水の流れでも眺めたい。"""
    categories,comment = select_categories(user_input)
    print(categories)
    print(comment)
    suggested_route,map_objects = generate_routes(center_point[0],center_point[1],dist,l,categories=categories,debug=True)
