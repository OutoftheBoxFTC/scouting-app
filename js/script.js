$( document ).ready(function() {
var height
$( ".check" ).click(function() {
  height = $('#scoreCards').height();
  console.log(height)
  $('#matchList').css("max-height",height);
  console.log('matchList height: ' + $('#matchList').height())

});
});
