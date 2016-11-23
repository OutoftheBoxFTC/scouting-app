var matchList = [];
var allScores = [];
var playerList = ['b1_', 'b2_', 'r1_', 'r2_']
var teamList = [118, 2821, 4106, 4318, 5040, 5414, 5421, 6029, 6054, 6253, 6700, 6987, 8297, 8393, 8395, 8463, 8498, 8645, 9794, 9872, 10353, 10808, 11261, 11362];
var csv;
var error = false;

//takes the name of a data list and fills if from the teamList array above
function makeList(listId) {
    var list = document.getElementById(listId);
    teamList.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
    })
}

// takes an input of an HTML element id and then toggles visibility. Requires the CSS class "noShow"
function toggleShow(id) {
    var cls = "noShow";
    var element = document.getElementById(id);
    element.classList.toggle(cls);
}

// Takes a form and array as input and pushes the form values to the array. Doesn't check if content is checked/not checked
function formArray(formID, array) { //in the future, set to return array
    var ele = document.getElementById(formID);
    var value;

    for (i = 0; i < ele.length; i++) { //runs through form and adds values to the array. It will exit if any of the values are missing
        value = ele.elements[i].value;
        if (value) {
            array.push(value);
        } else {
            alert('Missing Value');
            error = true;
            console.log(error);
            return;
        }
    }

}

//Takes an array and table id as input and adds the row to the table
function addNewRow(rowData, tableId) {
    var table = document.getElementById(tableId);
    var row = table.insertRow(-1);

    for (i = 0; i < rowData.length; i++) {
        cell = row.insertCell(i);
        cell.innerHTML = rowData[i];
    }
    console.log("Row Added to" + " " + tableId);
}

//Clears all text values from a given form
function formReset(formID) {
    var ele = document.getElementById(formID);

    for (i = 0; i < ele.length; i++) {
        ele.elements[i].value = null;
    }
}

//takes ensures that a number can be an index for the match array
function invalidMatchInput(matchArray, value) {
    if (!value) {
        console.log('No match number entered.');
        return true;
    }
    if (matchArray.length < 1) { //input in range
        console.log('No matches logged');
        return true;
    }
    if (value > matchArray.length) { //input in range
        console.log('Match Number out of range.');
        return true;
    }
}

//custom method that takes the match input, pushes it to an array, adds it to the specified table and then resets the form
function addMatch(formID, tableID, resetID, array) {
    var newArray = [];
    var ele = document.getElementById(formID);
    var matchCount = parseInt(ele.elements[0].value) + 1;

    formArray(formID, newArray);
    if (error) {
        console.log(error);
        error = false;
        return;
    }
    addNewRow(newArray, tableID);
    formReset(formID, resetID);
    ele.elements[0].focus();
    ele.elements[0].value = matchCount;
    matchList.push(newArray);
    console.log(newArray);
}

// custom method to populate score card team numbers based on the match number
function getTeam(fieldID, matchArray, playerArray) {
    var value = document.getElementById(fieldID).value;
    var x = value - 1;
    var array;
    var valueA;
    var teamID;
    var count = 0;
    if (invalidMatchInput(matchArray, value)) {
        console.log('getTeam terminated')
        return;
    }

    array = matchArray[x];
    console.log('Match' + ' ' + value + ' ' + 'is:' + ' ' + array);

    for (i = 0; i < playerArray.length; i++) {
        value = array[i + 1];
        teamID = playerArray[i] + 'tnumber';
        valueA = document.getElementById(teamID).value;
        if (valueA && count < 1) { //asks to overwrite once per loop
            if (confirm("Overwrite Current Matches?")) {
                count = 1;
            } else {
                console.log('User cancelled action.')
                return;
            }
        }
        document.getElementById(teamID).value = value;
    }
}

function arrayCSV(data) {
    var csvContent = "";
    data.forEach(function(infoArray, index) {

        dataString = infoArray.join(",");
        csvContent += index < data.length ? dataString + "\n" : dataString;

    });
    return csvContent;
}

function currentTime() {
    var date = new Date();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var time = hours + minutes;
    return time;
}

function downloadCSV(csv) {
    var time = currentTime();
    var name = "Scores_" + time + ".csv";
    var contentType = 'text/csv';
    if (!csv) {
        alert("No save data detected");
        console.log(time + "_CSV file was blank");
        return;
    }
    download(new Blob([csv]), name, contentType);
    return;
}
