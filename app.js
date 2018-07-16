var w = 800;
var h = 400;




var timeFormat = d3.timeFormat("%M:%S");

var Graphic =  d3.select('.container')
    .append('svg')
    .attr('width', w + 120)
    .attr('height', h + 60);

var tooltip = d3.select("body").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var data=new Array();
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
d3.json(url, function(error, result) {
    result.forEach(function(d) {
    var parsedTime = d.Time.split(':');
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    data.push([d.Year,d.Time])  
  });
  
 
    
    var year_min = d3.min(data.map((e)=> e[0]));
    var year_max = d3.max(data.map((e)=> e[0]));

    var xScale = d3.scaleLinear()
    .domain([year_min,year_max])
    .range([0, w]);

  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"));
  
  var xAxisGroup = Graphic.append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(60, 400)')
    .call(xAxis);
  
  
  var time_min = d3.min(data.map((e)=> e[1]));
  var time_max = d3.max(data.map((e)=> e[1]));


 var yAxisScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {  
            return d[1]
                                    }))
    .range([30,h]);

  var yAxis = d3.axisLeft(yAxisScale).tickFormat(timeFormat) 
   
  var yAxisGroup = Graphic.append('g')
    
    .attr('id', 'y-axis')
    .attr('transform', 'translate(60, 0)')
    .call(yAxis);
  


   Graphic.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue',(d, i)=>d[0])
    .attr("data-yvalue",(d, i)=>d[1])
    .attr('cx', (d, i)=>xScale(d[0]))
    .attr('cy', (d, i)=> yAxisScale(d[1]))
    .attr('r', 7)
    .style('fill', 'red')
    .style("stroke", "black")
   .attr('transform', 'translate(60, 0)')
     .on('mouseover', function(d, i) {
      
      d3.select(this).style("fill", "white");
    
      tooltip.transition()
              .duration(100)
              .style('opacity', .9);
    
      tooltip.html(result[i].Name+'<br>'+result[i].Year + '<br>' + result[i].Time )
              .attr("data-year",data[i][0])
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 30) + "px")
              .style('transform', 'translateX(60px)');
    
    })
    .on('mouseout', function(d,i) {
    
      d3.select(this).style("fill", "red")
       tooltip.transition()
              .duration(100)
              .style('opacity', 0);
    });
var legend = Graphic.append("g")
  .attr("class", "legend")
   .attr("id", "legend")
  .attr("x", w - 65)
  .attr("y", 25)
  .attr("height", 100)
  .attr("width", 100);

legend.append("rect")
  .attr("x", w - 65)
  .attr("y", 25)
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", 'red');

legend.append("text")
  .attr("x", w - 45)
  .attr("y", 35)
  .text("Racers");
});
