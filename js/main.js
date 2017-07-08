$(document).ready(function(){
    $("#p2").hide();
})


function change(actual, go){
    $("#p"+actual).hide();
    $("#p"+go).show();
}