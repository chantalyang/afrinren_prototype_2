var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 3,
    streetViewControl: false,
});

	add_fibre_layer(map);
	add_probe_layer(map);
	add_measurement_layer();
	

}

function read_json(){
	$.getJSON("/data/test_measurement_1.json", function(json1) {
	    $.each(json1, function(key, data) { //Loop through all the json fields
	    	console.log(data.prb_id);
	    	 $.each(data.result, function(key, data){ //Loop through the results field 
	    	 	try{
		    	 	var lat = data.result.coordinates[0];
		    	 	var lng = data.result.coordinates[1];
	    	 		var latLng = new google.maps.LatLng(lat, lng); 
	    	 		var hop_num = data.hop.toString();

	    	 	//console.log(data.result.coordinates[0])
	    	 	//console.log(data.result.coordinates[1])
			    	var marker = new google.maps.Marker({
		            position: latLng,
		            map: map,
		            label: hop_num
		        })
			    }
			  catch(err){

			  }

	    	})
    });
});
}

function add_measurement_layer(){
	read_json();
}

function add_fibre_layer(gmap){
	fibre_data_layer = new google.maps.Data();
	fibre_data_layer.loadGeoJson("/data/fibre.json");
	fibre_data_layer.setStyle({strokeWeight: 1, strokeColor:"purple", strokeOpacity:0.5});
	fibre_data_layer.setMap(gmap);  

}

function add_probe_layer(gmap){

	var probe_symbol = {
		path: google.maps.SymbolPath.CIRCLE,
		scale:6,
		fillColor: 'white',
		fillOpacity: 1,
		strokeColor: "red",
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