/* This test is meant to determine two things:
  1. Can a set be used to eliminate duplicates in the array
  2. Can a map be used to store team scores*/

var playerIDList = new Set();
var array = [[1,2], [3,4], [4,5]]

function checkDuplication(teamNumber, matchNumber) {
  var pid = teamNumber + "_" + matchNumber;
  if(playerIDList.has(pid)){
    console.log('Attempting to add duplicate entry');
    return
  }
  playerIDList.add(pid)
  console.log(playerIDList);
}

function myFunction() {
 var myMap = new Map();
  for (i = 0; i< array.length; i++){
    myMap.set(i+1, array[i])
    console.log(myMap);
  }
}
