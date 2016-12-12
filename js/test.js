/* This test is meant to determine two things:
  1. Can a set be used to eliminate duplicates in the array
  2. Can a map be used to store team scores*/
/*

function checkDuplication(teamNumber, matchNumber, set) {
    var pid = teamNumber + "_" + matchNumber;
    if (set.has(pid)) {
        console.log('Attempting to add duplicate entry');
        return
    }
    set.add(pid)
    console.log(playerIDList);
}


localStorage.matchList = matchsCsv;
console.log(localStorage.matchList);
localStorage.scoreList = scoresCSV;
console.log(localStorage.scoresList);

$(document).ready(function() {
  var modal = document.getElementById('loadData');
    if (typeof(Storage) !== "undefined") {
          modal.style.display = "block";
          $('.close').click(function(){
            $('.modal').css('display', 'none')
          })
          window.onclick = function(event) {
              if (event.target == modal) {
                    $('.modal').css('display', 'none')
              }
          }

        console.log("LocalStorage");
      }
});

function importAllData() {

}
function clearData() {
  localStorage.clear();
}


$(document).ready(function() {
    $("#enterMatch").click(function() {
        $("table#matches").find('td').click(function() {
            var array = [];
            var oldValue = $(this).text()
            var value;
            value = prompt("Please enter the new value. Enter no value if you wish to delete this row.");
            if (value) {
                $(this).text(value);
                array = tableToArray('matches')
                console.log(array);
                matchList = array;
                console.log('matchlist:' + matchList);
                fillInTeamNumbers('scoreCards', 'matchNumber', matchList)
            } else {
                $(this).text(oldValue);
            }
        });
        $("table#matches").find('td').contextmenu(function(e) {
          e.preventDefault();
            if (confirm("Remove Row")) {
                $(this).parent().remove();
            }
        });
    });
});
*/
function a2() {
    var teamSet = new Set();
    var array = find2DArrayValue(scoresList, 0)
    for (i = 0; i < array.length; i++) {
        teamSet.add(array[i])
    }
    array = [...teamSet];
    console.log(array.sort());
}

function getData() {
  clearTable('teamListNav');
    var teamList = uniqueTeamList(scoresList, 0);
    teamMatches = mapTeamScores(teamList, scoresList);
    addNewRow(teamList, 'teamListNav')
}

function clearTable(tableID) {
    $('#' + tableID + ' ' + 'tbody').empty();
}

function myFunction(tableID) {
    var userInput;
    var team;
    var score;
    userInput = prompt('Please enter a team number')
    clearTable(tableID);
    document.getElementById("teamHeader").innerHTML = "";
    if (teamMatches.get(userInput)) {
        team = teamMatches.get(userInput);
        score = [...team];
        document.getElementById("teamHeader").innerHTML = "Overview of Team #" + " " + userInput;
        for (n = 0; n < score.length; n++) {
            addNewRow(score[n][1], tableID);
        }
    } else {
        document.getElementById("teamHeader").innerHTML = "Team Not Found";
    }
}

//given an array of values and the position of the team numbers in that array, this returns an array of unique team numbers
function uniqueTeamList(array, position) {
    var set = new Set();
    var teamNumbers = find2DArrayValue(array, position);
    for (i = 0; i < array.length; i++) {
        set.add(teamNumbers[i])
    }
    teamNumbers = [...set];
    teamNumbers = teamNumbers.sort(function (a, b) {  return a - b;  });
    return teamNumbers
}

function aFunction() {
    var tableID = 'testing123'
    var array = scoresList.clone();
    //  var teamSet = new Set();
    //  var teamNumbers = find2DArrayValue(scoresList, 0);
    var matchMaster = new Map();
    //  for (i = 0; i < teamNumbers.length; i++) {
    //    teamSet.add(teamNumbers[i]);
    //  }
    //  teamNumbers = [...teamSet].sort();
    array.sort();
    matchMaster = mapTeamScores(teamNumbers, array);
    var num = prompt("Please enter a team number");
    var array1 = matchMaster.get(num);
    var array1 = [...array1];
    console.log('values for array1:' + ' ' + array1);
    document.getElementById("teamHeader").innerHTML = "Overview of Team #" + " " + num;
    for (n = 0; n < array1.length; n++) {
        addNewRow(array1[n], 'testing123')
    }
}

function mapTeamScores(teamNumbers, teamScores) {
    var map = new Map();
    for (n = 0; n < teamNumbers.length; n++) {
        var newMap = new Map();
        for (i = 0; i < teamScores.length; i++) {
            var sub = teamScores[i];
            if (teamNumbers[n] == sub[0]) {
                newMap.set(sub[1], sub.splice(1, sub.length))
            }
        }
        map.set(teamNumbers[n], newMap)
    }
    return map
}
