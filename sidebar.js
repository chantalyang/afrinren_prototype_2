
var dropdown = document.getElementById("protocol_dropdown");
dropdown.onchange = function(){
    var protocol = dropdown.options[dropdown.selectedIndex].text;
    //alert(selectedString);
    console.log(protocol);

}

var dataSet = [
    [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
    [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
    [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
    [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
    [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
    [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
    [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
    [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
    [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
    [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ]]

function display_data(){
    $(document).ready(function() {
    $('#hop_info_table').DataTable( {
        data: dataSet,
        "bSort": false,
        columns: [
            { title: "Hop Number" },
            { title: "Country" },
            { title: "IP Address" },
            { title: "RTT" },
        ],
        "columnDefs":[{
        	"targets": 0,
        	"orderable": "false",
    	}]
    } );
} );
}

display_data()