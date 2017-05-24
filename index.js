document.addEventListener('DOMContentLoaded',function(){
      req=new XMLHttpRequest();
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
req.send();
req.onload=function(){
  json=JSON.parse(req.responseText);
  var data = json.data;
  console.log(data);
  var years = data.map(function(d){
    var quarter;
    var q = d[0].slice(5,7);
    if(q == '01'){
      quarter = 'Q1';
    }
    else if(q == '04'){
      quarter ='Q2';
    }
    else if(q == '07'){
      quarter = 'Q3'; 
    }
    else if(q == '10'){
      quarter = 'Q4';
    }
    return d[0].slice(0,4) + " " + quarter
  });
  var intYears = years.map(function(y){
    var t = y.slice(0,4);
    return t;
  });
  console.log(intYears);
  
  var gdp = data.map(function(d){
    return d[1];
  });
   
  var maxGDP = d3.max(gdp);
  var minGDP = d3.min(gdp);
  var maxYear = d3.max(intYears);
  var minYear = d3.min(intYears);
  
  var margin = {top:20, right:20, bottom:50, left:40};
  var height = 600 - margin.top - margin.bottom;
  var width = 800 - margin.left - margin.right;
  var barUnit = width/275;
  
  var x = d3.scaleLinear()
  .range([0, width]);
  
  var y = d3.scaleLinear()
  .range([height,0]);
  
  //Build the overall svg structure
  var svgWrap = d3.select(".svgWrap")
  .append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append('g')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  //Build tooltip structure
  var tooltip = d3.select(".svgWrap")
    .append('div')
    .attr('id','tooltip')
    .style('opacity',0);
  
  //Define our domain scales
  x.domain([minYear,maxYear]);
  y.domain([minGDP,maxGDP]);
  
  
  //Build our bars based on our data
  svgWrap.selectAll("bar")
  .data(gdp)
  .enter()
  .append('rect')
  .attr('data-date', function(d, i) {
      return data[i][0]
    })
  .attr('data-gdp', function(d, i) {
      return data[i][1]
    })
  .attr("class","bar")
  .attr('id','bar')
  .attr("x", function(d,i){return i*2.7;})
  .attr("width",barUnit)
  .attr("y", function(d,i){return height - d/35;})
  .attr("height", function(d,i){return d/35;})
  
  //mouseover event
    .on('mouseover', function(d,i){
    tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);
        tooltip.html('$' + gdp[i] + ' Billion' + '<br>' + years[i])
        .attr('data-date', data[i][0])
        .style('left', (d3.event.pageX + 30) + 'px')
        .style('top', (d3.event.pageY - 30) + 'px');
  })
  
  //Mouseout Event
  .on('mouseout',function(d){
    tooltip.transition()
      .duration(500)
      .style('opacity',0);
  });
 
  //X Axis
  svgWrap.append('g')
  .attr("transform","translate(0," + height  +")")
  .call(d3.axisBottom(x).ticks(12,'d')).attr("id","x-axis");
  
  //Y Axis
  svgWrap.append('g')
  .call(d3.axisLeft(y))
  .attr('id','y-axis')
  .selectAll('text')
  .style('text-anchor','end')
  .attr('dx','4.5em')
  .attr('transform','rotate(25)');
  
  //X Axis Title
  svgWrap.append("text")
    .attr('x',width/2)
    .attr('y',height + margin.top + 20)
    .style('text-anchor','middle')
    .text("Year");
  
  //Y Axis Title
  svgWrap.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Gross Domestic Product (In Billions)");
  
  //Main Title
  svgWrap.append("text")
      .attr("x", (width / 2))				
      .attr("y", 0 + 3*(margin.top))
      .attr("text-anchor", "middle")
      .attr('id','title')
      .style("font-size", "25px") 
      .style("text-decoration", "underline")
      .text("America's Gross Domestic Product: 1947 - 2015");
  
  
}});