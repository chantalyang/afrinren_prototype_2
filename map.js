function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
    zoom: 3,
    streetViewControl: false,
});

	algeria = new google.maps.Data();
	algeria.loadGeoJson("Algeria.geojson");
	algeria.setStyle({strokeWeight: 1.5, strokeColor:"purple"});
	algeria.setMap(map);

	algeria.addListener('click', function(event){
		console.log(event.feature.getProperty("description"));
		algeria.overrideStyle(event.feature, {strokeColor:"red"});

	});


}