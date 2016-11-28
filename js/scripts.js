/*==============================================================================
*   Global Variables
==============================================================================*/
var scoresCSV; //This holds all of the score data in an exportable format
var matchesCSV; //This holds all of the match data in an exportable format. Not currently implemented
var teamList; //This has all of the teams for the current tournament
var matchList = []; //array of all matches
var scoresList = []; //array of all recorded scores
var error; // This indicates whether or not there is an error
var scoutID; // This is the id of the scout and should only be filled out once. Not currently implemented
var rowCount = 0; //allows for unique ids when creating rows;
var uploadedFile; // Used to store CSV information when uploading a file
/*==============================================================================
*   Variables that need manual setting ahead of time
==============================================================================*/
teamList = [118, 2821, 4106, 4318, 5040, 5414, 5421, 6029, 6054, 6253, 6700, 6987, 8297, 8393, 8395, 8463, 8498, 8645, 9794, 9872, 10353, 10808, 11261, 11362];

/*==============================================================================
*   Test Functions
==============================================================================*/
// used to test whatever is currently being worked on


/*==============================================================================
*   Modular Functions
==============================================================================*/
//Takes an array and table id as input and adds the row to the table body
function addNewRow(rowData, tableId) {
    var table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    var row = table.insertRow(-1);
    rowCount++;
    row.id = String(tableId + '_row' + rowCount);
    for (i = 0; i < rowData.length; i++) {
        cell = row.insertCell(i);
        cell.innerHTML = rowData[i];
    }
    console.log("Row Added to" + " " + tableId);
}

//Just finds the value at a given index after performing very basic validation.
function findValueAt(index, array) {
    if (array) {
        var value = array[index];
        return value;
    } else {
        console.log('Could not find the specified array');
    }
}

//Someone elses code to handel uploading a file and converting it to a variable
function handleFileSelect(evt) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            // Print the contents of the file
            var span = document.createElement('span');
            var myInput = e.target.result;
            console.log(myInput);
            uploadedFile = myInput;
            return;
        };
    })(f);
    reader.readAsText(f);

}

//Takes an input of the CSV string data and parses it into an array
function parseCSV(string) {
    var array = [];
    console.log(string);
    var stage1Array = string.split('\n');
    console.log(array);
    for (i = 1; i < stage1Array.length; i++) {
        var newArray = stage1Array[i - 1].split(',');
        array.push(newArray);
    }
    console.log(array);
}

//takes an input a table and returns an array
function tableToArray(tableID) {
    var name = 'table#' + tableID + ' ' + 'tr';
    array = [];
    $('table#' + tableID + ' ' + 'tr').each(function() {
        var arrayOfThisRow = [];
        var tableData = $(this).find('td');
        if (tableData.length > 0) {
            tableData.each(function() {
                arrayOfThisRow.push($(this).text());
            });
            array.push(arrayOfThisRow);
        }
    });
    return array;
}

/*==============================================================================
*    Functions that load or are called on page load
==============================================================================*/
//takes the name of a data list and fills it from the teamList array above
function makeList(listId) {
    var list = document.getElementById(listId);
    teamList.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
    })
}

function fileUpload() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

// This is a highly specialized fumction that allows dynamic modification of the match list table
$(document).ready(function() {
    $("#submitButton").click(function() {
        $("table#scores").find('td').click(function() {
            var array = [];
            var oldValue = $(this).text()
            var value;
            value = prompt("Please enter the new value. Enter no value if you wish to delete this row.");
            if (value) {
                $(this).text(value);
                array = tableToArray('scores')
                console.log(array);
                scoresList = array;
            } else {
                $(this).text(oldValue);
            }
            return
        });
    });
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
            return
        });
        $("table#matches").find('td').contextmenu(function(e) {
            e.preventDefault();
            if (confirm("Remove Row")) {
                $(this).parent().remove();
            }
            return
        });
    });
});

/*==============================================================================
*   Custom Functions called at other times
==============================================================================*/
// called by fillInTeamNumbers, it validates input and provides useful debugging info
function invalidIndexInput(array, value) {

    if (!value) {
        console.log('No number entered.');
        return true;
    }
    if (array.length < 1) { //input in range
        console.log('No matches logged empty');
        return true;
    }
    if (value > array.length) { //input in range
        console.log('Number out of range.');
        return true;
    }
}

//This takes the name of the div holding the score cards, the name of the field where the match number is entered and the match list array and then fills out the team number text field for each score card based on it. It activates when the text field loses focus.
function fillInTeamNumbers(divID, fieldID, array) {
    var divID;
    var ele = $('#' + divID).children();
    var value;
    var index = parseInt(document.getElementById(fieldID).value) - 1;
    var newArray = findValueAt(index, array);
    if (invalidIndexInput(array, index + 1)) {
        return
    }
    for (var i = 0; i < ele.length - 1; i++) { //the -1 is so that the clear div is not included
        value = newArray[i + 1];
        playerID = ele[i].id;
        $('#' + playerID + ' ' + 'input[id*="tnumber"]').val(value)
    }
}

//Controls the modal box, will need to be updated to handle scores as well
function modalControl() {
    var modal = document.getElementById('importScores');
    var btn = document.getElementById("importButton");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
