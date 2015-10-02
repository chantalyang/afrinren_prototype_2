
var dropdown = document.getElementById("protocol_dropdown");
dropdown.onchange = function(){
    var protocol = dropdown.options[dropdown.selectedIndex].text;
    //alert(selectedString);
    console.log(protocol);

}

function display_data(dataSet){
    $(document).ready(function() {
    $('#hop_info_table').DataTable( {
        data: dataSet,
        "bSort": false,
        columns: [
            { title: "Country" },
            { title: "ASN" },
            { title: "IP Address" },
            { title: "Name" },
        ],
        "columnDefs":[{
        	"targets": 0,
        	"orderable": "false",
    	}]
    } );
} );
}

display_data(ip_address_data)

