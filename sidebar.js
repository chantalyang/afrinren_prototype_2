
var dropdown = document.getElementById("protocol_dropdown");
dropdown.onchange = function(){
    var protocol = dropdown.options[dropdown.selectedIndex].text;
    //alert(selectedString);
    console.log(protocol);

}