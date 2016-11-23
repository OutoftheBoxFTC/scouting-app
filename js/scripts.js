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
/*==============================================================================
*   Variables that need manual setting ahead of time
==============================================================================*/
teamList = [118, 2821, 4106, 4318, 5040, 5414, 5421, 6029, 6054, 6253, 6700, 6987, 8297, 8393, 8395, 8463, 8498, 8645, 9794, 9872, 10353, 10808, 11261, 11362];

/*==============================================================================
*   Test Functions
==============================================================================*/
// used to test whatever is currently being worked on




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
// jquery stuff goes in here
$(document).ready(function() {
    $("table#cartGrid tr td").click(function() {
        $(this).attr('contenteditable', 'true');
        $('table').find('td').click(function() {
            alert($(this).text());
        });
    });
});
/*==============================================================================
*   Modular Functions
==============================================================================*/
function tableToArray(array, tableID) { //takes an input a table and an array and
    var name = 'table#' + tableID + ' ' + 'tr';
    array =[];
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
    console.log(array);
}
/*==============================================================================
*   Custom Functions
==============================================================================*/
