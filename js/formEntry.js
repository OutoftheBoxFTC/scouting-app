/*Array.prototype.contains = function(v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

function resetCheckboxes() {
    $('input[type=checkbox]').each(function() {
        this.checked = false;
    });
}


function matchData(array, playerID) { //this function gets all the generic info that goes ahead of the scores in the table.
    var teamNumber = $('#' + playerID + ' ' + 'input[id*="tnumber"]').val();
    var matchNumber = document.getElementById('matchNumber').value;
    var alliance;
    var blueScore = document.getElementById('blueScore').value;;
    var redScore = document.getElementById('redScore').value;
    if (document.getElementById(playerID).classList.contains("redAlliance")) {
        alliance = 'red'
    } else if (document.getElementById(playerID).classList.contains("blueAlliance")) {
        alliance = 'blue'
    } else {
        alliance = "unknown"
    }
    array.push(teamNumber, matchNumber, alliance, blueScore, redScore);
}

function getScores(array, id) {
    var name;
    var names = [];
    var ele = document.getElementById(id).elements;
    var value;
    var val;
    var type;
    for (var i = 0; i < ele.length; i++) {
        name = ele[i].name;
        names.push(name);
    }
    names = names.unique(); // eliminate all duplicate entries
    for (var i = 0; i < names.length; i++) { // for each name
        type = document.getElementsByName(names[i])[0].type;
        if (type == "checkbox" || type == "radio") {
            value = checkedValue(names[i]);
            array.push(value)
        }
    }
}
*/





function checkRequiredFields() { // gross lazy function to perform basic field validation
    var required = [];
    var missingValues = 0;
    var value;
    var teamNumber;
    var matchNumber = document.getElementById('matchNumber').value;
    var blueAllianceScore = document.getElementById('blueScore').value;;
    var redAllianceScore = document.getElementById('redScore').value;
    var ele = $('#scoreCards').children();
    required.push(matchNumber, blueAllianceScore, redAllianceScore);
    for (var i = 0; i < ele.length; i++) {
        if (!ele[i].classList.contains('noShow')) {
            playerID = ele[i].id;
            teamNumber = $('#' + playerID + ' ' + 'input[id*="tnumber"]').val();
            required.push(teamNumber);
        }
    }
    for (var i = 0; i < required.length; i++) {
        if (!required[i]) {
            missingValues++;
        }
    }
    if (missingValues > 0) {
        if (confirm(missingValues + " " + "required field(s) are currently missing. Would you like to manually enter them?") == true) {
            if (!matchNumber) {
                matchNumber = prompt("Please enter the match number");
                if (!matchNumber) {
                    console.log("You hit cancel");
                    return
                }
                document.getElementById('matchNumber').value = matchNumber;
            }
            if (!blueAllianceScore) {
                blueAllianceScore = prompt("Please enter the final score for Blue Alliance");
                if (!blueAllianceScore) {
                    console.log("You hit cancel");
                    return
                }
                document.getElementById('blueScore').value = blueAllianceScore;
            }
            if (!redAllianceScore) {
                redAllianceScore = prompt("Please enter the final score for Red Alliance");
                if (!redAllianceScore) {
                    console.log("You hit cancel");
                    return
                }
                document.getElementById('redScore').value = redAllianceScore;
            }
            for (var i = 0; i < ele.length; i++) {
                if (!ele[i].classList.contains('noShow')) {
                    playerID = ele[i].id;
                    teamNumber = $('#' + playerID + ' ' + 'input[id*="tnumber"]').val();
                    if (!teamNumber) {
                        teamNumber = prompt("Please enter the team number for:" + " " + playerID);
                        if (!teamNumber) {
                            console.log("You hit cancel");
                        }
                        $('#' + playerID + ' ' + 'input[id*="tnumber"]').val(teamNumber);
                    }
                }
            }
            error = false;
            return;
        } else {
            console.log("You said no!");
            error = true;
            return;
        }
    }
}


function score(tableID) {
    var ele = $('#scoreCards').children();
    var i = 0;
    checkRequiredFields();
    if (error) {
        error = false;
        console.log("Missing required fields, score was not recorded.");
        return
    }
    while (i < ele.length) {
        var scoreArray = []
        if (!ele[i].classList.contains('noShow')) {
            matchData(scoreArray, ele[i].id);
            getScores(scoreArray, ele[i].id);
            allScores.push(scoreArray);
            addNewRow(scoreArray, tableID)
        } else {}
        i++;
    }
    csv = arrayCSV(allScores)
    var forms = document.getElementById("scoreCards").children;
    formReset("matchData");
    for (i = 0; i < forms.length - 1; i++) {
        var name = forms[i].id;
        formReset(name);
    }
    resetCheckboxes();
    console.log("All fields cleared");
}
