var matchList = [];
var allScores = [];
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
//Clears all text values from a given form
function formReset(formID) {
    var ele = document.getElementById(formID);

    for (i = 0; i < ele.length; i++) {
        ele.elements[i].value = null;
    }
}


/*Takes an array and table id as input and adds the row to the table
function aaddNewRow(rowData, tableId) {
    var table = document.getElementById(tableId);
    var row = table.insertRow(-1);

    for (i = 0; i < rowData.length; i++) {
        cell = row.insertCell(i);
        cell.innerHTML = rowData[i];
    }
    console.log("Row Added to" + " " + tableId);
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
*/
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
    console.log(csvContent);
    return csvContent;
}

function currentTime() {
    var date = new Date();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var time = hours + minutes;
    return time;
}

function downloadCSV(type, csv) {
    var time = currentTime();
    var name = type + "_" + time + ".csv";
    var contentType = 'text/csv';
    if (!csv) {
        alert("No save data detected");
        console.log(time + "_CSV file was blank");
        return;
    }
    download(new Blob([csv]), name, contentType);
    return;
}
