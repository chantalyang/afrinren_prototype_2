var map;
var all_hops = [];
var all_destination_ips = [];
var hop_path = [];
var probes = [];
var clicked_ip;
var traceroute_path;
var ixp_svg_path = "M15.5,3.029l-10.8,6.235L4.7,21.735L15.5,27.971l10.8-6.235V9.265L15.5,3.029zM24.988,10.599L16,15.789v10.378c0,0.275-0.225,0.5-0.5,0.5s-0.5-0.225-0.5-0.5V15.786l-8.987-5.188c-0.239-0.138-0.321-0.444-0.183-0.683c0.138-0.238,0.444-0.321,0.683-0.183l8.988,5.189l8.988-5.189c0.238-0.138,0.545-0.055,0.684,0.184C25.309,10.155,25.227,10.461,24.988,10.599z"


function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
	    zoom: 3,
	    styles: grey_scale,
	   //styles: map_style_1,
	   streetViewControl: false,
	   panControl:true,
	   zoomControl: true,
	   zoomControlOptions: {
	   	position: google.maps.ControlPosition.LEFT_CENTER,
	   	
	   }
	   
	}
	);



	load_fibre_JSON();
	load_probe_JSON();
	add_destination_ip_layer(map);

}//Add init map function


function load_fibre_JSON(){
	fibre_data_layer = new google.maps.Data();
	fibre_data_layer.loadGeoJson("/data/fibre.json");
	fibre_data_layer.setStyle({strokeWeight: 2, strokeColor:"purple", strokeOpacity:0.4});
}

function load_probe_JSON(){

	//var probe_svg_path = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z";
	//var probe_svg_path = "M3.25,6.469v19.062h25.5V6.469H3.25zM10.345,11.513l-4.331,1.926V12.44l3.124-1.288v-0.018L6.014,9.848v-1l4.331,1.927V11.513zM16.041,14.601h-5.05v-0.882h5.05V14.601z";
	var probe_svg_path ="M23.963,20.834L17.5,9.64c-0.825-1.429-2.175-1.429-3,0L8.037,20.834c-0.825,1.429-0.15,2.598,1.5,2.598h12.926C24.113,23.432,24.788,22.263,23.963,20.834z";

	var probe_symbol = {
		path: probe_svg_path,
		scale:1,
		fillColor: 'blue',
		fillOpacity: 1,
		strokeColor: "white",
		strokeWeight:1,
		anchor: new google.maps.Point(15,10)
	};

	probe_layer = new google.maps.Data();
	probe_layer.loadGeoJson("/data/all_probes.json");
	probe_layer.setStyle({icon: probe_symbol, clickable: true});
}

function add_destination_ip_layer(gmap){

	var  infoWindow = new google.maps.InfoWindow({
		content: "",
	});

	destination_ip_layer = new google.maps.Data();
	destination_ip_layer.loadGeoJson("/data/all_destination_ips.json");
	destination_ip_layer.setStyle(style_ip);

	add_geojson_to_array("/data/all_destination_ips.json");
	
	//Show destination IP info on mouseover
	destination_ip_layer.addListener('mouseover', function(event) {
        //Display infowindow
        infoWindow.setContent("<b>" + event.feature.getProperty("name") + "</b>" +
        	"<br>" + "<b>ASN: </b> " + event.feature.getProperty("asn") +
        	"<br>" + " <b>IP Address:</b>" + event.feature.getProperty("ip_address"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);
      });//End event listener

	 //Automatically close info window after 5 seconds
	 destination_ip_layer.addListener("mouseout",function(event) {
	 	if (infoWindow) {
	 		setTimeout(function () { infoWindow.close(); }, 4000);
	 	}

	 });

	//Click destination IP listener
	destination_ip_layer.addListener("click", function(event) {

		var selected_marker = event.feature;

		var coords = event.feature.getGeometry().get();

		var selected_icon_style = {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 9,
			fillColor: this.style(selected_marker).icon.fillColor,
			fillOpacity:1,
			strokeWeight:1.5,
			strokeColor: "black",
		}

	 	//Remove all IPs
	 	destination_ip_layer.setMap(null); 

	 	//Then make and place new marker for chosen ip
	 	clicked_ip = new google.maps.Marker({
           	icon: selected_icon_style, //Keep styling of selected icon
           	position: coords,
           	map: map,
           	clickable: true,
           });

  		 //When marker clicked, remove current marker + add destination IP layer
  		 clicked_ip.addListener("click", function(event){
  		 	clicked_ip.setMap(null);  
  		 	add_destination_ip_layer(map); //Re-add destination IPs
  		 	//probe_layer.setMap(null); //Remove probes from map
  		 	remove_hops();
  		 	removeLine(traceroute_path);
  		 	traceroute_path = [];
  		 })

  		 //Allow mouseover for new marker
  		 clicked_ip.addListener("mouseover", function(event){
  		 	render_IPinfoWindow(infoWindow, selected_marker)	

  		 })

  		 //Set mouseout listener
  		 clicked_ip.addListener("mouseout", function(event){
  		 	if (infoWindow) {
  		 		setTimeout(function () { infoWindow.close(); }, 3000);
  		 	} 	 	
  		 })

  		// add_probe_layer(map);

  		//Add hops to map of selected IP marker
  		//console.log("Coordinates of clicked " + clicked_ip.position);
  		clicked_ip_address = event.feature.getProperty("ip_address");
  		add_hops_to_map(clicked_ip_address);

  		
  	});//End click listener

destination_ip_layer.setMap(gmap); 

}//End add destination ip

function render_IPinfoWindow(window, marker){
	var  infoWindow = window; 

	infoWindow.setContent("<b>" + marker.getProperty("name") + "</b>" +
		"<br>" + "<b>ASN: </b> " + marker.getProperty("asn") +
		"<br>" + " <b>IP Address:</b>" + marker.getProperty("ip_address"));
	var anchor = new google.maps.MVCObject();
	anchor.set("position",event.latLng);
	infoWindow.open(map,anchor);

}

function add_geojson_to_array(file){	
	$.getJSON(file)
	.done(function (data) {
		all_destination_ips = data.features;
	});
}

function remove_hops (){
	for (var i = 0; i < all_hops.length; i++){
		all_hops[i].setMap(null);
	}
}

function add_hops_to_map(selected_ip_address){

	var jsonFile = "/data/measurements/best_of_protocols/hops_to_" + selected_ip_address + ".json";
	
	var line_symbol = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		//fillColor: 'red',
	    //fillOpacity:1,
	    //scale: 3,
	    //strokeWeight: 1,
	    //strokeColor: 'black'
	};

	var hop_sym = {
		path: google.maps.SymbolPath.CIRCLE,
		scale:4,
		//fillColor: "#18bc9c",
		fillColor: "#0cd410",
		fillOpacity: 1,
		//strokeColor: "#4575b4",
		strokeWeight:1
	}


	hop_path = []; //Clear hop path array

	$.getJSON(jsonFile, function(json1) {
		$.each(json1, function(key, data) { //Loop through all the json fields
			var probe_id = data.prb_id;
			var protocol = data.proto;
	    	//console.log(probe_id);
	    	//console.log(protocol);
	    	if (data.prb_id == 4518)
	    		$.each(data.result, function(key, data){ //Loop through the results field 
	    			try{

	    				var lati = data.result.coordinates[0];
	    				var lngi = data.result.coordinates[1];
	    				var latLng = new google.maps.LatLng(lati, lngi); 
	    				var hop_num = data.hop.toString();
	    				var country_name = getCountryName(data.result.country);
	    				console.log(country_name);


	    				console.log("Hop:" + hop_num + " coords: " + data.result.coordinates);

	    				hop_path.push({lat: parseFloat(lati), lng: parseFloat(lngi)});

	    				
	    				//var icon_string = "numbers3/number_"+hop_num+".png"

	    				var marker = new google.maps.Marker({
	    					position: latLng,
	    					map: map,
	    					icon: hop_sym,
	    					clickable: true
	    				})

	    				all_hops.push(marker);
	    			}
	    			catch(err){

	    			}//End catch

	    		})//End inner each

	    });//End outer each

function remove_extra_markers(hops){
	
	for (var i = 0; i < hops.length; i++){
		if (JSON.stringify(clicked_ip.position) === JSON.stringify(all_hops[i].position)){ 
						     	 	console.log("True");
						     	 	all_hops[i].setMap(null);
						     	}
					     }
}
	

		//Draw traceroute lines lines 
		traceroute_path = new google.maps.Polyline({
			path: hop_path,
			icons: [{
				icon: line_symbol,
				offset: '100%',
	         // repeat: "100px"
	     }],
	     geodesic: true,
	     strokeColor: 'black',
	     strokeOpacity: 1.0,
	     strokeWeight: 2
	 });

		remove_extra_markers(all_hops);
		addLine(traceroute_path);
		animateArrow(traceroute_path);

});}//End add_hop_measurement



function addLine(polyline){
	polyline.setMap(map)
}

function removeLine(polyline){
	polyline.setMap(null)
}

function animateArrow(line) {
// Use the DOM setInterval() function to change the offset of the symbol at fixed intervals.
var count = 0;
window.setInterval(function() {
      count = (count + 0.5) % 200; //change count number to make arrow slower
      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
  }, 20);

}

function animate(route) { //функция анимирует каждый первый символ каждой полилинии
	var count = 0;
	icons = null;
	var lnght=route.length;
	offsetId = window.setInterval(function() {
		count = (count + 1) % 200;
		for(var i= 0; i < lnght; i++){
			icons = route[i].get('icons');
			icons[0].offset = (count / 2) + '%';
			route[i].set('icons', icons);
		}
	}, 40);
}



function add_probe_layer(gmap){

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

        if (infoWindow) {
        	setTimeout(function () { infoWindow.close(); }, 3000);
        }


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