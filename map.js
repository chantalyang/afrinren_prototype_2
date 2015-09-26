var map;
var all_hops = [];
var all_destination_ips = [];
var hop_path = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 3,
    streetViewControl: false,
});

	add_fibre_layer(map);
	//add_probe_layer(map);
	add_destination_ip_layer(map);


}

function add_fibre_layer(gmap){
	fibre_data_layer = new google.maps.Data();
	fibre_data_layer.loadGeoJson("/data/fibre.json");
	fibre_data_layer.setStyle({strokeWeight: 2, strokeColor:"purple", strokeOpacity:0.5});
	fibre_data_layer.setMap(gmap);  

}

function add_destination_ip_layer(gmap){
	
	var dest_ip_symbol = {
		path: google.maps.SymbolPath.CIRCLE,
		scale:6,
		fillColor: 'white',
		fillOpacity: 1,
		strokeColor: "red",
		strokeWeight:2,
	};

	var  infoWindow = new google.maps.InfoWindow({
		content: "",
	});

	destination_ip_layer = new google.maps.Data();
	destination_ip_layer.loadGeoJson("/data/all_destination_ips.json");
	//destination_ip_layer.setStyle({icon: dest_ip_symbol, clickable:true});
	destination_ip_layer.setMap(gmap); 

	 //Show destination IP info on mouseover
	 var dest_hover_listener = destination_ip_layer.addListener('mouseover', function(event) {

        //Display infowindow
        infoWindow.setContent("<b>" + event.feature.getProperty("name") + "</b>" +
        	"<br>" + "<b>ASN: </b> " + event.feature.getProperty("asn") +
        	"<br>" + " <b>IP Address:</b>" + event.feature.getProperty("ip_address"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);

      });//End event listener

	 //Automatically close info window after 3 seconds
	 var dest_mouseout_listener = destination_ip_layer.addListener("mouseout",function(event) {

	    if (infoWindow) {
    		setTimeout(function () { infoWindow.close(); }, 2500);
	    }

});


}


function add_measurement_layer(){
	$.getJSON("/data/test_measurement_1.json", function(json1) {
	    $.each(json1, function(key, data) { //Loop through all the json fields
	    	console.log(data.prb_id);
	    	if (data.prb_id == 13114){
	    		$.each(data.result, function(key, data){ //Loop through the results field 
	    			try{

	    				var lati = data.result.coordinates[0];
	    				var lngi = data.result.coordinates[1];
	    				var latLng = new google.maps.LatLng(lati, lngi); 
	    				var hop_num = data.hop.toString();


	    				

	    				console.log("Hop:" + hop_num + " coords: " + data.result.coordinates);

	    				var hop_sym = {
	    					path: google.maps.SymbolPath.CIRCLE,
	    					scale:6,
	    					fillColor: 'white',
	    					fillOpacity: 1,
	    					strokeColor: "blue",
	    					strokeWeight:2
	    				}

	    				var icon_string = "numbers3/number_"+hop_num+".png"

	    				var marker = new google.maps.Marker({
	    					position: latLng,
	    					map: map,
			            //label: hop_num,
			            icon: icon_string,
			            clickable: true
			        })

	    				all_hops.push(marker);
	    				

	    			}
	    			catch(err){

	    			}

	    		})
}

});
});}





function add_probe_layer(gmap){

	var probe_symbol = {
		path: google.maps.SymbolPath.CIRCLE,
		scale:6,
		fillColor: '#0ea7b5',
		fillOpacity: 1,
		strokeColor: "black",
		strokeWeight:2,
	};

	probe_layer = new google.maps.Data();
	probe_layer.loadGeoJson("/data/all_probes.json");
	probe_layer.setMap(gmap);
	probe_layer.setStyle({icon: probe_symbol, clickable: true});

	var  infoWindow = new google.maps.InfoWindow({
		content: "",
	});

	 //Mouseover events listener
	 var probe_mousover_listener = probe_layer.addListener('mouseover', function(event) {

        //Display infowindow
        infoWindow.setContent(event.feature.getProperty("name") + 
        	"<br>" + "<b>Probe ID: </b> " + event.feature.getProperty("probe_id") +
        	"<br>" + " <b>ASN:</b>" + event.feature.getProperty("asn"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);




      });//End event listener

	 var probe_click_listener = probe_layer.addListener("click", function(event){
	 	probe_layer.revertStyle();


	 	if (event.feature.getProperty("probe_id") == 13114) {
	 		add_measurement_layer(map);
	 	}

	 	probe_layer.overrideStyle(event.feature,
	 		{icon: {
	 			path: google.maps.SymbolPath.CIRCLE,
	 			fillColor: "#0ece4b",
	 			fillOpacity: 1,
	 			scale: 6,
	 			strokeColor: "black",
	 			strokeWeight:1,
	 		}, 
	 	});





	 });


	}

function addLine(polyline){
		polyline.setMap(map)
}

	function changeLayer(selected_layer){

		//Fibre
		if (selected_layer == "fibre"){
			if (document.getElementById("fibre_layer").checked == true){
				fibre_data_layer.setMap(map);
			}


			if (document.getElementById("fibre_layer").checked == false){
				fibre_data_layer.setMap(null);
			}
		}

		//Probes
		if (selected_layer == "probes"){
			if (document.getElementById("probe_layer").checked == true){
				probe_layer.setMap(map);
			}


			if (document.getElementById("probe_layer").checked == false){
				probe_layer.setMap(null);
			}
		}


	}