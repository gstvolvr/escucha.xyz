import pandas as pd

def read():
    nodes_path = "static/data/2019-04-19/nodes/1216233971.bsv"
    edges_path = "static/data/2019-04-19/edges/1216233971.bsv"
    nodes = pd.read_csv(nodes_path, sep="|").to_dict(orient="records")
    edges = pd.read_csv(edges_path, sep="|").to_dict(orient="records")
    return nodes, edges
