/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Margins adjust how far from the edges of the window the elements can occupy.
// Defining the margins will specify the size of the svg objects. 
var margin = {top: 10, right: 40, bottom: 150, left: 100},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together. 
// This segmemt of code makes the html page an svg element with defined height
// and width. 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// These set the scales for the axes. The x axis is a scale band, since it is 
// not numerical values, and the y axis is a linear scale of numberical values. 
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale).ticks(5, "$");

/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// Since the column headers in the .csv file cannot be changed, the names 
// here must be. key refers to the country name and the value refers to GDP.
// CSV files are comma seperated lists, so country,gdp becomes key,value.

function rowConverter(data) {
    return {
        key : data.country,
        value : +data.gdp
    }
}

d3.csv("GDP2020TrillionUSDollars.csv",rowConverter).then(function(data){
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // This section automatically sets the scales of the axes given
    // the values in the data objects.
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // Create rectangles to form the bars that have the position and height
    // defined by the tuples in d. 
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .transition().duration(1000)
        .delay(function(d,i) {return i * 200;})
        .attr("x", function(d) {
            return xScale(d.key);
        })
        .attr("y", function(d) {
            return yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height- yScale(d.value);
        })  
        // create increasing to decreasing shade of blue as shown on the output	
        // color becomes more blue the greater the value of GDP is
        .attr("fill", function(d) {
            return "rgb(0, 0, " + Math.round(255- 5*d.value) + ")";
        });
    
    // Label the data values(d.value) 
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", (function(d) { 
            return xScale(d.key); 
        }))
        .attr("y", function(d) { 
            return yScale(d.value)+2; 
        })
        .style("text-anchor", "start")
        .style("dominant-baseline", "hanging")
        .text(function(d) { 
            return d.value; 
        })
        .attr("fill", "white");
        
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("transform", "rotate(-60)");
        
    
    // Draw yAxis and position the label
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 0 + ",0)") 
        .call(yAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -70)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Trillions of US Dollars ($)");
});
