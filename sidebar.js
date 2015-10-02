
// var dropdown = document.getElementById("protocol_dropdown");
// dropdown.onchange = function(){
//     var protocol = dropdown.options[dropdown.selectedIndex].text;
//     console.log(protocol);

// }

function display_ip_data(dataSet){
    $(document).ready(function() {
	    
	    var table = $('#hop_info_table').DataTable( {
	        data: dataSet,
	        "bSort": false,

	        columns: [
	            { title: "Country" },
	            { title: "ASN" },
	            { title: "IP Address" },
	            { title: "Name" },
	        ],
	        
	    } );



var infoWindow;
var highlighted = false;
var current_row = " ";
var data;
var row_index = " ";

	$('#hop_info_table tbody').on('click', 'tr', function () {

        data = table.row( this ).data();
        var ip = data[2];
        var coordinates;

		var tr = $(this).closest("tr");
    	console.log(row_index)

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

        	}
        }//End for

        highlighted = true;
        row_index = tr.index();

    }


            } );

} );

}//End display data

display_ip_data(ip_address_data)
