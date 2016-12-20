var elements = ['Auto Beacon', 'Auto Part. (high)', 'Auto Part. (low)', 'Auto Cap Ball', 'Auto Park', 'Teli Beacons', 'Particles (high)', 'Particles (low)', 'Cap Ball'];
var scores = [2, 1, 0, 0, 0, 2, 0, 0, 0];

//takes two arrays and two names and returns array of objects containing properties with the values from the arrays
function objectArray(array1, array2, type1, type2) {
    var array = [];
    var length = Math.min(array1.length, array2.length)

    for (q = 0; q < length; q++) {
        var obj = {};
        obj[type1] = array1[q];
        obj[type2] = array2[q];
        array.push(obj);
    }
    //console.log(array);
    return array
}


function makeAChart() {
  $( "#svg1" ).empty();

  var data = objectArray (elements, scores, 'element', 'score');

  var margin = {top: 20, right: 30, bottom: 100, left: 40},
    width = $('.chart').width() - margin.left - margin.right,
    height = 400 -margin.top -margin.bottom,
    barWidth = width / data.length;

  var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(data.map(function(d) { return d.element; }));

  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 10]);

  var chart = d3.select(".svgChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height  + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
    .attr("y", function(d) { return y(d.score); })
    .attr("height", function(d) { return height - y(d.score); })
    .attr("width", barWidth - 1);

  bar.append("text")
    .attr("x", barWidth / 2)
    .attr("y", function(d) { return y(d.score) - 13; })
    .attr("dy", ".75em")
    .text(function(d) { return d.score; });

  // Add the x Axis
  chart.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(y));

  chart.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)"
                });

  chart.selectAll(".x-axis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
             });
}


function changeChart(data) {
  for (i=0; i <data.length; i++){
    var n = Math.floor((Math.random() * 4) + 1);
    if (data[i] > 4){
      data[i] = data[i] - n;
    }
    else {
      data[i] = data[i] + n;
    }
  }
  //console.log(data);
}
