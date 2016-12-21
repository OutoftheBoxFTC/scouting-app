//Takes an input of the score card id and returns an array of all the checked values in that element
function getTeamMatchScore(id) {
    var array = [];
    var ele = document.getElementById(id).elements;
    var names = getUniqueNameList(id);
    for (var i = 0; i < names.length; i++) { // for each name
        var type = document.getElementsByName(names[i])[0].type;
        if (type == "checkbox" || type == "radio") {
            value = checkedValue(names[i]);
            array.push(value)
        }
          if (type == "text" || type == "number" || type == "textarea") {
            var value = document.getElementsByName(names[i])[0].value;
            value = value.replace(/\,/g," ");
            array.push(value);
          }
    }
    return array
}

//takes the score card id and returns an array of all text/number fields needed for the score list
function getTeamMatchData(playerID) {
    var array = [];
    //var teamNumber = $('#' + playerID + ' ' + 'input[id*="tnumber"]').val();
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
    array.push(matchNumber, alliance, blueScore, redScore);
    return array;
}


// takes no parameters and checks that all the required match values are set. Very specific/non modular
function checkRequiredFields() {
    requiredValuesPresent = false;
    cancel = false;
    var required = new Map();
    var ele = $('#scoreCards').children();
    required.set("Match Number", document.getElementById('matchNumber').value);
    required.set("Red Alliance Score", document.getElementById('redScore').value);
    required.set("Blue Alliance Score", document.getElementById('blueScore').value);
    for (var i = 0; i < ele.length; i++) {
        if (!ele[i].classList.contains('noShow')) {
            playerID = ele[i].id;
            teamNumber = $('#' + playerID + ' ' + 'input[id*="tnumber"]').val();
            required.set("Team Number" + " " + i, teamNumber);
        }
    }
    while (!requiredValuesPresent && !cancel) {
        mapFilled(required);
        matchInfoFill(required);
    }

}

// Determines of the match info map is filled. Could theoretically be uesd to determine if any map had a value of empty or null
function mapFilled(myMap) {
    cancel = false;
    var array = [...myMap];
    for (var i = 0; i < array.length; i++) {
        var subArray = array[i];
        var key = subArray[0];
        var value = subArray[1];
        if (value == "" || value == null || value > 500000) {
            value = prompt("Please enter a value for" + " " + key);
            if (!value) {
                console.log("You hit cancel");
                cancel = true;
                return;
            }
            myMap.set(key, value);
            return;
        }
    }
    requiredValuesPresent = true;
    return
}

// Very specific function that fills out match info form based on user input. Takes a map as a parameter
function matchInfoFill(map) {
    var ele = $('#scoreCards').children();
    matchNumber = map.get("Match Number");
    blueAlliance = map.get("Blue Alliance Score");
    redAlliance = map.get("Red Alliance Score");
    document.getElementById('matchNumber').value = matchNumber;
    document.getElementById('blueScore').value = blueAlliance;
    document.getElementById('redScore').value = redAlliance;
    for (var i = 0; i < ele.length; i++) {
        if (!ele[i].classList.contains('noShow')) {
            playerID = ele[i].id;
            var key = "Team Number" + " " + i;
            var value = map.get(key);
            var playerID = ele[i].id;
            $('#' + playerID + ' ' + 'input[id*="tnumber"]').val(value);
        }
    }
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function score(tableID) {
  //Verfies all necessary data present before continuing
    checkRequiredFields();
    console.log("All required fields are filled?:" + " " + requiredValuesPresent);
    if(!requiredValuesPresent){
      return;
    }

    //Actual scoring stuff
    var ele = $('#scoreCards').children();
    var i = 0;
    while (i < ele.length) {
        if (!ele[i].classList.contains('noShow')) {
            var array1 = getTeamMatchData(ele[i].id);
            var array2 = getTeamMatchScore(ele[i].id);
            var scoreArray = array1.concat(array2);
            scoreArray.unshift(scoreArray[4]); //Team number is in the fourth position, so this adds a duplicate of it to the front
            scoreArray.splice(5,1)//this removes the original instance of team number
            scoresList.push(scoreArray);
            addNewRow(scoreArray, tableID);
        } else {}
        i++;
    }
    scoresList = tableToArray(tableID)
    console.log(scoresList)
    scoresCSV = arrayCSV(scoresList);
    localStorage.currentTournament = tournamentName;
    localStorage.localScores = scoresCSV;
    var forms = document.getElementById("scoreCards").children;
    clearForm("matchData");
    clearForm("scoreCards");
    console.log("All fields cleared");
}
