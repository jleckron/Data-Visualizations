var margin = {top: 10, right: 40, bottom: 150, left: 100},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width - 40]),
    y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.energy); });

function make_x_gridlines() {
    return d3.axisBottom(x)
        .ticks(5);
}

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5);
}

//following code sourced from URL example listed on Assignnment page
//this sets up a mapping for each country to a name, color, and display status
var countryMap = {
    "Bangladesh" : {
        color: "#b50000",
        name: "Bangladesh",
        display : false
    },
    "Brazil" : {
        color: "#ff0000",
        name: "Brazil",
        display : true
    },
    "Canada" : {
        color: "#7d3333",
        name: "Canada",
        display : false
    },
    "China" : {
        color: "#ff8c00",
        name: "China",
        display : true
    },
    "Colombia" : {
        color: "#ab5f02",
        name: "Colombia",
        display : false
    },
    "Ethiopia" : {
        color: "#705534",
        name: "Ethiopia",
        display : false
    },
    "France" : {
        color: "#95f505",
        name: "France",
        display : false
    },
    "Germany" : {
        color: "#65a307",
        name: "Germany",
        display : false
    },
    "India" : {
        color: "#365902",
        name: "India",
        display : true
    },
    "Indonesia" : {
        color: "#07f566",
        name: "Indonesia",
        display : false
    },
    "Italy" : {
        color: "#03a343",
        name: "Italy",
        display : false
    },
    "Japan" : {
        color: "#01692a",
        name: "Japan",
        display : false
    },
    "Mexico" : {
        color: "#05f5f5",
        name: "Mexico",
        display : false
    },
    "Nigeria" : {
        color: "#029c9c",
        name: "Nigeria",
        display : false
    },
    "Pakistan" : {
        color: "#1d6b6b",
        name: "Pakistan",
        display : false
    },
    "Philippines" : {
        color: "#012191",
        name: "Philippines",
        display : false
    },
    "Russia" : {
        color: "#0237f5",
        name: "Russia",
        display : true
    },
    "South Africa" : {
        color: "#33406b",
        name: "South Africa",
        display : true
    },
    "Spain" : {
        color: "#7905f5",
        name: "Spain",
        display : false
    },
    "Thailand" : {       
        color: "#490096",
        name: "Thailand",
        display : false
    },
    "Turkey" : {
        color: "#9577b5",
        name: "Turkey",
        display : false
    },
    "Ukraine" : {
        color: "#ff059b",
        name: "Ukraine",
        display : false
    },
    "United Kingdom" : {
        color: "#9c0660",
        name: "United Kingdom",
        display : false
    },
    "United States" : {
        color: "#b84d5a",
        name: "United States",
        display : true
    },
    "Vietnam" : {
        color: "#5cabfa",
        name: "Vietnam",
        display : false
    }
};

//following functions sourced from example on assignment page
//https://sureshlodha.github.io/CMPS263_Winter2018/CMPS263FinalProjects/PrescriptionDrugs/index.html
//tweenDashoffsetOn when called will return the points in the path to be drawn
function tweenDashoffsetOn() {
    const l = this.getTotalLength(),
        i = d3.interpolateString(" " + l, "0");
    return function (t) {
        return i(t);
    };
}

//tweenDashoffsetOn when called will return the points in the path to be erased, so no points
function tweenDashoffsetOff() {
    const l = this.getTotalLength(),
        i = d3.interpolateString("0", " " + l);
    return function (t) {
        return i(t);
    };
}
//------------------------------------------------------------

//parses input data into data array
function rowConverter(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) 
        d[c = columns[i]] = +d[c];
    return d;
}


d3.csv("BRICSdata.csv", rowConverter).then(function(data) {    
    var countries = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {date: d.date, energy: d[id]};
          })
        };
    })
    
    //extent is used to find the minimum and maximum values in data in order to scale the x-axis correctly
    x.domain(d3.extent(data, function(d) { return d.date; }));

    //same functionality as above but for the y-axis 
    y.domain([
        d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.energy; }); }),
        d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })
    ]);
    
//draws x-axis
    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("transform", "translate(0," + 10 + ")")
        .attr("x", width)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Year");

//draws y-axis
    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -(height / 2)+40)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Million BTUs per Person");
    
    // add the X gridlines
    svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")) 

    // add the Y gridlines
    svg.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
              .tickSize(-width+40)
              .tickFormat(""))

//defines the countries path line and text label
    var country = svg.selectAll(".country")
        .data(countries)
        .enter().append("g")
        .attr("class", "country")
        .attr("id", function (d) {
            return d.id.split(' ').join('_');
        });

    country.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return countryMap[d.id].color; })
    
    country.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.energy) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { 
            return countryMap[d.id].name; 
        })
        .style('opacity', 0)
        .filter(function (d) {
            return countryMap[d.id].display; 
        })
        .transition()
        .duration(2000)
        .style('opacity', 1);
   
    
    //only displays paths with the display status of true
    var paths = country.select("path")
        .each(function() {
            d3.select(this)
            .attr("stroke-dasharray", this.getTotalLength() + "," + this.getTotalLength())
            .attr("stroke-dashoffset", "" + this.getTotalLength());
        });
        paths
        .filter(function (d) {
            return countryMap[d.id].display;
        })
        .transition()
            .duration(2000)
            .attrTween("stroke-dashoffset", tweenDashoffsetOn);  
    
    drawCheckboxes(countries);
    drawMouseover(countries);
});


//Another code block sourced from the linked example with minor modifications. It takes the mouse position and draws a vertical line corresponding to the x-value of the mouse. When the vertical line intersects a displayed path, it shows a circle with the same color as the line, and the value on the interpolated line at the selected point.
//https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
function drawMouseover(countries) {
    var mouseG = svg.append("g")
                  .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
                              .data(countries)
                              .enter()
                              .append("g")
                              .attr("class", "mouse-per-line")

    mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", function(d) {
                  return countryMap[d.id].color;
                })
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(2,-8)")
      .style("font", "12px sans-serif");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width-40) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .filter(function(d){ return countryMap[d.id].display; })
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .style('opacity', function(d){
                    var ret = 0;
                    if(countryMap[d.id].display){
                        ret = 1;
                    }
                    return ret;
                })
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + (pos.y) +")";
          });
      });
    
}

//also sourced from example webpage with minor modifications
//https://github.com/palmchou/animated_multiline_chart/blob/master/MultilineExtra.js
function drawCheckboxes(countries) {
    var checkboxes = d3.select(".country-list").selectAll(".country-checkbox")
        .data(countries)
        .enter()
        .append("li")
        .attr("class", "country-checkbox");
    
    checkboxes.append("input")
    
        .attr("type", "checkbox")
        .attr("countryname", function (d) {
            return d.id;
        })
        .attr("id", function (d) {
            return countryMap[d.id].name.replace(" ", '_') + '_checkbox';
        })
        .attr("countryid", function (d) {
            return countryMap[d.id].name.replace(" ", '_')        
        })
        .on("change", checkChanged)
        .filter(function (d) {
            return countryMap[d.id].display;
        })
        .each(function(d) {
            d3.select(this)
              .attr("checked", true)
        });    
    
    //append country name to checkbox
    checkboxes.append("label")
        .attr("for", function (d) {
            return d.id.split(' ').join('_') + 'checkbox';
            })
        .text(function (d) {
            return d.id;
        });  
}

//helper function to determine whether to draw or erase the line when a country's checkbox status is changed
function checkChanged() {
    var checked = this.checked;
    var countryid = this.getAttribute("countryid");
    var countryName = this.getAttribute("countryname");
    svg = d3.select("#" + countryid);
    
    //if the checkbox is now unchecked, make country name label opacity = 0 and erase line.
    //attrtween will make the lines transition to drawn/erased smoothly
    if (!checked) {
        svg.select("text")
            .transition()
            .duration(1000)
            .style("opacity", 0);
        svg.select("path").transition()
            .duration(2000)
            .attrTween("stroke-dashoffset", tweenDashoffsetOff);
        countryMap[countryName].display = false;
    //if the checkbox is now checked, make country name label opacity = 1 and draw line
    } else {
        svg.select("text")
            .transition()
            .duration(1000)
            .style('opacity', 1);
        svg.select("path").transition()
            .duration(2000)
            .attrTween("stroke-dashoffset", tweenDashoffsetOn);
        countryMap[countryName].display = true;
    }    
}
//--------------end of sourced code blocks-----------------------
