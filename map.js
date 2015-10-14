var map;
var all_hops = [];
var all_destination_ips = [];
var hop_path = [];
var all_probes = [];
var clicked_ip;
var traceroute_path;
var ixp_svg_path = "M15.5,3.029l-10.8,6.235L4.7,21.735L15.5,27.971l10.8-6.235V9.265L15.5,3.029zM24.988,10.599L16,15.789v10.378c0,0.275-0.225,0.5-0.5,0.5s-0.5-0.225-0.5-0.5V15.786l-8.987-5.188c-0.239-0.138-0.321-0.444-0.183-0.683c0.138-0.238,0.444-0.321,0.683-0.183l8.988,5.189l8.988-5.189c0.238-0.138,0.545-0.055,0.684,0.184C25.309,10.155,25.227,10.461,24.988,10.599z"
//var all_measurements = [];
var dictionary = {};
var dict = {};
var nested_dictionary = {};
var all_traceroute_polylines = [];
var line_symbol;
var probe_traceroutes = {};
var probe_id;
var selected_traceroute_polyline;
var used_probes = [];
var selected_traceroute_data = [];
var all_measurements_data;
var ixp_data_layer;
var infoWindow;

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

	infoWindow = new google.maps.InfoWindow({
		content: "",
	});

	load_fibre_JSON();
	load_probe_JSON();
	load_ixps_JSON();
	add_destination_ip_layer(map);

}//Add init map function

function load_ixps_JSON(){

	//var star_svg_path = "M16,22.375L7.116,28.83l3.396-10.438l-8.883-6.458l10.979,0.002L16.002,1.5l3.391,10.434h10.981l-8.886,6.457l3.396,10.439L16,22.375L16,22.375z";
	var triangle_svg_path ="M23.963,20.834L17.5,9.64c-0.825-1.429-2.175-1.429-3,0L8.037,20.834c-0.825,1.429-0.15,2.598,1.5,2.598h12.926C24.113,23.432,24.788,22.263,23.963,20.834z";

	var ixp_symbol = {
		path: triangle_svg_path,
		scale:0.8,
		fillColor: '#dd1c77',
		fillOpacity: 1,
		strokeColor: "white",
		strokeWeight:1,
		anchor: new google.maps.Point(15,16)
	};


	ixp_data_layer = new google.maps.Data();
	ixp_data_layer.loadGeoJson("/data/ixps.json");
	ixp_data_layer.setStyle({icon: ixp_symbol, clickable: true} );
}

function ixp_mouseover(){

	infoWindow.content = "";

	 //Mouseover events listener
	 ixp_data_layer.addListener('mouseover', function(event) {


        //Display infowindow
        infoWindow.setContent("<font color=#dd1c77> <b>" + event.feature.getProperty("long_name") + "</b></font>" + 
        	"<br>" + "<b>Exchange Point ID: </b> " + event.feature.getProperty("exchange_point_id") +
        	"<br>" + " <b>Type:</b>" + event.feature.getProperty("organization_type"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);



      });//End event listener

	 destination_ip_layer.addListener("mousemove",function(event) {
        if (infoWindow) {
         infoWindow.close();

                 }
    });

	 if (infoWindow) {
	 		setTimeout(function () { infoWindow.close(); }, 1000);
	 	}

	}


	function load_fibre_JSON(){
		fibre_data_layer = new google.maps.Data();
		fibre_data_layer.loadGeoJson("/data/fibre.json");
		fibre_data_layer.setStyle({strokeWeight: 2, strokeColor:"#31a354", strokeOpacity:0.5});
	}

	function load_probe_JSON(){

	//var probe_svg_path = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z";
	//var probe_svg_path = "M3.25,6.469v19.062h25.5V6.469H3.25zM10.345,11.513l-4.331,1.926V12.44l3.124-1.288v-0.018L6.014,9.848v-1l4.331,1.927V11.513zM16.041,14.601h-5.05v-0.882h5.05V14.601z";
	var triangle_svg_path ="M23.963,20.834L17.5,9.64c-0.825-1.429-2.175-1.429-3,0L8.037,20.834c-0.825,1.429-0.15,2.598,1.5,2.598h12.926C24.113,23.432,24.788,22.263,23.963,20.834z";
	var diamond_svg_path ="M -2,0 0,-2 2,0 0,2 z";

	var probe_symbol = {
		//path: triangle_svg_path,
		path: diamond_svg_path,
		//scale:0.8,
		scale:4,
		fillColor: 'blue',
		fillOpacity: 1,
		strokeColor: "white",
		strokeWeight:1,
		//anchor: new google.maps.Point(15,16)
	};

	probe_layer = new google.maps.Data();
	probe_layer.loadGeoJson("/data/all_probes.json");
	probe_layer.setStyle({icon: probe_symbol, clickable: true});

	add_probes_to_array("/data/all_probes.json");


}

var ip_mouseover;

function add_destination_ip_layer(gmap){

	infoWindow.content = "";

	destination_ip_layer = new google.maps.Data();
	destination_ip_layer.loadGeoJson("/data/all_destination_ips.json");
	destination_ip_layer.setStyle(style_ip);

	add_ips_to_array("/data/all_destination_ips.json");
	
	//Show destination IP info on mouseover
	ip_mouseover = destination_ip_layer.addListener('mouseover', function(event) {
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

	 	map.setZoom(3);
	 	map.setCenter( {lat: 0.070959, lng: 23.923482})

  		 //When marker clicked, remove current marker + add destination IP layer
  		 clicked_ip.addListener("click", function(event){
  		 	
  		 	clicked_ip.setMap(null); //Remove current marker 
  		 	add_destination_ip_layer(map); //Re-add destination IPs
  		 	
  		 	probe_layer.setMap(null); //Remove probes from map
  		 	document.getElementById("probe_layer").checked = false;
  		 	load_probe_JSON(); //Reload probes

  		 	remove_hops(); //Remove hops
  		 	remove_traceroutes(); //Remove all selected traceroutes
  		 	
  		 	if (selected_traceroute_polyline != null)
  		 		removeLine(selected_traceroute_polyline);
  		 	
  		 	traceroute_path = [];

  		 	if (rendered_table != null){
  		 		destroy_old_datatable();
  		 		display_ip_data(ip_address_data);
  		 	}

  		 	if (bread_crumb_probes != null){
	  		 	breadcrumb.removeChild(bread_crumb_probes)
	  		 	bread_crumb_probes = null;
	  		 	bread_crumb_dest_ip.innerHTML = "Destination IP Information";
  		 	}

  		 	if (bread_crumb_traceroute != null){
	  		 		breadcrumb.removeChild(bread_crumb_traceroute);
	  		 		bread_crumb_traceroute = null;
	  		 		document.getElementById("bread_crumb_ip_info").innerHTML = "Destination IP Information";

	  		 }


  		 })//End click event



  		 //Allow mouseover for new marker
  		 clicked_ip.addListener("mouseover", function(event){
  		 	infoWindow.setContent("<b>" + selected_marker.getProperty("name") + "</b>" +
				"<br>" + "<b>ASN: </b> " + selected_marker.getProperty("asn") +
				"<br>" + " <b>IP Address:</b>" + selected_marker.getProperty("ip_address"));
			var anchor = new google.maps.MVCObject();
			anchor.set("position",event.latLng);
			infoWindow.open(map,anchor);

  		 })

  		 //Set mouseout listener
  		 clicked_ip.addListener("mouseout", function(event){
  		 	if (infoWindow) {
  		 		setTimeout(function () { infoWindow.close(); }, 2500);
  		 	} 	 	
  		 })

  		//console.log("Coordinates of clicked " + clicked_ip.position);

  		//Add hops to map of selected IP marker
  		clicked_ip_address = event.feature.getProperty("ip_address");
  		extract_hop_data(clicked_ip_address);
  		add_hops_to_map(clicked_ip_address);

  		
  		//Show probes
  		document.getElementById("probe_layer").checked = true; //Set probe checkbox to true
  		probe_layer.setMap(map);
  		format_probe_data(all_probes);
  		mouseover_probe();
  		click_probe();

		//Create probe data table
		p_table = $('#hop_info_table').dataTable();
		destroy_old_datatable(p_table);
		create_probe_datatable(probe_table_data);




  	});//End click listener

destination_ip_layer.setMap(gmap); 

}//End add destination ip


function add_ips_to_array(file){	
	$.getJSON(file)
	.done(function (data) {
		all_destination_ips = data.features;
	});
}

function add_probes_to_array(file){	
	$.getJSON(file)
	.done(function (data) {
		all_probes = data.features;
	});
}

function remove_hops (){
	for (var i = 0; i < all_hops.length; i++){
		all_hops[i].setMap(null);
	}
}

function insertIntoDic(key, value) {
 // If key is not initialized or some bad structure
 if (!dictionary[key] || !([key] instanceof Array)) {
 	dictionary[key] = [];
 }
 // All arguments, exept first push as valuses to the dictonary
 dictionary[key] = dictionary[key].concat(Array.prototype.slice.call(arguments, 1));
 return dictionary;
}

function insertIntoDic2(key, value) {
 // If key is not initialized or some bad structure
 if (!dict[key] || !(dict[key] instanceof Array)) {
 	dict[key] = [];
 }
 // All arguments, exept first push as valuses to the dictonary
 dict[key] = dict[key].concat(Array.prototype.slice.call(arguments, 1));
 return dict;
}

function insertIntoDic3(key, value) {
 // If key is not initialized or some bad structure
 if (!nested_dictionary[key] || !(nested_dictionary[key] instanceof Array)) {
 	nested_dictionary[key] = [];
 }
 // All arguments, exept first push as valuses to the dictonary
 nested_dictionary[key] = nested_dictionary[key].concat(Array.prototype.slice.call(arguments, 1));
 return nested_dictionary;
}

function add_hops_to_map(selected_ip_address){

	var jsonFile = "/data/measurements/best_of_protocols/hops_to_" + selected_ip_address + ".json";

	var hop_sym = {
		path: google.maps.SymbolPath.CIRCLE,
		scale:4,
		//fillColor: "#18bc9c",
		fillColor: "#0cd410",
		fillOpacity: 1,
		//strokeColor: "#4575b4",
		strokeWeight:1
	}

	var probe_id = " ";
	hop_path = []; //Clear hop path array

	$.getJSON(jsonFile, function(json1) {

		all_measurements = {};
		dictionary = {};
		dict = {};
		used_probes = []; //Clear used probes each time measurement is loaded

		$.each(json1, function(key, data) { //Loop through all the json fields
			probe_id = data.prb_id;
			var hop_coordinates = " "
			var probe_coords = get_probe_coordinates();

			hop_path = [];

			used_probes.push(probe_id);

	    	//Add probe coordinates as first location
	    	hop_path.push({lat: parseFloat(probe_coords[1]), lng: parseFloat(probe_coords[0]) });

	    	//if (data.prb_id == 4518){

	    		$.each(data.result, function(key, data){ //Loop through the results field 
	    			try{

	    				var lati = data.result.coordinates[0];
	    				var lngi = data.result.coordinates[1];
	    				var latLng = new google.maps.LatLng(lati, lngi); 
	    				var hop_num = data.hop.toString();
	    				var country_name = getCountryName(data.result.country);
	    				


	    				//console.log("Hop:" + hop_num + " coords: " + data.result.coordinates);

	    				hop_path.push({lat: parseFloat(lati), lng: parseFloat(lngi)});
	    				//console.log(hop_path)
	    				
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

	    	//}//End if
	    	all_measurements =  insertIntoDic(probe_id, hop_path);
	    });//End outer each

function remove_extra_markers(hops){

	for (var i = 0; i < hops.length; i++){
		if ((clicked_ip.position.lat() == all_hops[i].position.lat()) && (clicked_ip.position.lng() == all_hops[i].position.lng()) ) { 

			all_hops[i].setMap(null);
		}
	}
}

remove_extra_markers(all_hops);
	//all_hops[all_hops.length-1].setMap(null);
	draw_traceroutes(selected_ip_address);
	remove_extra_probes();


}); //End get json

function get_probe_coordinates(){
 //Add probes to front of path
 for (var i = 0; i < all_probes.length; i++){
 	if (all_probes[i].properties.probe_id == probe_id){
 		var probe_coords = all_probes[i].geometry.coordinates;
 		return probe_coords;
 	}
 }  				
}



}//End add_hop_measurement

function extract_hop_data(selected_ip){
	var jsonFile = "/data/measurements/best_of_protocols/hops_to_" + selected_ip + ".json";

	$.getJSON(jsonFile, function(json1) {

		all_measurements_data = {};
		nested_dictionary = {};
		var probe_hops = [];

		$.each(json1, function(key, data) { //Loop through all the json fields
			var probe = data.prb_id;
			//console.log(probe);
			var protocol = data.proto;
			var latency = data.latency;
			var hop_obj = {};
			probe_hops = [];
	    		$.each(data.result, function(key, data){ //Loop through the results field 
	    			lost_hop = "{\"x\":\"*\"}";
	    			var hop_num = data.hop.toString();
	    			


	    				//console.log(JSON.stringify(data.result));
	    				if (data.result.public == false){
	    					hop_obj = {hop: hop_num, country: "N/A", ip_address: data.result.from, public: "false", rtt: data.result.rtt, protocol: protocol, latency:latency, lat:"N/A", lng:"N/A"}

	    				}
	    				
	    				else if (JSON.stringify(data.result) == lost_hop){
	    					//console.log("true");
	    					hop_obj = {hop: hop_num, country: "*", ip_address: "*", public: "*", rtt: "*", protocol: protocol, latency:latency, lat:"N/A", lng:"N/A" }
	    				}
	    				else{
	    					var latitude = data.result.coordinates[0];
	    					var longi = data.result.coordinates[1];
	    					var country_name = getCountryName(data.result.country);
	    					var ip_address = data.result.from;
	    					var rtt = data.result.rtt;

	    					hop_obj = {hop: hop_num, country: country_name, ip_address: ip_address, public: "true", rtt: rtt, protocol:protocol, latency:latency, lat:latitude, lng:longi}
	    				}

	    				probe_hops.push(hop_obj)

	    		})//End inner each

	    	//}//End if
	    	all_measurements_data = insertIntoDic3 (probe, probe_hops);
	    });//End outer each


});

}

function round_number(number, decimals) { // Arguments: number to round, number of decimal places
	var newnumber = new Number(number+'').toFixed(parseInt(decimals));
	return newnumber;
}

function draw_traceroutes(ip_addr){
	line_symbol = {
		path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
	};
	//console.log(ip_addr);
	//Where probe is a key and all_measurements is a dictionary of measurements with hops
	for (var probe in all_measurements){
		var number_of_hops = all_measurements[probe][0].length
		var hops_per_probe = all_measurements[probe][0]
		
		traceroute_polyline = new google.maps.Polyline({
			path: hops_per_probe,
			icons: [{
				icon: line_symbol,
				offset: '100%',
	         	 //repeat: "1000px"
	         	}],
	         	geodesic: true,
	         	strokeColor: 'black',
	         	strokeOpacity: 0.3,
	         	strokeWeight: 2
	         });

		addLine(traceroute_polyline);
		animateArrow(traceroute_polyline);
		all_traceroute_polylines.push(traceroute_polyline);
		probe_traceroutes = insertIntoDic2(probe, traceroute_polyline);

	}//End for

}


function remove_traceroutes(){
	for (k = 0; k < all_traceroute_polylines.length; k++){
		removeLine(all_traceroute_polylines[k]);
	}
}			

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

function animate(route) {
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

function remove_extra_probes(){

	probe_layer.forEach(function(feature){ 
		var all_probe_ids = feature.getProperty("probe_id");
		//console.log(all_probe_ids);
		var found = used_probes.indexOf(all_probe_ids);
		if (found === -1){
			probe_layer.remove(feature);
		}

	});
}



function mouseover_probe(){

	infoWindow.content = "";


	if (infoWindow){	
		infoWindow.close();
	}

	line_symbol = {
		path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
		strokeColor: "red"
	};

	 //Mouseover events listener
	 probe_layer.addListener('mouseover', function(event) {


        //Display infowindow
        infoWindow.setContent("<font color=blue> <b>" + event.feature.getProperty("name") + "</b></font>" + 
        	"<br>" + "<b>Probe ID: </b> " + event.feature.getProperty("probe_id") +
        	"<br>" + " <b>ASN:</b>" + event.feature.getProperty("asn"));
        var anchor = new google.maps.MVCObject();
        anchor.set("position",event.latLng);
        infoWindow.open(map,anchor);

        if (infoWindow) {
        	setTimeout(function () { infoWindow.close(); }, 3000);
        }


      });//End event listener




	}

//var example = [["1","Sudan","41.67.49.1","true","2.2013333333333334"],["2","Sudan","196.29.167.153","true","5.083666666666667"],["3","EU","62.115.50.125","true","124.98066666666666"],["4","EU","62.115.112.242","true","124.75866666666667"],["5","EU","213.155.135.191","true","129.05633333333333"],["6","United States","4.68.111.193","true","88.28466666666668"],["7","United States","4.69.168.72","true","78.28833333333333"],["8","United Kingdom","212.73.200.174","true","79.48466666666667"],["9","Madagascar","41.188.24.158","true","78.31633333333333"],["10","Madagascar","41.188.24.157","true","99.718"],["11","Madagascar","41.188.60.242","true","268.49533333333335"],["12","Madagascar","41.188.60.237","true","261.17800000000005"],["13","Madagascar","41.188.60.133","true","280.61133333333333"],["14","*","*","*","*"],["15","*","*","*","*"],["16","Madagascar","41.188.60.78","true","292.78366666666665"],["17","*","*","*","*"],["18","Madagascar","41.188.60.78","true","1685.454"]];

var measurement_protocol;
var hop_row = [];
var hop_data_set = [];
var clicked_probe_asn;
var clicked_probe_name;
var current_clicked;

function click_probe(){
	dict = {}
	var probe_click_listener = probe_layer.addListener("click", function(event){

		clicked_probe = event.feature.getProperty("probe_id");
		clicked_probe_asn = event.feature.getProperty("asn");
		clicked_probe_name = event.feature.getProperty("name");
		hop_data_set = [];

		format_measurements(all_measurements_data[clicked_probe]);

		if (selected_traceroute_polyline != null) {
	 		removeLine(selected_traceroute_polyline)//Remove previously drawn line
	 		selected_traceroute_polyline = null;

		//Create probe data table
		p_table = $('#hop_info_table').dataTable();
		destroy_old_datatable(p_table);
		create_probe_datatable(probe_table_data);
	}
	if (current_clicked != clicked_probe){

	 	//Draw new line
	 	selected_traceroute_polyline = new google.maps.Polyline({
	 		path: all_measurements[clicked_probe][0],
	 		icons: [{
	 			icon: line_symbol,
	 			offset: '100%',
	            //repeat: "20px"
	        }],
	        geodesic: true,
	        strokeColor: '#d7191c',
	        strokeOpacity: 1,
	        strokeWeight: 3
	    });

	 	var back_button_probes = document.getElementById("show_ips_probes");

	 	if (back_button_probes != null){
	 		var parent_div_2 = document.getElementById("btn_div");
	 		parent_div_2.removeChild(back_button_probes);
	 	}	

	 	addLine(selected_traceroute_polyline);
	 	removeLine(probe_traceroutes[clicked_probe][0])
	 	remove_traceroutes();
	 	animateArrow(selected_traceroute_polyline);

	 	orig_table = $('#hop_info_table').dataTable();
	 	destroy_old_datatable(orig_table);

	 	create_new_datatable(hop_data_set);

	 }

	 	//console.log(show_traces_clicked);
	 	if (form != null){
	 		change_text(show_all_traces, "Show All Traceroutes");
	 		show_traces_clicked = false;
	 		override_btn_click()
	 	}

	 	current_clicked = clicked_probe;

	 	

	 });
}

function show_probe_info(prb_id){
	dict = {}

	format_measurements(all_measurements_data[prb_id]);

	if (selected_traceroute_polyline != null){
	 		removeLine(selected_traceroute_polyline)//Remove previously drawn line
	 	}
	 	//console.log(show_traces_clicked);
	 	if (form != null){
	 		change_text(show_all_traces, "Show All Traceroutes");
	 		show_traces_clicked = false;
	 		override_btn_click()
	 	}	

	 	//Draw new line
	 	selected_traceroute_polyline = new google.maps.Polyline({
	 		path: all_measurements[prb_id][0],
	 		icons: [{
	 			icon: line_symbol,
	 			offset: '100%',
	            //repeat: "20px"
	        }],
	        geodesic: true,
	        strokeColor: '#d7191c',
	        strokeOpacity: 1,
	        strokeWeight: 3
	    });

	 	var back_button_probes = document.getElementById("show_ips_probes");

	 	if (back_button_probes != null){
	 		var parent_div_2 = document.getElementById("btn_div");
	 		parent_div_2.removeChild(back_button_probes);
	 	}	

	 	addLine(selected_traceroute_polyline);
	 	removeLine(probe_traceroutes[prb_id][0])
	 	remove_traceroutes();
	 	animateArrow(selected_traceroute_polyline);

	 	orig_table = $('#hop_info_table').dataTable();
	 	destroy_old_datatable(orig_table);

	 	create_new_datatable(hop_data_set);

	 }


	 function format_measurements(meas_data){

	 	for (var j = 0; j < meas_data[0].length; j++){	

		hop_row = [];//Every hop has unique fields

		var hop_number = meas_data[0][j].hop;
		hop_row.push(hop_number);
		var country = meas_data[0][j].country;
		hop_row.push(country);
		var ip_address = meas_data[0][j].ip_address;
		hop_row.push(ip_address);
		// var public_ip = meas_data[0][j].public;
		// hop_row.push(public_ip);
		var rtt = meas_data[0][j].rtt;
		var not_number = isNaN(rtt); 
		if (not_number == true){
			rtt = rtt.toString();
		}
		else{
			rtt = round_number(rtt, 3).toString();

		}
		hop_row.push(rtt);
		measurement_protocol = meas_data[0][j].protocol;
		hop_data_set.push(hop_row)

	}
}

var probe_table_data = [];
var probe_row;

function format_probe_data(probe_data){
	probe_table_data = []
	for (var j = 0; j < probe_data.length; j++){	
		
		probe_row = [];//Every probe has unique fields

		var prb_id = probe_data[j].properties.probe_id;
		probe_row.push(prb_id);
		var asn = probe_data[j].properties.asn;
		probe_row.push(asn);
		var type = probe_data[j].properties.type;
		probe_row.push(type);
		var probe_organisation = probe_data[j].properties.name;
		probe_row.push(probe_organisation);

		probe_table_data.push(probe_row);

	}

}
var probe_table;
var bread_crumb_probes;

function create_probe_datatable(probe_dataset){

	change_text(sidebar_heading, "Probe Information")

	probe_table = $('#hop_info_table').DataTable( {
		data: probe_dataset,
	        //"bSort": false,
	        
	        columns: [
	        { title: "Probe ID" },
	        { title: "ASN" },
	        { title: "Type" },
	        { title: "Name" },
	        ],
	        
	    } );

	

	btn_div = document.getElementById("btn_div");
	btn_div.className = "btn-group";

	if ((document.getElementById("show_ips") == null) && (document.getElementById("show_ips_probes") == null)){ 


		btn_show_ips_probes =  document.createElement("button");
		btn_show_ips_probes.className = "btn btn-info";
		btn_show_ips_probes.id = "show_ips_probes";
		btn_show_ips_probes.innerHTML = "Back to destination IPs";

		btn_div.appendChild(btn_show_ips_probes);


	btn_show_ips_probes.onclick = function(event){
			clicked_ip.setMap(null); //Remove current marker 
  		 	add_destination_ip_layer(map); //Re-add destination IPs

  		 	map.setZoom(3);
  		 	map.setCenter( {lat: 0.070959, lng: 23.923482})

  		 	probe_layer.setMap(null); //Remove probes from map
  		 	document.getElementById("probe_layer").checked = false;
  		 	load_probe_JSON(); //Reload probes

  		 	remove_hops(); //Remove hops
  		 	remove_traceroutes(); //Remove all selected traceroutes
  		 	
  		 	if (selected_traceroute_polyline != null)
  		 		removeLine(selected_traceroute_polyline);
  		 	traceroute_path = [];

  		 	if (rendered_table != null){
  		 		p_table = $('#hop_info_table').dataTable();
  		 		destroy_old_datatable(p_table);
  		 		display_ip_data(ip_address_data);
  		 	}

  		 		breadcrumb.removeChild(bread_crumb_probes)
	  		 	bread_crumb_probes = null;

	  		 bread_crumb_dest_ip.innerHTML = "Destination IP Information";

  		 	

  		 } //End click event


}//End if

  		   // <li><a href="#">Destination IP Information</a></li>
  		 breadcrumb = document.getElementById("bread_crumb");

  		 if (bread_crumb_probes == null){
  		 bread_crumb_probes =  document.createElement("li");
  		 bread_crumb_probes.id = "bread_crumb_probe_info";
		 bread_crumb_probes.innerHTML = "Probe Information";

		 breadcrumb.appendChild(bread_crumb_probes);

		 bread_crumb_dest_ip = document.getElementById("bread_crumb_ip_info");
		 bread_crumb_dest_ip.innerHTML = "<a>Destination IP Information</a>";

		 bread_crumb_dest_ip.onclick = function(event){
		 	clicked_ip.setMap(null); //Remove current marker 
  		 	add_destination_ip_layer(map); //Re-add destination IPs

  		 	map.setZoom(3);
  		 	map.setCenter( {lat: 0.070959, lng: 23.923482})

  		 	probe_layer.setMap(null); //Remove probes from map
  		 	document.getElementById("probe_layer").checked = false;
  		 	load_probe_JSON(); //Reload probes

  		 	remove_hops(); //Remove hops
  		 	remove_traceroutes(); //Remove all selected traceroutes
  		 	
  		 	if (selected_traceroute_polyline != null)
  		 		removeLine(selected_traceroute_polyline);
  		 	traceroute_path = [];

  		 	if (rendered_table != null){
  		 		p_table = $('#hop_info_table').dataTable();
  		 		destroy_old_datatable(p_table);
  		 		display_ip_data(ip_address_data);
  		 	}

  		 	if (bread_crumb_probes != null){
  		 		breadcrumb.removeChild(bread_crumb_probes)
  		 		bread_crumb_probes = null;
  		 	}
  		 	
  		 	 if (bread_crumb_traceroute != null){
	  		 		breadcrumb.removeChild(bread_crumb_traceroute);
	  		 		bread_crumb_traceroute = null;

	  		 }

	  		 document.getElementById("bread_crumb_ip_info").innerHTML = "Destination IP Information";


		 	}//End click event
		}


  		 var highlight = false;
  		 var row_index = " ";


  		 probe_table.on('click', 'tr', function () {

  		 	data_cell = probe_table.row( this ).data();
  		 	var p_id = data_cell[0];
  		 	clicked_probe = p_id;
  		 	clicked_probe_asn = data_cell[1];
  		 	clicked_probe_name = data_cell[3];

        //console.log(p_id);
        var lat;
        var lng;
        var coordinates;
        //console.log(clicked_probe);

        var tr = $(this).closest("tr");


        if (infoWindow){	
        	infoWindow.close();
        }

        $('#hop_info_tshowshable').find('tr.highlight').removeClass('highlight');
        $(this).addClass('highlight');

        show_probe_info(p_id);

        if ((highlight == true) && (row_index == tr.index())){
        	$('#hop_info_table').find('tr.highlight').removeClass('highlight');
        	map.setZoom(3);
        	map.setCenter( {lat: 0.070959, lng: 23.923482})
        	highlighted = false;
        }
        else{
        	infoWindow = new google.maps.InfoWindow({
        		content: "",
        	});	

        	for (var i=0; i < all_probes.length; i++){
        		if (p_id == all_probes[i].properties.probe_id){
        			console.log(all_probes[i].properties.probe_id);
        			var coordinates = all_probes[i].geometry.coordinates;
        			var latitude = coordinates[1];
        			var longitude = coordinates[0];
        			var latLong = new google.maps.LatLng(latitude, longitude); 
        			map.setZoom(5);
        			map.panTo(latLong);


				//Display infowindow
				infoWindow.setContent("<font color=blue> <b>" + all_probes[i].properties.name + "</b></font>" + 
					"<br>" + "<b>Probe ID: </b> " + all_probes[i].properties.probe_id +
					"<br>" + " <b>ASN:</b>" + all_probes[i].properties.asn);
				var anchor = new google.maps.MVCObject();
				anchor.set("position",latLong);
				infoWindow.open(map,anchor);

				if (infoWindow) {
					setTimeout(function () { infoWindow.close(); }, 2500);
				} 	 	

			}
		}
	}

	highlighted = true;
	row_index = tr.index();
}




)}//End create_probe_table



function change_text(el_id, text) {
	el_id.innerHTML = text;
}

var form; 
var para_id;
var para_asn;
var para_name;
var show_traces_clicked = false;
var bread_crumb_traceroute;

function create_new_datatable(data_set){
	
	change_text(sidebar_heading, "Traceroute Information")


	if (form != null){
		change_text(prob_id, "<b> Probe ID: </b>" + clicked_probe.toString());
		change_text(probe_asn, "<b> Probe ASN: </b>" + clicked_probe_asn.toString());
		change_text(org_name, "<b> Name: </b>" + clicked_probe_name.toString());
	}

	else{
		form = document.createElement("form");
		form.className = "form-inline well";
		form.id = "probe_details";
		document.getElementById("probe_info").appendChild(form);

		h_id = document.createElement("p");
		h_id.id = "heading_id";
		h_id.innerHTML = "Traceroute from Probe " + clicked_probe.toString() + " to " + clicked_ip_address;
		document.getElementById("probe_details").appendChild(h_id);

		para_id = document.createElement("p");
		para_id.id = "prob_id";
		var url = "https://atlas.ripe.net/probes/" + clicked_probe+"/"
		para_id.innerHTML = "<b> Probe ID: </b>" + "<a href=" + url + ">" + clicked_probe.toString() + "<a/>";
		document.getElementById("probe_details").appendChild(para_id);

		para_asn = document.createElement("p");
		para_asn.id ="probe_asn";
		para_asn.innerHTML = "<b> Probe ASN: </b>" + clicked_probe_asn.toString();
		document.getElementById("probe_details").appendChild(para_asn);

		para_name = document.createElement("p");
		para_name.id="org_name";
		para_name.innerHTML = "<b> Name: </b>" + clicked_probe_name.toString();
		document.getElementById("probe_details").appendChild(para_name);

		btn_div = document.getElementById("btn_div");
		btn_div.className = "btn-group";	

		btn_show_all_traceroutes =  document.createElement("button");
		btn_show_all_traceroutes.className = "btn btn-success";
		btn_show_all_traceroutes.id = "show_all_traces";
		btn_show_all_traceroutes.innerHTML = "Show all traceroutes";

		if (document.getElementById("show_ips_probes") == null){
			btn_show_ips =  document.createElement("button");
			btn_show_ips.className = "btn btn-info";
			btn_show_ips.id = "show_ips";
			btn_show_ips.innerHTML = "Back to destination IPs";

			btn_show_ips.onclick = function(event){
			clicked_ip.setMap(null); //Remove current marker 
  		 	add_destination_ip_layer(map); //Re-add destination IPs
  		 	
  		 	map.setZoom(3);
  		 	map.setCenter( {lat: 0.070959, lng: 23.923482})
  		 	
  		 	probe_layer.setMap(null); //Remove probes from map
  		 	document.getElementById("probe_layer").checked = false;
  		 	load_probe_JSON(); //Reload probes

  		 	remove_hops(); //Remove hops
  		 	remove_traceroutes(); //Remove all selected traceroutes
  		 	
  		 	if (selected_traceroute_polyline != null)
  		 		removeLine(selected_traceroute_polyline);
  		 	traceroute_path = [];

  		 	if (rendered_table != null){
  		 		destroy_old_datatable();
  		 		display_ip_data(ip_address_data);
  		 	}

  		 	if (bread_crumb_probes != null){
	  		 	breadcrumb.removeChild(bread_crumb_probes)
	  		 	bread_crumb_probes = null;
	  		 	bread_crumb_dest_ip.innerHTML = "Destination IP Information";
  		 	}

  		 	if (bread_crumb_traceroute != null){
	  		 		breadcrumb.removeChild(bread_crumb_traceroute);
	  		 		bread_crumb_traceroute = null;
	  		 		document.getElementById("bread_crumb_ip_info").innerHTML = "Destination IP Information";

	  		 }



  		 	
  		 }
  		   		 btn_div.appendChild(btn_show_ips);

		}

		

		

  		 btn_div.appendChild(btn_show_all_traceroutes);

}//End else

breadcrumb = document.getElementById("bread_crumb");

  		 if (bread_crumb_traceroute == null){
	  		 bread_crumb_traceroute =  document.createElement("li");
	  		 bread_crumb_traceroute.id = "bread_crumb_traceroute_info";
			 bread_crumb_traceroute.innerHTML = "Traceroute Information";

			 breadcrumb.appendChild(bread_crumb_traceroute);

			 bread_probes = document.getElementById("bread_crumb_probe_info");
			 bread_probes.innerHTML = "<a>Probe Information</a>";

			 bread_probes.onclick = function(event){

				//Create probe data table
				p_table = $('#hop_info_table').dataTable();
				destroy_old_datatable(p_table);
				create_probe_datatable(probe_table_data);
				 

				 if (bread_crumb_traceroute != null){
				 	breadcrumb.removeChild(bread_crumb_traceroute);
				 	bread_crumb_traceroute = null;
				 	bread_probes.innerHTML = "Probe Information";

				 }

				 map.setZoom(3);
        		map.setCenter( {lat: 0.070959, lng: 23.923482})

				} //End bread crumb click



		}//End bread crumb if

btn_show_all_traceroutes.onclick = function(event){
	show_traces_clicked = true;
	console.log(show_traces_clicked);
	draw_traceroutes(clicked_ip_address);
	change_text(show_all_traces, "Hide traceroutes");
	override_btn_click();

}

table = $('#hop_info_table').DataTable( {
	data: data_set,
	        //"bSort": false,
	        
	        columns: [
	        { title: "Hop #" },
	        { title: "Country" },
	        { title: "IP Address" },
	        { title: "RTT" },
	        ],
	        
	    } );

var highlight = false;
var row_index = " ";


table.on('click', 'tr', function () {

	data = table.row( this ).data();
	var ip = data[2];
        //console.log(ip);
        var lat;
        var lng;
        var coordinates;
        //console.log(clicked_probe);

        var tr = $(this).closest("tr");

        $('#hop_info_table').find('tr.highlight').removeClass('highlight');
        $(this).addClass('highlight');

        if ((highlight == true) && (row_index == tr.index())){
        	$('#hop_info_table').find('tr.highlight').removeClass('highlight');
        	map.setZoom(3);
        	map.setCenter( {lat: 0.070959, lng: 23.923482})
        	highlighted = false;
        }
        else{
        	for (var i = 0; i < all_measurements_data[clicked_probe][0].length; i++){
        		if (ip == all_measurements_data[clicked_probe][0][i].ip_address){
        			lat = all_measurements_data[clicked_probe][0][i].lat;
        			lng = all_measurements_data[clicked_probe][0][i].lng;
        		}
        	}

        	if (lat != "N/A" && lng != "N/A"){
        		var latLng = new google.maps.LatLng(lat, lng); 
        		map.setZoom(6);
        		map.panTo(latLng);
        	}

    }//End else
    highlight = true;
    row_index = tr.index();

});

}

function destroy_old_datatable(){


		// for (var i=0; i<= total_rows; i++){
		//  	data_table.fnDeleteRow(0,null,false);
		// }

		// data_table.fnClearTable();
		// data_table.fnDestroy();
		//data_table.destroy(true);
		//data_table.off("zoom_row");
		if ($.fn.DataTable.isDataTable("#hop_info_table")){
			$('#hop_info_table').DataTable().clear().destroy();
			$('#hop_info_table').unbind('click');

		}

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
			mouseover_probe();
		}


		if (document.getElementById("probe_layer").checked == false){
			probe_layer.setMap(null);
		}
	}

	//IXPs
	if (selected_layer == "ixps"){
		if (document.getElementById("ixp_layer").checked == true){
			ixp_data_layer.setMap(map);
			ixp_mouseover();
		}


		if (document.getElementById("ixp_layer").checked == false){
			ixp_data_layer.setMap(null);
		}
	}
}

function override_btn_click(){

	if (show_traces_clicked == false){
		document.getElementById("show_all_traces").onclick = function(event){
			draw_traceroutes(clicked_ip_address);
			change_text(show_all_traces, "Hide traceroutes");
			show_traces_clicked = true;
			console.log(show_traces_clicked)
			override_btn_click();

		}
	}
	else if (show_traces_clicked == true) {
		document.getElementById("show_all_traces").onclick = function(event){
			remove_traceroutes();
			change_text(show_all_traces, "Show all traceroutes");
			show_traces_clicked = false;
			console.log(show_traces_clicked)

			override_btn_click();

		}

	}
}



