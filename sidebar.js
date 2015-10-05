
// var dropdown = document.getElementById("protocol_dropdown");
// dropdown.onchange = function(){
//     var protocol = dropdown.options[dropdown.selectedIndex].text;
//     console.log(protocol);

// }
var rendered_table;

function display_ip_data(dataSet){

	change_text(sidebar_heading, "Destination IP Information");
	var back_button_probes = document.getElementById("show_ips_probes")
	var parent_div_2 = document.getElementById("btn_div");


	if (form != null){
	var inline_form = document.getElementById("probe_details");
	var parent_div = document.getElementById("probe_info");
	parent_div.removeChild(inline_form);
	
	var trace_buton = document.getElementById("show_all_traces");
	var back_button = document.getElementById("show_ips");
	var back_button_probes = document.getElementById("show_ips_probes")
	parent_div_2.removeChild(trace_buton);
	parent_div_2.removeChild(back_button);



	form = null
	}

	if (back_button_probes != null){
		parent_div_2.removeChild(back_button_probes);
	}


    $(document).ready(function() {
	    
	     rendered_table = $('#hop_info_table').DataTable( {
	        data: dataSet,
	        "bSort": false,
	        "bDestroy":true,

	        columns: [
	            { title: "Country" },
	            { title: "ASN" },
	            { title: "IP Address" },
	            { title: "Name" },
	        ],
	        
	    } );

	    ip_data_click();



} );

}//End display data

function ip_data_click(){

var infoWindow;
var highlighted = false;
var current_row = " ";
var data;
var row_index = " ";

	rendered_table.on('click', 'tr', function () {

        data = rendered_table.row( this ).data();
        var ip = data[2];
        var coordinates;

		var tr = $(this).closest("tr");
    	//console.log(row_index)
    	ip_mouseover = null;

        if (infoWindow){	
        	infoWindow.close();
		}

		if ((highlighted == true) && (row_index == tr.index())){
			$('#hop_info_table').find('tr.highlight').removeClass('highlight');
			map.setZoom(3);
			map.setCenter( {lat: 0.070959, lng: 23.923482})
			highlighted = false;
		}
		else{
        infoWindow = new google.maps.InfoWindow({
		content: "",
		});

 		$('#hop_info_table').find('tr.highlight').removeClass('highlight');
 		$(this).addClass('highlight');

        for (var i = 0; i < all_destination_ips.length; i++){
        	if (all_destination_ips[i].properties.ip_address == ip){
        		coordinates = all_destination_ips[i].geometry.coordinates;
        		lat = coordinates[1];
        		lng = coordinates[0];
        		var latLng = new google.maps.LatLng(lat, lng); 
        		map.setZoom(6);
				map.panTo(latLng);


				infoWindow.setContent("<b>" + all_destination_ips[i].properties.name + "</b>" +
					"<br>" + "<b>ASN: </b> " + all_destination_ips[i].properties.asn  +
					"<br>" + " <b>IP Address:</b>" + all_destination_ips[i].properties.ip_address );
				var anchor = new google.maps.MVCObject();
				anchor.set("position",latLng);
				infoWindow.open(map,anchor);

			if (infoWindow) {
	        	setTimeout(function () { infoWindow.close(); }, 2000);
	        }


        	}
        }//End for
        
        highlighted = true;
        row_index = tr.index();

    }


            } );
}

display_ip_data(ip_address_data);