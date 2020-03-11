// Dimensions of sunburst.
var weaponsWidth = 550;
var weaponsHeight = 400;
var radius = Math.min(weaponsWidth, weaponsHeight) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 140, h: 30, s: 4, t: 10
};

var colors = {
  "12": "#D2505E",
  "13": "#9d3c46",
  "14": "#dd7b86",
  "15": "#eebdc3",
  "16": "#f2cdd1",
  "17": "#405d98",
  "18": "#c5cee0",
  "19":"#8c9dc1",
  "20": "#334a79",
  "21": "#26375b",
  "alcohol": "#191970",
  "marijuana": "#5F9EA0",
  "cocaine": "#000080",
  "crack": "#1e2b3d",
  "heroin": "#3c4776",
  "hallucinogen": "#9aa3cc",
  "inhalant": "#d6604d",
  "painreliever": "#fcc0b1",
  "oxycontin": "#f99379",
  "tranquilizer": "#837482",
  "stimulant": "#5b515b",
  "meth": "#c1b9c0",
  "sedative": "#D0A3C1",
};


// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#sunburst-chart").append("svg:svg")
    .attr("width", weaponsWidth)
    .attr("height", weaponsHeight)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + weaponsWidth / 2 + "," + weaponsHeight / 2 + ")");

var x = d3.scaleLinear().range([0, 2 * Math.PI]);
var y = d3.scaleSqrt().range([0, radius]);

var partition = d3.partition()
    .size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

// Use d3.text and d3.csvParseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("https://raw.githubusercontent.com/UW-CSE442-WI20/FP-understanding-drug-abuse/master/static/sunburst-data.csv").then(function(text) {
    console.log("Fetched");
    var csv = d3.csvParseRows(text);
    var json = buildHierarchy(csv);
    createVisualization(json);
});

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  initializeBreadcrumbTrail();
  drawLegend();
  d3.select("#togglelegend").on("click", toggleLegend);

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // Turn the data into a d3 hierarchy and calculate the sums.
  var root = d3.hierarchy(json)
      .sum(function(d) { return d.size; });
      //.sort(function(a, b) { return b.value - a.value; });
  
  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition(root).descendants()
      .filter(function(d) {
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
      });

  var nodes = vis.data([json]).selectAll("path").data(nodes).enter()
  var path = nodes
      .append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("class", "slice")
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colors[d.data.name]; })
      .style("opacity", 1)
      .on("click", click)
      .on("mouseover", mouseover)
      .append("title")
          .text(function(d) {
            return "Click to zoom in";
        });



  // // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.datum().value;
 };
 
function getColor(d, i) {
    return colors[d.data.name];
}

function click(d) {
    var legendDomain = [];
    var legendRange = [];

    legendDomain.push("Total");
    legendRange.push("#872121");
    $(".slice").css("cursor", "auto");
    vis.select("#legendPie").remove();
    vis.transition()
    .duration(750)
    .tween("scale", function () {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
        yd = d3.interpolate(y.domain(), [d.y0, 1]),
        yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);

        return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
    })
    .selectAll("path")
    .each(function(d1, i) {
        if (d.depth == 0) {
          if (d1.depth != 0) {
            var color = getColor(d1, i);
            legendDomain.push(d1.data.name);
            legendRange.push(color);
          }
        } else if ((d1.depth == 2 && d1.parent.data.name === d.data.name)
                  || (d1.depth == 1 && d1.data.name === d.data.name)) {
            //|| (d.depth == 0 && d1.depth == 1)) {
          var color = getColor(d1, i);
          legendDomain.push(d1.data.name);
          legendRange.push(color);
        }
    })
    .attrTween("d", function (d) { return function () { return arc(d); }; })
    .select("title")
        .text(function(d) {
        if (d.depth == 0) {
            return "Click to zoom out";
        }

        if (d.depth == 1) {
            return "Click to zoom in";
        }
    });
    console.log("finished");
}


// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  // d3.select("#numkilled")
  //     .text(percentageString);

  // d3.select("#weapon-type")
  //   .text(d.data.name);

  d3.select("#explanation")
      .style("visibility", "");

  var sequenceArray = d.ancestors().reverse();
  sequenceArray.shift(); // remove root node from the array
  updateBreadcrumbs(sequenceArray, d.value + " people killed");

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);

}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#sequence")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .style("opacity", 1)
      .on("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  d3.select("#explanation")
      .style("visibility", "hidden");
}


function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", weaponsWidth)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#666");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var trail = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.data.name + d.depth; });

  // Remove exiting nodes.
  trail.exit().remove();

  // Add breadcrumb and label for entering nodes.
  var entering = trail.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors[d.data.name]; });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.data.name; });

  // Merge enter and update selections; set position for all nodes.
  entering.merge(trail).attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

//   Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

//   Make the breadcrumb trail visible, if it's hidden.
  d3.select("#sequence")
      .style("visibility", "");

}

function drawLegend() {

    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
    var li = {
      w: 75, h: 30, s: 3, r: 3
    };
  
    var legend = d3.select("#legend").append("svg:svg")
        .attr("width", li.w)
        .attr("height", d3.keys(colors).length * (li.h + li.s));
  
    var g = legend.selectAll("g")
        .data(d3.entries(colors))
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
                return "translate(0," + i * (li.h + li.s) + ")";
             });
  
    g.append("svg:rect")
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .style("fill", function(d) { return d.value; });
  
    g.append("svg:text")
        .attr("x", li.w / 2)
        .attr("y", li.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.key; });
}
  
function toggleLegend() {
    var legend = d3.select("#legend");
    if (legend.style("visibility") == "hidden") {
        legend.style("visibility", "");
    } else {
        legend.style("visibility", "hidden");
    }
}
  


// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};