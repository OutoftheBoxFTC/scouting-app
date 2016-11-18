// takes an input of an HTML element id and then toggles visibility. Requires the CSS class "noShow"
function toggleShow(id) {
    var cls = "noShow";
    var element = document.getElementById(id);
    element.classList.toggle(cls);
}

function helloWorld(element) {
  console.log(element + ' ' +'just lost focus!')
}
