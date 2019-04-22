var width = 1600
var height = 1600

function explore(nodes, edges) {
  playlists = {}
  artists = {}
  var numPlaylists = 0
  nodes.forEach(node => {
    if (node["type"] == "playlist") {
      playlists[node["node_id"]] = { "name": node["node_name"], "artists": new Set([]) }
      numPlaylists += 1
    }
    else {
      artists[node["node_id"]] = { "name": node["node_name"] }
    }
  })

  edges.forEach(edge => {
    playlists[edge["playlist_id"]]["artists"].add(artists[edge["artist_id"]]["name"])
  })

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

  Object.entries(playlists)
    .sort((a, b) => {
      if (a[1]["name"].toLowerCase() > b[1]["name"].toLowerCase()) return 1
      else return -1
    })
    .forEach(d => console.log(d[1]["name"]))

  var rect = svg.selectAll("rect")
    .data(Object.entries(playlists).sort((a, b) => {
      if (a[1]["name"].toLowerCase() > b[1]["name"].toLowerCase()) return 1
      else return -1
    }))
    .enter()

  var perCol = Math.floor(numPlaylists / 2)
  var perPage = 40

  var rectW = 200
  var rectH = 20
  rect
    .append("rect")
    .attr("width", rectW)
    .attr("height", rectH)
    // .attr("fill", "black")
    .attr("x", (d, i) => (rectW * Math.floor(i / perCol)))
    .attr("y", (d, i) => (i % perCol) * 20)
    .on("mouseover", d => listArtists(d))
    .on("mouseout", removeArtists)

  rect.append("text")
    .attr("x", (d, i) => (rectW * Math.floor(i / perCol)))
    .attr("y", (d, i) => (i % perCol) * 20)
    .attr("dy", "1.35em")
    .attr("dx", "0.5em")
    .text(d => {
      if (d[1]["name"].length > 29) { return d[1]["name"].slice(0, 29).trim() + "..." }
      else return d[1]["name"]
    })

  function upTo(s, i) {
    if (s.length > i) return s.slice(0, i).trim() + "..."
    else return s
  }

  function listArtists(data) {
    var list = Array.from(data[1]["artists"]).sort()
    svg.selectAll(".artist")
      .data(list)
      .enter().append("text")
      .attr("class", "artist")
      .text(x => upTo(x, 30))
      .attr("x", (d, i) =>
        5 + rectW * Math.floor((i + numPlaylists) / perCol)
      )
      .attr("y", (d, i) =>
        15 + (i % perCol) * 15
      )
  }

  function removeArtists() {
    svg.selectAll(".artist").remove()
  }
}

// d3.dsv("|", "../data/2019-03-19/edges/gstvolvr").then(function(edges) {
//   d3.dsv("|", "../data/2019-03-19/nodes/gstvolvr.bsv").then(function(nodes) {
// d3.dsv("|", "../data/2019-03-17/edges/1246063284").then(function(edges) {
//   d3.dsv("|", "../data/2019-03-17/nodes/1246063284.bsv").then(function(nodes) {
//     explore(nodes, edges)
// })})
