var map;
var all_hops = [];
var all_destination_ips = [];
var hop_path = [];
var clicked_ip;

function initMap() {
	
	//Define style of base map - http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html 
	var map_style_1 = [
	  {
	    "featureType": "water",
	    "stylers": [
	      { "visibility": "on" },
	      { "lightness": 32 },
	      { "saturation": -5 }
	    ]
	  },{
	    "featureType": "landscape.natural.landcover",
	    "stylers": [
	      { "saturation": -30 },
	      { "lightness": 25 }
	    ]
	  },{
	  }
	]

	var map_style_2 = [
	  {
	    "featureType": "water",
	    "stylers": [
	      { "visibility": "on" },
	      { "saturation": -33 },
	      { "weight": 0.1 },
	      { "hue": "#0088ff" },
	      { "color": "#ebf2f6" }
	    ]
	  },{
	    "featureType": "landscape.natural.landcover",
	    "stylers": [
	      { "saturation": -14 },
	      { "visibility": "on" }
	    ]
	  },{
	  }
	]

	var grey_scale =[
	  {
	    "featureType": "water",
	    "stylers": [
	      { "visibility": "on" },
	      { "saturation": -33 },
	      { "weight": 0.1 },
	      { "hue": "#0088ff" },
	      { "color": "#fefefd" }
	    ]
	  },{
	    "featureType": "landscape.natural.landcover",
	    "stylers": [
	      { "visibility": "on" },
	      { "saturation": -4 },
	      { "color": "#CCCCCC" }
	    ]
	  },{
	  }
	]

	

	map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
	    zoom: 3,
	    styles: map_style_1,
	    streetViewControl: false,
	    zoomControl: true,
	   	 zoomControlOptions: {
	        position: google.maps.ControlPosition.LEFT_CENTER
	    	}
	}
);

	add_fibre_layer(map);
	//add_probe_layer(map);
	add_destination_ip_layer(map);

	var dest_click_listener = destination_ip_layer.addListener("click", function(event) {
  		
  		var selected_marker = event.feature;
  		
  		destination_ip_layer.setMap(null);
  		
  		var ip_address = event.feature.getProperty("ip_address");
  		var coords = event.feature.getGeometry().get();
  		var selected_icon_style = {
  			path: google.maps.SymbolPath.CIRCLE,
			scale: 8,
			fillColor: this.style(selected_marker).icon.fillColor,
			fillOpacity:1,
			strokeWeight:2,
			strokeColor: "black",
  		}

  		//console.log(coords);

  		 clicked_ip = new google.maps.Marker({
           	icon: selected_icon_style, //Keep styling of selected icon
            position: coords,
            map: map,
            clickable: true
  			});

  		 clicked_ip.addListener("click", function(event){console.log("Clicked");})


  	});


}//Add init map function


function add_fibre_layer(gmap){
	fibre_data_layer = new google.maps.Data();
	fibre_data_layer.loadGeoJson("/data/fibre.json");
	fibre_data_layer.setStyle({strokeWeight: 2, strokeColor:"purple", strokeOpacity:0.4});
	fibre_data_layer.setMap(gmap);  

}

function add_destination_ip_layer(gmap){
	
	var country_colour_1 = {
		"AO": "white", 
		"BW": "#1f78b4", 
		"CD": "#35978f",
		"ET": "#33a02c",
		"KE": "#fb9a99",
		"MG": "#e31a1c",
		"MW" : "#fdbf6f",
		"MZ" : "#ff7f00",
		"NA": "#cab2d6",
		"RW": "#6a3d9a",
		"ZA": "#ffff99",
		"TZ": "#b15928" ,
		"UG": "#8c510a",
		"ZM": "#bf812d",
		"ZW": "#bababa"	
					}
	// var country_colour_2 = {				
	// 	"AO": "#9e0142", 
	// 	"BW": "#d53e4f", 
	// 	"CD": "#f46d43",
	// 	"ET": "#fdae61",
	// 	"KE": "#ffffbf",
	// 	"MG": "#e6f598",
	// 	"MW" : "#abdda4",
	// 	"MZ" : "#66c2a5",
	// 	"NA": "#3288bd",
	// 	"RW": "#5e4fa2",
	// 	"ZA": "#ffff99",
	// 	"TZ": "#b15928" ,
	// 	"UG": "#8c510a",
	// 	"ZM": "#dfc27d",
	// 	"ZW": "#bababa"		
	// 		}

	var  infoWindow = new google.maps.InfoWindow({
		content: "",
	});

	destination_ip_layer = new google.maps.Data();
	destination_ip_layer.loadGeoJson("/data/all_destination_ips.json");
	destination_ip_layer.setStyle(style_ip);
	destination_ip_layer.setMap(gmap); 

	//Set colours for each ip per country
	function style_ip(feature){
		for (var key in country_colour_1){
			if (feature.getProperty("country") == key){
				colour = country_colour_1[key];
			}
		}

		return {
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 6,
				fillColor: colour,
				fillOpacity:1,
				strokeWeight:2,
				strokeColor: "black",
			},
      
    	  
  		};
  	}

  	add_geojson_to_array("/data/all_destination_ips.json");

	
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
	 		setTimeout(function () { infoWindow.close(); }, 3000);
	 	}

	 });

}

function add_geojson_to_array(file){	
  	 $.getJSON(file)
	    .done(function (data) {
	    all_destination_ips = data.features;
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