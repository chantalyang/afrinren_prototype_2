var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 3,
    streetViewControl: false,
});

  add_fibre_layer(map);


}

function add_fibre_layer(gmap){
	fibre_data_layer = new google.maps.Data();
	fibre_data_layer.loadGeoJson("fibre.json");
	fibre_data_layer.setStyle({strokeWeight: 1, strokeColor:"purple"});
	fibre_data_layer.setMap(gmap);  

}

function changeLayer(selected_layer){

	if (document.getElementById("fibre").checked == true){
			fibre_data_layer.setMap(map);
	}
	

	if (document.getElementById("fibre").checked == false){
		fibre_data_layer.setMap(null);
	}

}