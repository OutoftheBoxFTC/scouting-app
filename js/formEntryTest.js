//Takes an input of the score card id and returns an array of all the checked values in that element
function getTeamMatchScore(id) {
    id = "blue_1";
    var array = [];
    var ele = document.getElementById(id).elements;
    var names = getUniqueNameList(id);
    for (var i = 0; i < names.length; i++) { // for each name
        var type = document.getElementsByName(names[i])[0].type;
        if (type == "checkbox" || type == "radio") {
            value = checkedValue(names[i]);
            array.push(value)
        }
    }
    return array
}

//takes the score card id and returns an array of all text/number fields needed for the score list
function getTeamMatchData(id) {
    var array = [];
    var teamNumber = $('#' + playerID + ' ' + 'input[id*="tnumber"]').val();
    var matchNumber = document.getElementById('matchNumber').value;;
    var blueScore = document.getElementById('blueScore').value;;
    var redScore = document.getElementById('redScore').value;
    var alliance;
    if (document.getElementById(playerID).classList.contains("redAlliance")) {
        alliance = 'red'
    } else if (document.getElementById(playerID).classList.contains("blueAlliance")) {
        alliance = 'blue'
    } else {
        alliance = "unknown"
    }
    array.push(teamNumber, matchNumber, alliance, blueScore, redScore);
    return array;
}

function score() {
    var required = new Map();
    var ele = $('#scoreCards').children();
    required.set("Match Number", document.getElementById('matchNumber').value);
    required.set("Blue Alliance Score", document.getElementById('blueScore').value);
    required.set("Red Alliance Score", document.getElementById('redScore').value);
    for (var i = 0; i < ele.length; i++) {
        if (!ele[i].classList.contains('noShow')) {
            playerID = ele[i].id;
            teamNumber = $('#' + playerID + ' ' + 'input[id*="tnumber"]').val();
            required.set("Team Number" + " " + i, teamNumber);
        }
    }
var array = [...required]
for (var i = 0; i < array.length; i++){
  var subArray = array[i];
  var key = subArray[0];
  var value = subArray[1];
  if (!value){
    value = prompt("Oh No! The " + " " + key + " " + "is missing!")
    if (value){
      required.set(key, value)
    }
    else{
      return
    }
  }
}
    console.log(array);
}
