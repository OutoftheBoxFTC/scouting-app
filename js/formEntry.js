Array.prototype.contains = function(v) {
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
  $('input[type=checkbox]').each(function()
{
        this.checked = false;
});
}

function checkedValue(inputName) {
  var value = $('input[name="'+inputName+'"]:checked').val();
  if(value){
    value = value;
  }
  else {
    value = 0;
  }
  return value;
}
function getScores(id) {
    var scores = [];
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
      if(type == "checkbox" || type == "radio"){
        value = checkedValue(names[i]);
        scores.push(value)
      }
      }
    return scores;
}
function matchData() {
  var teamNumber;
}
function score() {
  var scores = []
  var ele = $('#scoreCards').children();
  for(i = 0; i<ele.length; i++){
    if(!ele[i].classList.contains('noShow')){
      scores = getScores(ele[i].id)
      allScores.push(scores);
      //addNewRow(scores, 'scoreTable')
      console.log(ele[i].id + ' ' +scores);
        } else {
        }
  }
console.log(allScores);
}
