#!/usr/bin/env python
import flask
import os
import pandas as pd
import data
import json

base_dir = os.path.dirname(os.path.abspath(__file__))

app = flask.Flask(__name__)

@app.route('/')
def index():
    sample_nodes, sample_edges = data.read()
    edges = json.dumps(sample_edges)
    nodes = json.dumps(sample_nodes)
    user = { "nodes": nodes, "edges": edges }

    return flask.render_template("index.html", user=user)

@app.route('/favicon.ico')
def favicon():
    return ""

if __name__=='__main__':
    app.run(debug=True)
