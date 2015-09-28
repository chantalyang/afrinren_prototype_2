var map;
var all_hops = [];
var all_destination_ips = [];
var hop_path = [];
var probes = [];
var clicked_ip;
var traceroute_path;

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
	  },
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
	  },
	  	 {
	    "featureType": "poi",
	    "elementType":"geometry",
	    "stylers": [
	    { "visibility": "off" },
	      { "color": "#CCCCCC"},
	      { "saturation": -4 }
	    ]
	  }
	]

	

	map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 0.070959, lng: 23.923482}, //0.070959, 23.923482
	    zoom: 3,
	    styles: grey_scale,
	    streetViewControl: false,
	    zoomControl: true,
	   	 zoomControlOptions: {
	        position: google.maps.ControlPosition.LEFT_CENTER
	    	}
	}
);

	add_fibre_layer(map);
	add_destination_ip_layer(map);

	


}//Add init map function


function add_fibre_layer(gmap){
	fibre_data_layer = new google.maps.Data();
	fibre_data_layer.loadGeoJson("/data/fibre.json");
	fibre_data_layer.setStyle({strokeWeight: 2, strokeColor:"purple", strokeOpacity:0.4});
	fibre_data_layer.setMap(gmap);  

}

//Set colours for each ip per country
function style_ip(feature){

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


function add_destination_ip_layer(gmap){

	var  infoWindow = new google.maps.InfoWindow({
		content: "",
	});

	destination_ip_layer = new google.maps.Data();
	destination_ip_layer.loadGeoJson("/data/all_destination_ips.json");
	destination_ip_layer.setStyle(style_ip);

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
        if (infoWindow) {
	 		setTimeout(function () { infoWindow.close(); }, 5000);
	 	}
      });//End event listener

	 //Automatically close info window after 3 seconds
	 var dest_mouseout_listener = destination_ip_layer.addListener("mouseout",function(event) {

	 	if (infoWindow) {
	 		setTimeout(function () { infoWindow.close(); }, 3000);
	 	}

	 });

var dest_click_listener = destination_ip_layer.addListener("click", function(event) {
  		
  		var selected_marker = event.feature;
  		
  		destination_ip_layer.setMap(null);
  		
  		var coords = event.feature.getGeometry().get();
  		var selected_icon_style = {
  			path: google.maps.SymbolPath.CIRCLE,
			scale: 9,
			fillColor: this.style(selected_marker).icon.fillColor,
			fillOpacity:1,
			strokeWeight:2,
			strokeColor: "black",
  		}

  		//Show info window when ip_address clicked
  		renderInfoWindow(infoWindow, selected_marker);
  		if (infoWindow) {
	 		setTimeout(function () { infoWindow.close(); }, 5000);
	 	}
  		
	 	//Make new marker for chosen ip
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
  		 	probe_layer.setMap(null); //Remove probes from map
  		 	remove_hops();
  		 	removeLine(traceroute_path);
  		 })

  		 //Allow mouseover for new marker
  		 clicked_ip.addListener("mouseover", function(event){
  			renderInfoWindow(infoWindow, selected_marker)
  			
  		 	
  		 })

  		 add_probe_layer(map);

  		var ip_address = event.feature.getProperty("ip_address");
  		add_hops_to_map(ip_address);

  		
  	});//End click listener

	destination_ip_layer.setMap(gmap); 

}//End add destination ip

function renderInfoWindow(window, marker){
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

	var jsonFile = "/data/measurements/hops_to_" + selected_ip_address + ".json";
	
	var line_symbol = {
	    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
	    fillColor: 'red',
	    fillOpacity:1,
	    scale: 4,
	    strokeWeight: 1,
	    strokeColor: 'black'
  	};	

	hop_path = [];

	$.getJSON(jsonFile, function(json1) {
		$.each(json1, function(key, data) { //Loop through all the json fields
	    	var probe_id = data.prb_id;
	    	var protocol = data.proto;
	    	console.log(probe_id);
	    	console.log(protocol);
	    	if (data.prb_id == 4518)
	    		$.each(data.result, function(key, data){ //Loop through the results field 
	    			try{

	    				var lati = data.result.coordinates[0];
	    				var lngi = data.result.coordinates[1];
	    				var latLng = new google.maps.LatLng(lati, lngi); 
	    				var hop_num = data.hop.toString();


	    				console.log("Hop:" + hop_num + " coords: " + data.result.coordinates);

	    				hop_path.push({lat: parseFloat(lati), lng: parseFloat(lngi)});

	    				var hop_sym = {
	    					path: google.maps.SymbolPath.CIRCLE,
	    					scale:4,
	    					fillColor: "#18bc9c",
	    					fillOpacity: 1,
	    					strokeColor: "#4575b4",
	    					strokeWeight:1
	    				}

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

		//Draw lines 
        traceroute_path = new google.maps.Polyline({
        path: hop_path,
        icons: [{
          icon: line_symbol,
          offset: '100%'
        }],
        geodesic: true,
        strokeColor: 'black',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

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

function add_probe_layer(gmap){
	
	var probe_svg_path = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z";

	var probe_symbol = {
		path: probe_svg_path,
		scale:1.1,
		fillColor: '#fdb863',
		fillOpacity: 1,
		strokeColor: "black",
		strokeWeight:1,
		anchor: new google.maps.Point(15,10)
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