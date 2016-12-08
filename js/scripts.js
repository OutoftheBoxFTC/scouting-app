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
var requiredValuesPresent = false; //used to tell if all values are accounted for
var cancel = false; //used to indicate whether the user wishes to cancel the action
var scoreIDList = new Set(); // holds all of the unique score ids to prevent duplication
var tournamentName; //for importing matches, says when the last match data is from
var debug = 0; //used for debugging
/*==============================================================================
*   Variables that need manual setting ahead of time
==============================================================================*/
teamList = [6700, 8297];
tournamentName = "Haymarket Regional"
    /*==============================================================================
    *   Test Functions
    ==============================================================================*/
jQuery.fn.selectText = function() {
    var doc = document;
    var element = this[0];
    console.log(this, element);
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
// These are a highly specialized set of functions that allows dynamic modification of the match and score list tables. It also allows for the deletion of matches and scores
$('tbody').live('click', function() {
    var thisTD = $(event.target).closest("td")
    $(event.target).closest("td").toggleClass('select')
    thisTD.attr('contenteditable', 'true')
    var oldValue = thisTD.text();
    var id = thisTD.attr('id');
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents(document.getElementById(id));
    selection.removeAllRanges();
    selection.addRange(range);
});
$('tbody').live('blur', function() {
    var thisTD = $(event.target).closest("td")
    $(event.target).closest("td").toggleClass('select')
    thisTD.attr('contenteditable', 'false')
    matchList = tableToArray('matches');
    scoresList = tableToArray('scores');
    fillInTeamNumbers('scoreCards', 'matchNumber', matchList);
    scoresCSV = arrayCSV(scoresList);
    matchesCSV = arrayCSV(matchList);
    localStorage.currentTournament = tournamentName;
    localStorage.localMatches = matchesCSV;
    localStorage.localScores = scoresCSV;
    return
});
$('tbody').live('contextmenu', function(e) {
    var thisTD = $(event.target).closest("td");
    e.preventDefault();
    if (confirm("Remove Row")) {
        thisTD.parent().remove();
    }
    matchList = tableToArray('matches');
    scoresList = tableToArray('scores');
    console.log(scoresList);
    console.log(matchList);
    scoresCSV = arrayCSV(scoresList);
    matchesCSV = arrayCSV(matchList);
    localStorage.currentTournament = tournamentName;
    localStorage.localMatches = matchesCSV;
    localStorage.localScores = scoresCSV;
    return
});



/*==============================================================================
*   Modular Functions
==============================================================================*/
// used to test whatever is currently being worked on
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
    matchesCSV = arrayCSV(matchList);
    localStorage.localMatches = matchesCSV;
    localStorage.currentTournament = tournamentName;
    console.log("MatchStorage:" + localStorage.localMatches);
}

//Takes an array and table id as input and adds the row to the table body
function addNewRow(rowData, tableId) {
    var table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    var row = table.insertRow(-1);
    rowCount++;
    row.id = String(tableId + '_row' + rowCount);
    for (i = 0; i < rowData.length; i++) {
        cell = row.insertCell(i);
        cell.id = String(tableId + '_row' + rowCount + '_cell' + i);
        cell.innerHTML = rowData[i];
    }
    console.log("Row Added to" + " " + tableId);
}

//Takes the name of an input field and determines which ONE item is checked. Used for scoring. It will return a 0 if no item is checked.
function checkedValue(inputName) {
    var value = $('input[name="' + inputName + '"]:checked').val();
    if (value) {
        value = value;
    } else {
        value = 0;
    }
    return value;
}


// Takes an input of a form Id and clears all checkbox, radio, number and text fields.(Used to clear the form after submitting a score)
function clearForm(formId) {
    $('#' + formId + ' ' + 'input[type=checkbox], #' + formId + ' ' + 'input[type=radio]').each(function() {
        this.checked = false;
    });
    $('#' + formId + ' ' + 'input[type=number]').each(function() {
        this.value = null;
    });
    $('#' + formId + ' ' + 'input[type=number], #' + formId + ' ' + 'input[type=text], #' + formId + ' ' + 'textarea').each(function() {
        this.value = null;
    });
}

//takes the id of a modal and then closes it. Could be replaced with jquerry
function closeModal(modalId) {
    modal = document.getElementById(modalId);
    modal.style.display = "none"
}

// Finds a value in a 2D array at a specified location
function find2DArrayIndex(array, value, position) {
    for (i = 0; i < array.length; i++) {
        var sub = array[i];
        if (sub[position] == value) {
            return i;
        }
    }
    if (value) {
        alert('No data exists for that value')
    }
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

//Takes input of a parent element and returns an array of unique names (created for use with getting the scores)
function getUniqueNameList(id) {
    var set = new Set();
    var ele = document.getElementById(id).elements;
    for (var i = 0; i < ele.length; i++) {
        set.add(ele[i].name)
    }
    var array = [...set]
    return array;
}

//Someone elses code to handel uploading a file and converting it to a variable
function handleFileSelect(evt) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            var myInput = e.target.result;
            console.log(myInput);
            uploadedFile = myInput;
            return;
        };
    })(f);
    reader.readAsText(f);
}

//Couldn't get it to read the array through a parameter variable, so this was split in half. Takes a csv and table ID with a hardcoded array to update the score or match list
function importMatchList(csv, tableID) {
    if (!csv) {
        return
    }
    matchesCSV = csv;
    localStorage.localMatches = matchesCSV;
    localStorage.currentTournament = tournamentName;
    console.log("MatchStorage:" + localStorage.localMatches);
    matchList = parseCSV(csv);
    var array = matchList;
    var i = 0;
    console.log(matchList);
    $('#' + tableID + ' ' + 'tbody').empty();
    while (i < array.length) {
        addNewRow(array[i], tableID);
        i++;
    }
}
//Couldn't get it to read the array through a parameter variable, so this was split in half. Takes a csv and table ID with a hardcoded array to update the score or match list
function importScoreList(csv, tableID) {
    if (!csv) {
        return
    }
    scoresCSV = csv;
    localStorage.localScores = scoresCSV;
    localStorage.currentTournament = tournamentName;
    console.log("ScoreStorage:" + localStorage.localScores);
    matchList = parseCSV(csv);
    var i = 0;
    console.log(matchList);
    $('#' + tableID + ' ' + 'tbody').empty();
    while (i < matchList.length) {
        addNewRow(matchList[i], tableID);
        i++;
    }
}

//Takes an input of the CSV string data and parses it into an array
function parseCSV(string) {
    var array = [];
    var stage1Array = string.split('\n');
    for (i = 1; i < stage1Array.length; i++) {
        var newArray = stage1Array[i - 1].split(',');
        array.push(newArray);
    }
    console.log(array);
    return array;
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
 */
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



//controls the load old match content modal window
$(document).ready(function() {
    var modal = document.getElementById('loadData');
    if (localStorage.localScores || localStorage.localMatches) {
        modal.style.display = "block";
        document.getElementById('modalContent').innerHTML = "Some old match data from the" + " <strong>" + localStorage.currentTournament + " " + "Tournament </strong> was found. Would you like to import it? Please note that all data not imported will be lost.";
        $('.close').click(function() {
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
/*==============================================================================
 *   Custom Functions called at other times
 */
// called by fillInTeamNumbers, it validates input and provides useful debugging info
function invalidIndexInput(array, value) {

    if (!value) {
        console.log('No number entered.');
        return true;
    }
    if (array.length < 1) { //input in range
        console.log('Data set is empty');
        return true;
    }
    if (value > array.length) { //input in range
        alert('Number out of range.');
        return true;
    }
}

//This takes the name of the div holding the score cards, the name of the field where the match number is entered and the match list array and then fills out the team number text field for each score card based on it. It activates when the text field loses focus.
function fillInTeamNumbers(divID, fieldID, array) {
    console.log(array);
    var divID;
    var ele = $('#' + divID).children();
    var value;
    var x = document.getElementById(fieldID).value; //User entered match number
    var index = find2DArrayIndex(array, x, 0);
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
    var modal1 = document.getElementById('importScores');
    var modal2 = document.getElementById('exportScores');
    var btn1 = document.getElementById("importButton");
    var btn2 = document.getElementById("exportButton");;
    btn1.onclick = function() {
        modal1.style.display = "block";
    }
    btn2.onclick = function() {
        modal2.style.display = "block";
    }
    $('.close').click(function() {
        $('.modal').css('display', 'none')
    })
    window.onclick = function(event) {
        if (event.target == modal1 || event.target == modal2) {
            $('.modal').css('display', 'none')
        }
    }
}
