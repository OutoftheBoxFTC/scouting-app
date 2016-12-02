/* This test is meant to determine two things:
  1. Can a set be used to eliminate duplicates in the array
  2. Can a map be used to store team scores*/


function checkDuplication(teamNumber, matchNumber) {
  var pid = teamNumber + "_" + matchNumber;
  if(playerIDList.has(pid)){
    console.log('Attempting to add duplicate entry');
    return
  }
  playerIDList.add(pid)
  console.log(playerIDList);
}
