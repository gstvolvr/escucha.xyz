var width = 1600
var height = 800

var artistGraph = function(rnodes, edges) {
  var nodes = {}
  these_nodes = new Set()

  edges.forEach(function(e) {
    these_nodes.add(e.playlist_id)
    these_nodes.add(e.artist_id)
  })
  var playlistMap = {}

  var nodeCount = 0
  var playlistCount = 1
  rnodes.forEach(function(node) {
    if (these_nodes.has(node.node_id)) {
      nodes[node.node_id] = node
      nodeCount += 1
    }

    if (node.type == "playlist") {
      playlistMap[node.node_id] = playlistCount
      node["playlist_index"] = playlistCount
      playlistCount += 1
    }
  })
  edges.forEach(function(edge) {
      edge.source = nodes[edge.playlist_id] ||
          (nodes[edge.playlist_id] = {})
      edge.target = nodes[edge.artist_id] ||
          (nodes[edge.artist_id] = {})

      // group each artist with the last playlist they show up in
      nodes[edge.artist_id]["playlist_index"] = playlistMap[edge.playlist_id]
  })
  console.log(nodes)

  var centerX = width / 2
  var centerY = height / 2
  var artistR = 3
  var playlistR = 7
  var outerR = 300
  var innerR = 85

  function xC(d, r) {
    var artistGap = 360 / nodeCount
    var playlistGap = 360 / playlistCount
    var zeta = d.type == "playlist" ? d.playlist_index * (playlistGap + playlistR) + playlistR : d.playlist_index * (playlistGap + playlistR)
    return r * Math.sin(zeta) + centerX
  }

  function yC(d, r) {
    var artistGap = 360 / nodeCount
    var playlistGap = 360 / playlistCount
    var zeta = d.type == "playlist" ? d.playlist_index * (playlistGap + playlistR) + playlistR : d.playlist_index * (playlistGap + playlistR)
    return r * Math.cos(zeta) + centerY
  }

  var force = d3.forceSimulation()
    // .velocityDecay(0.9)
    .nodes(d3.values(nodes))
    .force("charge", d3.forceManyBody().strength(function(d) { return -5}))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink().links(edges).distance(120))
    // .force("r", d3.forceRadial(function(d) { return d.type === "artist" ? 500 + d.index : 0 }))
    // .force("x", d3.forceX().x(d => d.type == "artist" ? xC(d, outerR) : xC(d, innerR)))
    // .force("y", d3.forceY().y(d => d.type == "artist" ? yC(d, outerR) : yC(d, innerR)))
    .force("collide", d3.forceCollide().radius(function(d) { return 8 }))

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)

  var link = svg.append("g")
      .selectAll("link")
      .data(edges)
      .enter()
      .insert("line", ".node")
      .attr("class", "line")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })

  var node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
       )
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .on("dblclick", stayputordont)

  var maxDegree = Math.max(...Object.values(nodes).map(d => parseInt(d["playlist_degree"])))
  var scale = d3.scaleLinear().domain([0, maxDegree])

  color = d3.scaleSequential(d3.interpolateYlOrRd)

  node.append("svg:circle")
    .attr("r", function(d) {
      if (d["node_name"].toLowerCase() == "ferreck dawn") return artistR + 30
      if (d["node_name"].toLowerCase() == "odesza") return artistR + 30
      if (d["node_name"].toLowerCase() == "zyra") return artistR + 30
      if (d["type"] == "artist") return artistR + scale(d["playlist_degree"]) * 10
      else return playlistR
    })
    .attr("fill", function(d) {
      if (d["type"] == "artist") return color(d.playlist_index * 1.0 / playlistCount)
      else return color(d.playlist_index * 1.0 / playlistCount)
    })
    .style("stroke-width", d => {
      if (d["type"] == "playlist") return 3.0
      else return 1.5
    })
    .append("svg:title")
    .text(d => d.node_name)
    .style("font-weight", function(d) {
      if (d["type"] == "playlist") return "bold"
    })

  node.append("text")
    .text(d => {
      if (d["type"] == "playlist") return d.node_name
      if (d["node_name"].toLowerCase() == "ferreck dawn") return d.node_name
      if (d["node_name"].toLowerCase() == "odesza") return d.node_name
      if (d["node_name"].toLowerCase() == "zyra") return d.node_name
    })
    // .attr("dx", d => d.dx )
    // .attr("dy", d => d.dy * .9)
    .style("font-size", function(d) {
      if (d["type"] == "artist") return 10
    })
    .style("font-weight", function(d) {
      if (d["type"] == "playlist") return "bold"
    })


  force.on("tick", () => {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        // .style("stroke", "#c5ccd1")
        .style("stroke-width", "0.75px")

    node
        .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; })
  })
  function dragstarted(d) {
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      };

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  function dragended(d) {
    if (!d3.event.active) force.alphaTarget(0);
    if (d.fixed == true){
       d.fx = d.x;
       d.fy = d.y;
    }
    else {
      d.fx = null;
      d.fy = null;
    }
  }
  function stayputordont(d) {
    d.fixed = !d.fixed
    // if (d.fixed) d3.select(this).select("text")
    //   .transition()
    //   // .style("font-weight", "bold")
    // else d3.select(this)
    //   .select("text")
    //   .transition()
      // .style("font-weight", "normal")
  }
}

// d3.json("/edges", function(edges) {
//   console.log(edges)
// })
// d3.json("/nodes", function(nodes) {
//   console.log(nodes)
// })
