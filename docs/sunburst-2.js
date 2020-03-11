var PIE_CANVAS_HEIGHT = $('.sunburst-chart-svg').height();
var PIE_CANVAS_WIDTH = $('.sunburst-chart-svg').width();
var PIE_RADIUS;
var PIE_INNER_RADIUS;
var CENTER_PIE_RADIUS;
var executeSunburst;
var viz;
var zoomFlag = false;

(function () {
  var CANVAS_CLASS_ID = ".sunburst-chart-svg";

  // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
  // Change width to change length of each breadcrumb
  var PIE_BREAD_DIM = {
    WIDTH: 230, HEIGHT: 30, SPACING: 3, TAIL: 10
  };

  var PIE_TOTAL_COLOR = "#808080";

  var colormap = {
    "Total": PIE_TOTAL_COLOR,
    "12": "#8cb3d9",
    "13": "#79a6d2",
    "14": "#6699cc",
    "15": "#538cc6",
    "16": "#4080bf",
    "17": "#3973ac",
    "18": "#336699",
    "19": "#2d5986",
    "20": "#264d73",
    "21": "#204060",
    "alcohol": "#91130a",
    "marijuana": "#a31a10",
    "cocaine": "#b5251b",
    "crack": "#e60000",
    "heroin": "#d13126",
    "hallucinogen": "#d94338",
    "inhalant": "#590a04",
    "painreliever": "#700b04",
    "oxycontin": "#820b03",
    "tranquilizer": "#ff3021",
    "stimulant": "#e0544a",
    "meth": "#f2746b",
    "sedative": "#e3918a",
  }

  var NON_COLORS = [
    "#bdd7e7", "#eff3ff","#cbc9e2", "#f2f0f7", "#fdbe85", "#feedde", "#c7e9c0", "#edf8e9", "#fbb4b9","#feebe2"
  ];

  // Initializing variables and canvas
  // =================================
  executeSunburst = function () {
      // Canvas dimensions
      PIE_RADIUS = Math.min(PIE_CANVAS_WIDTH, PIE_CANVAS_HEIGHT) / 1.75;
      PIE_INNER_RADIUS = PIE_RADIUS * 49 / 60;

      CENTER_PIE_RADIUS = PIE_RADIUS * 15 / 26;
      createSunburst();
  };

  var createSunburst = function() { 
      viz = d3.select(CANVAS_CLASS_ID).append("svg")
      .attr("width", PIE_CANVAS_WIDTH)
      .attr("height", PIE_CANVAS_HEIGHT)
      .append("g")
      .attr("id", "sunburst-container")
      .attr("transform", "translate(" + (PIE_CANVAS_WIDTH - 200) / 2 + ","
                                      + PIE_CANVAS_HEIGHT / 2 + ")");

      d3.text("https://raw.githubusercontent.com/UW-CSE442-WI20/FP-understanding-drug-abuse/master/static/sunburst-data.csv").then(function(text) {
          console.log("Fetched");
          var csv = d3.csvParseRows(text);
          var json = buildHierarchy(csv);
          createVisualization(json);
      });                              
      initializeBreadcrumbTrail();
  };


  // Take a 2-column CSV and transform it into a hierarchical structure suitable
  // for a partition layout. The first column is a sequence of step names, from
  // root to leaf, separated by hyphens. The second column is a count of how 
  // often that sequence occurred.
  function buildHierarchy(csv) {
      var root = {"name": "Total", "children": []};
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



  // Functions for creating sunburst
  // ==============================
  var createVisualization = function(data) { 
    var radius = PIE_INNER_RADIUS;
    var x = d3.scaleLinear().range([0, 2 * Math.PI]);
    var y = d3.scaleSqrt().range([0, radius]);
    var partition = d3.partition();

    var arc = d3.arc()
      .startAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
      })
      .endAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
      })
      .innerRadius(function (d) {
        return Math.max(0, y(d.y0));
      })
      .outerRadius(function(d) {
        return Math.max(0, y(d.y1));
      });

    var root = d3.hierarchy(data)
                .sum(function(d) { return d.size; })
                .sort(function(a, b) { return b.value - a.value; });
    var nodes = partition(root).descendants();
    var legendMap = {};
    var path = viz.selectAll("path")
        .data(nodes)
        .enter().append("path")
        .attr("d", arc)
        .attr("class", "slice")
        .attr("id", function(d) {
            return "viz" + d.data.name.replace(new RegExp("[\\.|\\s\\+|/]", "g"),"-");
        })
        .style("stroke", "fff")
        .style("fill", function (d, i) { 
            var color = getColor(d, i);
            legendMap[d.data.name] = color;    
            return color;
        })
        .on("click", click)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .append("title")
            .text(function(d) {
              if (d.depth == 1) {
                  return "Click to zoom in";
              }
        });

    drawLegend(legendMap);

    function drawLegend(legendMap) {
      // Dimensions of legend item: width, height, spacing, radius of rounded rect.
      var li = {
        w: 120, h: 20, s: 3, r: 3
      };

      viz.append("g")
        .attr("id", "legendPie")
        .attr("transform", "translate(" + (PIE_RADIUS  + 30) + ",-" + (PIE_RADIUS - 60) + ")");
      
      $("#legendPie").empty();
    
      var legend = d3.select("#legendPie").append("svg:svg")
          .attr("width", li.w)
          .attr("height", d3.keys(legendMap).length * (li.h + li.s));
    
      var g = legend.selectAll("g")
          .data(d3.entries(legendMap))
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
                  return "translate(0," + i * (li.h) + ")";
                });
    
      g.append("svg:text")
          .attr("dy", "1em")
          .attr("text-anchor", "left")
          .style("fill", function(d) { return d.value; })
          .text(function(d) { return d.key; })
    }

    function click(d) {
      var legendMap = {};
      legendMap["Total"] = PIE_TOTAL_COLOR;

      if (d.depth != 2) {
        zoomFlag = d.depth == 0 ? false : true;
        $(".slice").css("cursor", "auto");
        viz.select("#legendPie").remove();
        viz.transition()
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
                  legendMap[d1.data.name] = color;
                }
              } else if ((d1.depth == 2 && d1.parent.data.name === d.data.name)
                        || (d1.depth == 1 && d1.data.name === d.data.name)) {
                var color = getColor(d1, i);
                legendMap[d1.data.name] = color;
              }
          })
          .attrTween("d", function (d) { return function () { return arc(d); }; })
          .select("title")
            .text(function(d) {
              if (zoomFlag && d.depth == 0) {
                return "Click to zoom out";
              }

              if (!zoomFlag && d.depth == 1) {
                return "Click to zoom in";
              }
            });
          drawLegend(legendMap);
      }
    }

  };

  function getColor(d, i) {
    return colormap[d.data.name];
  }

  // Functions for creating trail sequence
  // =====================================

  function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#pie-sequence").append("svg:svg")
      .attr("width", PIE_CANVAS_WIDTH + 10000000)
      .attr("height", 50)
      .attr("id", "trail");

    // Add the label at the end, for the percentage.
    trail.append("svg:text")
      .attr("id", "endlabel")
      .attr("class", "heavy")
      .style("fill", "black");
  }

  function mouseover(d) {
    if (d.depth == 0) {
      mouseleave(d);
      return;
    }

    if (!zoomFlag) {
      if (!zoomFlag && d.depth == 1) {
        $("#viz" + d.data.name.replace(new RegExp("[\\.|\\s\\+|/]", "g"),"-")).css("cursor", "pointer");
      }
    }

    var percentage = (100 * d.value / 36252).toPrecision(3);
    var percentageString;
    if (d.ancestors().length == 3) {
      percentageString = percentage + "% of " + d.ancestors()[1].data.name + " year olds use " + d.ancestors()[0].data.name;
    } else {
      percentageString = percentage + "% of drug users are " + d.ancestors()[0].data.name + " year olds";
    }
    // if (percentage < 0.1) {
    //   percentageString = "< 0.1%";
    // }

    d3.select("#percentage")
      .text(percentageString);

    d3.select("#explanation")
      .style("visibility", "");

    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift(); // remove root node from the array
    updateBreadcrumbs(sequenceArray, percentageString);

    // Fade all the segments.
    d3.selectAll(".slice")
      .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    viz.selectAll(".slice")
      .filter(function (node) {
        return (sequenceArray.indexOf(node) >= 0);
      })
      .style("opacity", 1);
  }

  function mouseleave(d) {
    $(".slice").css("cursor", "auto");
    if (zoomFlag) {
      $("#vizTotal").css("cursor", "pointer");
    }
    // Hide the breadcrumb trail
    d3.select("#trail")
      .style("visibility", "hidden");

    // Deactivate all segments during transition.
    //d3.selectAll(".slice").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll(".slice")
      .style("opacity", 1)
      .on("end", function () {
        d3.select(this).on("mouseover", mouseoverPie);
      });

    d3.select("#explanation")
      .style("visibility", "hidden");
  }

  // Generate a string that describes the points of a breadcrumb polygon.
  function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(PIE_BREAD_DIM.WIDTH + ",0");
    points.push(PIE_BREAD_DIM.WIDTH + PIE_BREAD_DIM.TAIL + "," + (PIE_BREAD_DIM.HEIGHT / 2));
    points.push(PIE_BREAD_DIM.WIDTH + "," + PIE_BREAD_DIM.HEIGHT);
    points.push("0," + PIE_BREAD_DIM.HEIGHT);

    // Leftmost breadcrumb; don't include 6th vertex.
    if (i > 0) {
      points.push(PIE_BREAD_DIM.TAIL + "," + (PIE_BREAD_DIM.HEIGHT / 2));
    }

    return points.join(" ");
  }

  // Update the breadcrumb trail to show the current sequence and percentage.
  function updateBreadcrumbs(nodeArray, percentageString) {

    // Data join; key function combines name and depth (= position in sequence).
    var trail = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function (d) { return d.data.name + d.depth; });

    // Remove exiting nodes.
    trail.exit().remove();

    // Add breadcrumb and label for entering nodes.
    var entering = trail.enter().append("svg:g");

    entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function (d) { return getBreadCrumbColor(d);} );

    entering.append("svg:text")
      .attr("x", (PIE_BREAD_DIM.WIDTH + PIE_BREAD_DIM.TAIL) / 2)
      .attr("y", PIE_BREAD_DIM.HEIGHT / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function (d) { return d.data.name; })
      .attr("class", function(d) {
        return NON_COLORS.includes(getColor(d)) ? "black" : "white";
      });

    // Merge enter and update selections; set position for all nodes.
    entering.merge(trail).attr("transform", function (d, i) {
      return "translate(" + i * (PIE_BREAD_DIM.WIDTH + PIE_BREAD_DIM.SPACING) + ", 0)";
    });

    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
      .attr("x", (PIE_BREAD_DIM.WIDTH) - 75)
      .attr("y", PIE_BREAD_DIM.HEIGHT / 2 - 5)
      .attr("dy", "3em")
      .attr("dx", "6em")
      .attr("text-anchor", "middle")
      .text(percentageString);
    
    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
      .style("visibility", "");
  }

  function getBreadCrumbColor(d) {
    return colormap[d.data.name];
  }
}());
