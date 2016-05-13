# AfriNREN Project Information
AfriNREN is a Computer Science honours project at the University of Cape Town aiming to design and develop a network traffic analysis tool for use by network managers of African National Research and Education Networks (NRENs).

Project Members: Rob Passmore, Rosy Sanby, Chantal Yang. Supervised by Hussein Suleman and Josiah Chavula.

The project was split into the following sections:
* Data Collection and Formatting - Rosy Sanby
* Geospatial Visualisation - Chantal Yang
* Non-geospatial Visualisation - Rob Passmore

##Links
* [Project Website at UCT CS Project Archive](http://pubs.cs.uct.ac.za/honsproj/cgi-bin/view/2015/passmore_sanby_yang.zip/AfriNRENWeb-master/)
* [Project Website on Github.io](http://chantalyang.github.io/AfriNRENWeb/)
* [Geospatial Visualisation Webpage](http://pubs.cs.uct.ac.za/honsproj/cgi-bin/view/2015/passmore_sanby_yang.zip/AfriNRENWeb-master/geovis.html)
* [Research Paper - "Visualising the Network Topology of National Research and Education Networks in Africa"](http://pubs.cs.uct.ac.za/honsproj/cgi-bin/view/2015/passmore_sanby_yang.zip/AfriNRENWeb-master/documents/final_papers/Chantal_Final_Paper.pdf)
* [IST Africa 2016 Conference Paper - "A Topology Visualisation Tool for National Research and Education Networks in Africa"](http://www.ist-africa.org/Conference2016/outbox/ISTAfrica_Paper_ref_86_8274.pdf)
* [Screen recording of Visualisation in Use](https://youtu.be/GWCUC39ZfBg)


#Geospatial Visualisation
The visualisation shows the results of traceroute data collected for the network topology (network structure) discovery of National Research and Education Networks in Africa using the [Ripe Atlas](https://atlas.ripe.net/) platform. The probes shown in the visualisation are those hosted on various NRENs in Southern and Eastern Africa. Probes are small, USB-powered hardware devices that hosts attach to an Ethernet port on their router via a network cable. These probes were then used to conduct various traceroute measurements from the networks in which they are hosted. Traceroutes are sent to selected destination IPs which are also located within an African NRENs or related institution. 

The left-hand side of the screen shows an interactive map which supports panning and zooming using the mouse. On the right-hand side of the screen, a table with contextual information related to the map can be seen. The search bar above the table on the right-hand side of the screen can be used to perform searches on the table for any column. Clicking on a particular row in the table, allows the map to zoom in to the location of the related icon on the map.

##Data
The following data was used to create the visualisation:
* Traceroute Data as `.json` collected by Rosy Sanby using the [Ripe Atlas](https://atlas.ripe.net/) platform (See [Data Collection](http://pubs.cs.uct.ac.za/honsproj/cgi-bin/view/2015/passmore_sanby_yang.zip/AfriNRENWeb-master/data_collection.html) section of the project for more details)
* IXP Data as `.json` generated from a `.csv` from the [Internet Exchange Point Directory](https://prefix.pch.net/applications/ixpdir/) managed by Packet Clearing House  
* [Terrestrial Fibre in Africa Data](https://github.com/stevesong/afterfibre-kml) as `.geojson` courtesy of Steve Song from [AfTerFibre](https://manypossibilities.net/afterfibre-old/)

The [MaxMind GeoLite City Database](http://dev.maxmind.com/geoip/legacy/geolite/) was used to map IP addresses to coordinates on a city level and used to position markers on the map for both probes and destination IP addresses.

##Implementation
* Google Maps Javascript API v3
* [DataTable | Table plug-in for jQuery] (https://www.datatables.net/)
* Server: Python Simple HTTP Server `python -m SimpleHTTPServer 8080` 

##Map Layers and Symbols
Below the map, there are several checkboxes which can be used to toggle various map layers on and off - either displaying or hiding icons and layers on the map.

* Destination IP Address - where a traceroute is sent to (coloured circle)
* Probe - where a traceroute is sent from (blue diamond)
* Internet Exchange Point (pink triangle)
* Traceroute Hops -  (bright green circle)
* Terrestrial Fibre - Fibre Optic Cables over land (green lines)

By default, all destination IPs are shown on the map. With the exception of hops, mousing over each symbol displays information about that particular icon such as the name, ASN and IP Address.

##Summary of Interactions
###To view all traceroute measurements to a particular destination
Click on a chosen destination IP icon on the map. This will display traceroute measurements from all available probes to that particular destination. All probes, the destination IP and intermediate hops are shown on the map. A list of all the probes and related information (Probe ID, ASN, NREN/organisation name) is then shown in the table.
###To view a single traceroute measurement from a particular probe to a particular destination
Click a chosen probe icon on the map. This will display the traceroute from the chosen probe to the chosen destination. The traceroute information is then shown in the table (Hop Number, Country, IP Address, RTT).
###To select a different IP address 
Click the same destination IP icon you previously selected. All destination IP addresses will be visible on the map again. 

