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
		//{ "color": "#fefefd" }
		{"color": "#fbfbfa"}
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
			scale: 7,
			fillColor: colour,
			fillOpacity:1,
			strokeWeight:1.5,
			strokeColor: "black",
		},


	};
}
