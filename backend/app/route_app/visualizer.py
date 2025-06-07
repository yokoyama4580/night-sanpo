import osmnx as ox
import matplotlib.pyplot as plt
import networkx as nx
from typing import List
import pandas as pd
import matplotlib.colors as mcolors

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

def categorize_row(row, tag_dict):
    for key, values in tag_dict.items():
        if key in row and pd.notna(row[key]) and row[key] in values:
            return f"{key}:{row[key]}"
    return "other"

def plot_paths(G,short_path,custom_path,gdf,tags):
    fig, ax = ox.plot_graph_routes(G, [short_path,custom_path], 
                                route_colors=['blue', 'red'], 
                                route_linewidth=2, 
                                node_size=0, bgcolor='white', 
                                show=False, close=False)

    gdf['category'] = gdf.apply(lambda row: categorize_row(row, tags), axis=1)

    unique_categories = gdf['category'].unique()
    colors = list(mcolors.TABLEAU_COLORS.values()) + list(mcolors.CSS4_COLORS.values())

    color_map = {cat: colors[i % len(colors)] for i, cat in enumerate(unique_categories)}
    gdf['color'] = gdf['category'].map(color_map)
    
    
    for category, group in gdf.groupby('category'):
        group.plot(ax=ax, color=group['color'].iloc[0], markersize=15, label=category, alpha=0.7)

    ax.legend(loc='lower left', fontsize=8)
    plt.show()