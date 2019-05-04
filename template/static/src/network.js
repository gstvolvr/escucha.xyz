function graph(className) {
  console.log(className)
  links =  [
    { "source": "a", "target": "b" },
    { "source": "a", "target": "c" },
    { "source": "a", "target": "d" },
    { "source": "e", "target": "f" },
    { "source": "e", "target": "g" },
    { "source": "h", "target": "i" },
    { "source": "h", "target": "j" },
    { "source": "h", "target": "k" },
    { "source": "l", "target": "m" },
    { "source": "l", "target": "n" }
  ]

  var nodes = {}
  links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source})
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target})
  })

  var width = 150;
  var height = 150;
  // var svg = d3.select(".left-container").append("svg")
  var svg = d3.select(className).append("svg")
    .attr("width", "100%")
    .attr("height", "100%")

  var force = d3.forceSimulation()
    .nodes(d3.values(nodes))
    .force("link", d3.forceLink(links).distance(10))
    .force('center', d3.forceCenter(width, height))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("charge", d3.forceManyBody().strength(-250))
    // .alphaTarget(1)
    .on("tick", tick)

  var link = svg.append("g")
    .selectAll("link")
    .data(links)
    .enter()
    .insert("line", ".node")
    .attr("class", "line")
    .attr("x1", function(d) { return d.source.x })
    .attr("y1", function(d) { return d.source.y })
    .attr("x2", function(d) { return d.target.x })
    .attr("y2", function(d) { return d.target.y })

  var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    .attr("fill", "white")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
     )
    .append("circle")
    .attr("r", 5)

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
  };

  // node.append("circle")
  //     .attr("r", 5)
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
  };
}
