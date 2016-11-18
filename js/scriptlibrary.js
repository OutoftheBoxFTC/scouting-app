var matchList = []
var teamList = [118, 2821, 4106, 4318, 5040, 5414, 5421, 6029, 6054, 6253, 6700, 6987, 8297, 8393, 8395, 8463, 8498, 8645, 9794, 9872, 10353, 10808, 11261, 11362]

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

function helloWorld(element) {
  console.log(element + ' ' +'just lost focus!')
}

function addNewRow(rowData, tableId) {
    var table = document.getElementById(tableId);
    var row = table.insertRow(-1);

    for (i = 0; i < rowData.length; i++) {
        cell = row.insertCell(i);
        cell.innerHTML = rowData[i];
    }
}

function form2MatchList(myForm, tableId) {
    var newArray = []
    var ele = document.getElementById(myForm);
    var value;
    var matchCount = parseInt(ele.elements[0].value) + 1;

    console.log(matchCount);
    for (i = 0; i < ele.length; i++) {
        value = ele.elements[i].value;
        if (value > 0) {
            newArray.push(value);
        } else {
            alert('Oh No!' + ' ' + ele.elements[i].id + ' ' + 'is missing a value!');
            console.log(newArray);
            return;
        }
    }
    for (i = 0; i < ele.length; i++) {
        ele.elements[i].value = null;
    }
    addNewRow(newArray, 'matches');
    ele.elements[0].value = matchCount;
    matchList.push(newArray);
    ele.elements[0].focus();
    // console.log(matchList)
}