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