var matchList = [];
var playerList =['b1_','b2_','r1_', 'r2_']
var teamList = [118, 2821, 4106, 4318, 5040, 5414, 5421, 6029, 6054, 6253, 6700, 6987, 8297, 8393, 8395, 8463, 8498, 8645, 9794, 9872, 10353, 10808, 11261, 11362];

var error = false;
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

function helloWorld(parameter) {
  console.log(parameter + ' ' +'just lost focus!')
}

// Takes a form and array as input and pushes the form values to the array. Doesn't work with lists
function formArray(formID, array) { //in the future, set to return array
  var ele = document.getElementById(formID);
  var value;

  for (i=0; i < ele.length; i++){ //runs through form and adds values to the array. It will exit if any of the values are missing
    value = ele.elements[i].value;
    if (value){
      array.push(value);
    }
    else {
      alert('Missing Value');
      error=true;
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
}

//Clears all values from a given form
function formReset(formID) {
  var ele = document.getElementById(formID);

  for (i = 0; i < ele.length; i++) {
      ele.elements[i].value = null;
  }
}

//custom method that takes the match input, pushes it to an array, adds it to the specified table and then resets the form
function addMatch(formID, tableID, resetID, array) {
  var newArray = [];
  var ele = document.getElementById(formID);
  var matchCount = parseInt(ele.elements[0].value) + 1;

  formArray(formID, newArray);
  if(error){
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

//takes match number and pulls up match in matchList
function getTeam(fieldID, matchArray, playerArray){
  if(matchArray.length <1){
    console.log('No matches logged');
    return
  }
  var value = document.getElementById(fieldID).value;
  if (value > matchArray.length){
    console.log('Match Number out of range.');
    return;
  }
  /*var x= value - 1; 
  var  array = matchArray[x];
  var valueA;
  if(value){
     console.log('Match ' + value);
  }
    for(i = 0; i <playerList.length; i++){
      value = array[i+1];
      var teamID = playerArray[i]+'tnumber';
      valueA= document.getElementById(teamID).value;
      if(valueA){ //if the box already has something
        if (confirm("Overwrite Current Matches?") == true) {
        document.getElementById(teamID).value = value;
    } else {
      console.log('User cancelled action.')
        return;
    }
      }
    }
  }
  else{
    console.log('No value entered')
  }*/
}