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
