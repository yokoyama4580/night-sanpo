import osmnx as ox
import matplotlib.pyplot as plt
import networkx as nx
from typing import List

def plot_path_on_graph(G: nx.Graph, path: List[int], show: bool = True, save_path: str = None) -> None:
    """
    与えられたノードIDのpathに基づいてグラフ上にルートを描画します。
    
    Parameters:
        G (nx.Graph): OSMnxで生成されたグラフ
        path (List[int]): ノードIDの順列（ルート）
        show (bool): その場で表示するか（True）または保存のみ（False）
        save_path (str): 画像ファイルとして保存したい場合のパス（例: "route.png"）
    """
    fig, ax = ox.plot_graph_route(
        G,
        route=path,
        route_color='green',
        route_linewidth=3,
        node_size=0,
        show=False,
        close=False,
        bgcolor='white'
    )

    if save_path:
        fig.savefig(save_path, bbox_inches='tight')
    if show:
        plt.show()
    else:
        plt.close(fig)
