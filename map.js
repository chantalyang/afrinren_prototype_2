var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 3,
    streetViewControl: false,
});

  add_fibre_layer(map);

	//Geojson
	// za = new google.maps.Data();
	// za.loadGeoJson("za.json");
	// za.setStyle({strokeWeight: 1, strokeColor:"purple"});
	// za.setMap(map);



}

function add_fibre_layer(gmap){
	fibre_data_layer = new google.maps.Data();
	fibre_data_layer.loadGeoJson("final.json");
	fibre_data_layer.setStyle({strokeWeight: 1, strokeColor:"purple"});
	fibre_data_layer.setMap(gmap);  

}