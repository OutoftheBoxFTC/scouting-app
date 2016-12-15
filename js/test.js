var elements = ['Auto Beacon', 'Particles (center)', 'Particles (corner)', 'Cap Ball (auto)', 'Parking', 'Teli-Op Beacons', 'Particles (center)', 'Particles (corner)', 'Cap Ball (end game)'];
var data = [1, 0, 1, 0, 0, 2, 0, 0, 0];

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

function makeChart() {
$( ".chart" ).empty(); //clears chart so it can be redrawn

var x = d3.scaleLinear()
    .domain([0, 10])//number of divisions
    .range([0, 120]);//max size in px
d3.select(".chart")
  .selectAll("div") //we want divs for our bars
    .data(data) //sets the chart data to the array data
  .enter().append("div") //adds the new divs to the chart element
    .style("width", function(d) {return x(d) + "px";})//set width
    .text(function(d){return d;})
//barEnter.style("height", function(d) { return d * 20 +20 + "px"; });


}

/*
function makeChart() {
    var array = objectArray(elements, data, 'element', 'score');
    $( ".chart" ).empty();
    d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("height", function(d) { return d * 10 + 10 + "px"; })
    .text(function(d) { return d; });
}
*/
function changeChart() {
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
