import matplotlib.pyplot as plt
import osmnx as ox

def visualize_midpoints(G, orig_node, mid_nodes, full_path=None, gdf=None, gdf_color='purple', gdf_label='POI'):
    node_colors = ['#cccccc'] * len(G.nodes)
    node_sizes = [1] * len(G.nodes)

    node_id_list = list(G.nodes)
    node_idx = {node_id: i for i, node_id in enumerate(node_id_list)}

    for mid in mid_nodes:
        if mid in node_idx:
            idx = node_idx[mid]
            node_colors[idx] = 'red'
            node_sizes[idx] = 50

    if orig_node in node_idx:
        idx = node_idx[orig_node]
        node_colors[idx] = 'blue'
        node_sizes[idx] = 80

    fig, ax = ox.plot_graph(G,
                            node_color=node_colors,
                            node_size=node_sizes,
                            edge_color='#999999',
                            bgcolor='white',
                            show=False,
                            close=False)

    if full_path:
        ox.plot_graph_route(G, full_path, route_color='green', route_linewidth=3, ax=ax, show=False, close=False)

    if gdf is not None and not gdf.empty:
        gdf.plot(ax=ax, color=gdf_color, markersize=20, label=gdf_label)

    plt.legend()
    plt.show()