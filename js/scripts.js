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
var teamMatches = new Map();// map of matches divided by team
var tournamentName; //for importing matches, says when the last match data is from
var debug = 0; //used for debugging
var elements = ['Auto Beacon', 'Auto Particles (Center)', 'Auto Particles (Corner)', 'Auto Cap Ball', 'Auto Park', 'Teli-Op Beacons', 'Teli-Op Particles (Center)', 'Teli-Op Particles (Corner)', 'Cap Ball (Lift)'];//list of all the scoring elements this year
var scores = [];//holds match score for one team when constructing the team score object
/*==============================================================================
*   Variables that need manual setting ahead of time
==============================================================================*/
teamList = [33, 194, 354, 965, 1885, 2898, 4105, 4419, 4634, 4970, 5086, 5308, 5401, 5429, 5904, 6139, 6341, 6383, 6481, 6652, 7080, 7278, 7346, 7729, 7872, 7953, 7955, 7983, 8297, 8498, 8537, 8597, 8673, 8702, 8764, 9064, 9803, 9845, 9901, 10162, 10178, 10422, 10515, 10869, 11209, 11218, 11868, 12096];
teamList = [92,1280,1604,3110,4113,4013,5453,6172,6911,7129,8099,9662];
tournamentName = "Test";
/*==============================================================================
*   Test Functions
==============================================================================*/
function makeOverviewChart(data, svg) {
    $(svg).empty();
    var margin = {
            top: 20,
            right: 20,
            bottom: 50,
            left: 20
        },
        width = $('.chart').width() - margin.left - margin.right,
        height = $('.chart').height() - margin.top - margin.bottom,
        barWidth = width / data.length;

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map(function(d) {
                        return d.key;
                    })
        );
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 10]);

    var chart = d3.select(".svgChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return "" + d.key + ":" + " " + d.value;
        });
    chart.call(tool_tip);

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) {
            return "translate(" + i * barWidth + ",0)";
        })
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    bar.append("rect")
        .attr("y", height)
        .attr("width", barWidth - 1)

    .attr("height", 0)
        .transition()
        .duration(500) // Also NEW
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("height", function(d) {
            return height - y(d.value);
        });

    // Add the y Axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(5).tickSize(0));

    // Add the x Axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "end");
        //.style("display", "none");
}

//controls the scoring overview behavior
$(document).ready(function() {
  $('.overview').click(function(){
    var divID = $(this).attr("id");
    var label = $(this).html();
    var element = $(this).attr("data-element");
    groupToggleActive("overview", divID);
    overviewData(element, 'elementOverview', 'elementHeader', label);
  });
});

function overviewData(element, tableID, headerID, label) {
  clearTable(tableID);
  document.getElementById(headerID).innerHTML = "Overview of "+ " " + label;
  var sumArray = [];
    var team;
    var score;
    var key =[];
    var value = [];
    var teams = uniqueTeamList(scoresList, 0);
    for (i=0; i < teams.length; i++) {
      team = teamMatches.get(teams[i]);
      score = [...team];
      var teamValue = sumMapValue(score, 1, element);
      var a = [];
      a.push(teams[i], teamValue);
      sumArray.push(a);
    }
    sumArray.sort(function (a,b) {
    return b[1] - a[1];
});
for(i=0; i<sumArray.length; i++){
  key.push(sumArray[i][0]);
  value.push(sumArray[i][1]);
  addNewRow(sumArray[i], tableID);
}
var data = objectArray(key, value, "key","value");
console.log(objectArray);
}


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
    clearForm(formID);
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
    for (w = 0; w < rowData.length; w++) {
        cell = row.insertCell(w);
        cell.id = String(tableId + '_row' + rowCount + '_cell' + w);
        cell.innerHTML = rowData[w];
    }
    console.log("Row Added to" + " " + tableId);
}

//converts each array entry into a cell in a new row
function arrayToTable(array, tableID) {
    var table = document.getElementById(tableID).getElementsByTagName('tbody')[0];
    for (w = 0; w < array.length; w++) {
        var row = table.insertRow(-1);
        rowCount++;
        cell = row.insertCell(0);
        cell.innerHTML = array[w];
    }
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

//clears a table of everything in the table body using javascript
function clearTable(tableID) {
    $('#' + tableID + ' ' + 'tbody').empty();
}

//takes the id of a modal and then closes it. Could be replaced with jquerry
function closeModal(modalId) {
    modal = document.getElementById(modalId);
    modal.style.display = "none";
}

Array.prototype.clone = function() {
    return this.slice(0);
};

// Finds a value in a 2D array at a specified location
function find2DArrayIndex(array, value, position) {
    for (i = 0; i < array.length; i++) {
        var sub = array[i];
        if (sub[position] == value) {
            return i;
        }
    }
    if (value) {
        alert('No data exists for that value');
    }
}

// Finds the value in a 2D array at a specified location
function find2DArrayValue(array, position) {
    var newArray = [];
    for (i = 0; i < array.length; i++) {
        var sub = array[i];
        newArray.push(sub[position]);
    }
    return newArray;
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
        set.add(ele[i].name);
    }
    var array = [...set];
    return array;
}

//toggles active class fora given group. Takes the element id and the class of the group as inputs
function groupToggleActive(groupID, divID) {
    $('.' + groupID).each(function() {
        $(this).removeClass("active");
    });
    $('#' + divID).addClass("active");
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
        return;
    }
    matchesCSV = csv;
    localStorage.localMatches = matchesCSV;
    localStorage.currentTournament = tournamentName;
    console.log("MatchStorage:" + localStorage.localMatches);
    matchList = parseCSV(csv);
    console.log(matchList);
    for (i = 0; i < matchList.length; i++) {
        addNewRow(matchList[i], tableID);
    }
}
//Couldn't get it to read the array through a parameter variable, so this was split in half. Takes a csv and table ID with a hardcoded array to update the score or match list
function importScoreList(csv, tableID) {
    if (!csv) {
        return;
    }
    scoresCSV = csv;
    localStorage.localScores = scoresCSV;
    localStorage.currentTournament = tournamentName;
    console.log("ScoreStorage:" + localStorage.localScores);
    scoresList = parseCSV(csv);
    console.log(matchList);
    for (i = 0; i < scoresList.length; i++) {
        var pid = scoresList[i][0] + "_" + scoresList[i][1];
        console.log(pid);
        if (!scoreIDList.has(pid)) {
            scoreIDList.add(pid);
            addNewRow(scoresList[i], tableID);
        } else {
            console.log("That appears to be a duplicate entry and has been ignored");
        }
    }
}
//takes an array of a map and returns the average of the array each eement in the value array
function mapAverage(length, array) {
    var avgArray = [];
    var x = 0; // x is the total value so far
    var y = 0; //y is the value added to x
    for (i = 0; i < length; i++) { //iterates through each value within the
        for (n = 0; n < array.length; n++) {
            y = array[n][1][i];
            x = parseFloat(x) + parseFloat(y);
        }
        x = x / n; // get average
        x = Math.round(x * 100) / 100; // round average two places
        avgArray.push(x); //push into array
        x = 0; // reset x
        y = 0; //reset y
    }
    return avgArray;
}

//takes a 2D array and returns the sum of each column in the array
function mapSum(length, array) {
    var sumArray = [];
    var x = 0; // x is the total value so far
    var y = 0; //y is the value added to x
    for (i = 0; i < length; i++) { //iterates through each value within the
        for (n = 0; n < array.length; n++) {
            y = array[n][1][i];
            x = parseFloat(x) + parseFloat(y);
        }
        sumArray.push(x); //push into array
        x = 0; // reset x
        y = 0; //reset y
    }
    return sumArray;
}

//turns score list array into a map by team
function mapTeamScores(teamNumbers, teamScores) {
    var map = new Map();
    for (n = 0; n < teamNumbers.length; n++) {
        var newMap = new Map();
        for (i = 0; i < teamScores.length; i++) {
            var sub = teamScores[i];
            if (teamNumbers[n] == sub[0]) {
                newMap.set(sub[1], sub.splice(1, sub.length));
            }
        }
        map.set(teamNumbers[n], newMap);
    }
    return map;
}

//takes two arrays and two names and returns array of objects containing properties with the values from the arrays
function objectArray(array1, array2, type1, type2) {
    var array = [];
    var length = Math.min(array1.length, array2.length);
    for (q = 0; q < length; q++) {
        var obj = {};
        obj[type1] = array1[q];
        obj[type2] = array2[q];
        array.push(obj);
    }
    //console.log(array);
    return array;
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


// returns a sum of an array column derived from a map. The first value, q, is the first row, the p1 selects the value from the key, value pair and p2 selects the positon within the inner array.
function sumMapValue(array, p1, p2) {
    var x = 0;
    //console.log(array);
    for (q = 0; q < array.length; q++) {
        x = parseFloat(array[q][p1][p2]) + x;
    }
    return x;
}

//Takes the group class of all the tabs, the id of the active tab and the id of the corresponding content. After turning off all tabs it turns on the one seleccted
function tabControl(tabGroup, navID, divID) {
    $('.' + tabGroup).each(function() {
        $(this).removeClass("active");
    });
    $('#' + navID).addClass("active");
    $('#' + divID).addClass("active");
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

//given an array of values and the position of the team numbers in that array, this returns an array of unique team numbers
function uniqueTeamList(array, position) {
    var set = new Set();
    var teamNumbers = find2DArrayValue(array, position);
    for (i = 0; i < array.length; i++) {
        set.add(teamNumbers[i]);
    }
    teamNumbers = [...set];
    teamNumbers = teamNumbers.sort(function(a, b) {
        return a - b;
    });
    return teamNumbers;
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
    });
}

function fileUpload() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

//function that takes all score data and sorts it by team.
function getData(tableID, scoreArray) {
    clearTable(tableID);
    matchList = tableToArray('matches');
    scoresList = tableToArray('scores');
    var teamList = uniqueTeamList(scoreArray, 0);
    teamMatches = mapTeamScores(teamList, scoreArray);
    arrayToTable(teamList, tableID);
        //for (i=0;i<teamList.length; i++){
    console.log(teamList);
    //addNewRow(teamList[i],tableID)
    //}
}

//controls the load old match content modal window
$(document).ready(function() {
    var modal = document.getElementById('loadData');
    if (localStorage.localScores || localStorage.localMatches) {
        modal.style.display = "block";
        document.getElementById('modalContent').innerHTML = "Some old match data from the" + " <strong>" + localStorage.currentTournament + " " + "Tournament </strong> was found. Would you like to import it? Please note that all data not imported will be lost.";
        $('.close').click(function() {
            $('.modal').css('display', 'none');
        });
        window.onclick = function(event) {
            if (event.target == modal) {
                $('.modal').css('display', 'none');
            }
        };

        console.log("LocalStorage");
    }
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
    var ele = $('#' + divID).children();
    var value;
    var x = document.getElementById(fieldID).value; //User entered match number
    var index = find2DArrayIndex(array, x, 0);
    var newArray = findValueAt(index, array);
    if (invalidIndexInput(array, index + 1)) {
        return;
    }
    for (var i = 0; i < ele.length - 1; i++) { //the -1 is so that the clear div is not included
        value = newArray[i + 1];
        playerID = ele[i].id;
        $('#' + playerID + ' ' + 'input[id*="tnumber"]').val(value);
    }
}

// takes an object with two arrays, the first labled elements and the second score
function makeTeamChart(data, svg) {
    $(svg).empty();
    var margin = {
            top: 20,
            right: 20,
            bottom: 50,
            left: 20
        },
        width = $('.chart').width() - margin.left - margin.right,
        height = $('.chart').height() - margin.top - margin.bottom,
        barWidth = width / data.length;

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9]
            /*data.map(function(d) {
                        return d.element;
                    })*/
        );
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 10]);

    var chart = d3.select(".svgChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return "" + d.element + ":" + " " + d.score;
        });
    chart.call(tool_tip);

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) {
            return "translate(" + i * barWidth + ",0)";
        })
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    bar.append("rect")
        .attr("y", height)
        .attr("width", barWidth - 1)

    .attr("height", 0)
        .transition()
        .duration(500) // Also NEW
        .attr("y", function(d) {
            return y(d.score);
        })
        .attr("height", function(d) {
            return height - y(d.score);
        });

    // Add the y Axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(5).tickSize(0));

    // Add the x Axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "end");
        //.style("display", "none");
}


//Controls the modal box, will need to be updated to handle scores as well
function modalControl() {
    var modal1 = document.getElementById('importScores');
    var modal2 = document.getElementById('exportScores');
    var btn1 = document.getElementById("importButton");
    var btn2 = document.getElementById("exportButton");
    btn1.onclick = function() {
        modal1.style.display = "block";
    };
    btn2.onclick = function() {
        modal2.style.display = "block";
    };
    $('.close').click(function() {
        $('.modal').css('display', 'none');
    });
    window.onclick = function(event) {
        if (event.target == modal1 || event.target == modal2) {
            $('.modal').css('display', 'none');
        }
    };
}

//given a team number, it checks to see if the team exists in the team list set then changes the header to reflect the team chosen and populates the table based on the team picked.
function pullMatchData(value, tableID) {
    var team;
    var score;
    $('#analytics').css("visibility", "visible");
    clearTable(tableID);
    document.getElementById("teamHeader").innerHTML = "";
    if (teamMatches.get(value)) {
        team = teamMatches.get(value);
        score = [...team];
        document.getElementById("teamHeader").innerHTML = "Overview of Team #" + " " + value;
        for (n = 0; n < score.length; n++) {
            qualifyingPoints(score[n][1]);
            addNewRow(score[n][1], tableID);
        }
        var scoreSum = mapSum(score[0][1].length - 1, score);
        scoreSum.splice(0, 3);
        scoreSum.splice(9, 1);
        console.log(scoreSum);
        var data = objectArray(elements, scoreSum, 'element', 'score');
        makeTeamChart(data, '#svg1');
        var average = mapAverage(score[0][1].length - 1, score);
        qp = sumMapValue(score, 1, 1);
        average.splice(0, 2, "Average", qp);
        average.push("");
        addNewRow(average, tableID);
    } else {
        document.getElementById("teamHeader").innerHTML = "Team Not Found";
    }
}


//given the score array for a single match it determines if the team won, and what alliance they were on. It removes the unnecessary alliance score and swaps in QP instead of alliance.
function qualifyingPoints(array) {
    var redScore = array[3];
    var blueScore = array[2];
    var alliance = array[1];
    var check = array[13];
    var winner;
    var qp = 0;
    var rp = 0;
    if (parseFloat(redScore) > parseFloat(blueScore)) {
        winner = "red";
    } else if (parseFloat(redScore) < parseFloat(blueScore)) {
        winner = "blue";
    } else if (parseFloat(redScore) == parseFloat(blueScore)) {
        winner = "tie";
    }
    if (winner == alliance) {
        qp = 2;
    } else if (winner == "tie") {
        qp = 1;
    } else {
        qp = 0;
    }
    if (array.length > 14) {
        array.splice(1, 1, qp);
        if (alliance == "red") { //if red alliance and not yet spliced
            array.splice(2, 1);
        } else if (alliance == "blue") { //if blue alliance and not yet spliced
            array.splice(3, 1);
        }
    }

}

//Created by someone else, creates a range to select something
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
$('#matchTab tbody').live('click', function() {
    var thisTD = $(event.target).closest("td");
    $(event.target).closest("td").toggleClass('select');
    thisTD.attr('contenteditable', 'true');
    var oldValue = thisTD.text();
    var id = thisTD.attr('id');
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents(document.getElementById(id));
    selection.removeAllRanges();
    selection.addRange(range);
});
$('#matchTab tbody').live('blur', function() {
    var thisTD = $(event.target).closest("td");
    $(event.target).closest("td").toggleClass('select');
    thisTD.attr('contenteditable', 'false');
    matchList = tableToArray('matches');
    scoresList = tableToArray('scores');
    fillInTeamNumbers('scoreCards', 'matchNumber', matchList);
    scoresCSV = arrayCSV(scoresList);
    matchesCSV = arrayCSV(matchList);
    localStorage.currentTournament = tournamentName;
    localStorage.localMatches = matchesCSV;
    localStorage.localScores = scoresCSV;
    return;
});
$('#matchTab tbody').live('contextmenu', function(e) {
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
    return;
});

$('#teamListNav').live('click', function() {
    var thisTD = $(event.target).closest("td");
    var value = thisTD.text();
    pullMatchData(value, 'teamDataTable');
});
