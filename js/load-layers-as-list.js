var leafletMarkerColours = {
  "red": "#d43e2a",
  "orange": "#F69730",
  "green": "#70ad26",
  "blue": "#38aadd",
  "purple": "#D252BA",
  "darkred": "#a23336",
  "darkblue": "#0e67a3",
  "darkgreen": "#728224",
  "darkpurple": "#5b396b",
  "cadetblue": "#436978",
  "lightred": "#fc8e7f",
  "beige": "#ffcb92",
  "lightgreen": "#bbf970",
  "lightblue": "#8adaff",
  "pink": "#ff91ea",
  "lightgray": "#a3a3a3",
  "gray": "#575757",
  "black": "#3b3b3b"
}

//READ MAP CONFIG, LOAD ALL LAYERS, PUT THEM IN GROUPS, CREATE ONE LAYER CONTROL AND ONE EASYBUTTON PER GROUP

function loadLayers(mapConfig) {
  //count layers so we can tell if everything has been loaded later
  var nbLayers = mapConfig.layers.length;
  var nbLoadedLayers = 0;
  var layers = [];
  var layergroup;
  var layerGroups = [];
  var layercontrol; 
  var overlayMaps = {};

  //for each group in the config file
  for (var i=0 ; i<mapConfig.layergroups.length ; i++){
    //crate layergroup object with this new empty list of layers
    layergroup = {
      group: mapConfig.layergroups[i].name,
      groupIcon: mapConfig.layergroups[i].groupicon,
      groupIconActive: mapConfig.layergroups[i].groupiconactive,
      groupText: mapConfig.layergroups[i].grouptext,
      alt: mapConfig.layergroups[i].alt,
      collapsed: false,
      layersInGroup: [],
      groupEasyButton: null
    };
    layerGroups.push(layergroup);
  }


  

  //for each layer in the config file
  for (var i=0 ; i<mapConfig.layers.length ; i++) {
    var configlayer = mapConfig.layers[i];
    //Live
    var url="https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configlayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
    //Test
    //var url="http://lbhgiswebt01/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configlayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";

    //var url="http://localhost:8080/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+mapConfig.layergroups[i].layers[j].geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
    //var iconn=mapConfig.layergroups[i].layers[j].icon;

    //send an ajax query to load WFS layer
    //with context
    $.ajax({
    url: url,
    dataType: 'json',
      /* context freezes the values associated to indexes i and j. This way, when the ajax query succeeds, 
      it will use the values as they were when the query was created, and not the values associated to 'current' i and j.
      */ 
      context: {
          configlayer: configlayer,
          layercontrol: layercontrol,
          overlayMaps: overlayMaps,
          layerGroups: layerGroups,
          layers: layers,
          maptitle: name
      },
      success: function (data) {
        //console.log(data);
        var layername = this.configlayer.title; // get from context
        var parentgroups = this.configlayer.groups;
        var sortorder = this.configlayer.title;
        var layercontrol = this.layercontrol;
        var overlayMaps = this.overlayMaps;
        var layerGroups = this.layerGroups;
        var hover = this.configlayer.hover;  
        
        //Style variables
        var markertype = this.configlayer.pointstyle.markertype;
        var markericon = this.configlayer.pointstyle.icon;
        var markercolor = this.configlayer.pointstyle.markercolor;
        var cluster = this.configlayer.pointstyle.cluster;
        var layerstyle = this.configlayer.linepolygonstyle.stylename;
        var layerstroke = this.configlayer.linepolygonstyle.layerstroke;
        var layerstrokecolor =this.configlayer.linepolygonstyle.layerstrokecolor;
        var layeropacity = this.configlayer.linepolygonstyle.layeropacity;
        var layerfillcolor = this.configlayer.linepolygonstyle.layerfillcolor;
        var layerfillOpacity = this.configlayer.linepolygonstyle.layerfillOpacity;
        var layerweight = this.configlayer.linepolygonstyle.layerweight;
        var layerlinedash = this.configlayer.linepolygonstyle.layerlinedash;
        var stringtooltip = '';  
        
        //popup variables
        var popupstatementbefore = this.configlayer.popup.popupstatementbefore;
        var popuptitlefield = this.configlayer.popup.popuptitlefield;
        var popupfields = this.configlayer.popup.popupfields;
        var popupstatementafter = this.configlayer.popup.popupstatementafter;

        //Create layer
        var layer = new L.GeoJSON(data, { 
          color: leafletMarkerColours[markercolor],
          pointToLayer: function (feature, latlng) {      
            //font awseome style
            if (markertype == 'AwesomeMarker'){
              var marker = L.marker(latlng, {
                icon: L.AwesomeMarkers.icon({ icon: markericon, prefix: 'fa', markerColor: markercolor, spin: false }),
                alt: layername
              });
              return marker;   
            }
            //circle marker style
            else if (markertype == 'CircleMarker') {
              var marker = L.circleMarker(latlng, {
                fillColor: markercolor,
                radius:6,
                stroke: true,
                weight: 1,
                color: markercolor,
                fillOpacity: 0.6 
              });             
              return marker; 
            }
            //default style
            else {
              var marker = L.marker(latlng);             
              return marker; 
            }                        
          },
          

          onEachFeature: function (feature, layer) { 
            if (hover){
              function highlightFeature(e) {
                var layer = e.target;
            
                layer.setStyle({
                  weight: 5,
                  color: '#666',
                  dashArray: '',
                  fillOpacity: 0.7
                });
            
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                  layer.bringToFront();
                }                 
              }
        
              layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
              });
            }
            

              //Add Tooltips !!!!!!! At the moment we are using the popup fields. Create new fields for tooltips!!!!!!!!!!!!
              
              for (var i in popupfields){
                //if there are popup fields in the map config
                if (feature.properties[popupfields[i]] != '') {
                  //if there is a value for that field
                  if (feature.properties[popupfields[i].fieldname] != '' || feature.properties[popupfields[i].fieldname] != null) {
                    //if there is a label for this field in the config
                    if (popupfields[i].fieldlabel != ''){
                      stringtooltip = stringtooltip + '<br><center><b>' + popupfields[i].fieldlabel + '</b>: ' + feature.properties[popupfields[i].fieldname] + '</center>';
                    }
                    else {
                      stringtooltip = stringtooltip + '<br><center><b>' + popupfields[i].fieldlabel + '</b>: ' + feature.properties[popupfields[i].fieldname] + '</center>';
                    }

                  }                   
                } 
              }      

           
            
            //Set up Pop up windows
            //If the title is 'notitle', no title (an empty string) will be added at the top.
            var stringpopup = '';
            if (popuptitlefield === 'notitle'){
              stringpopup = ' ';
            }else{
              // put the title field at the top of the popup in bold. If there is none in the config, just use the layer title instead.
              if (popuptitlefield != ''){
                stringpopup = '<center><b>'+feature.properties[popuptitlefield]+'</b></center>';
              } else{
                stringpopup = '<center><b>' + layername +'</b></center>';
              }
           }

                 
        //if there is metadata for this layer in the config
            if (popupstatementbefore){
               stringpopup = stringpopup + '<br><center>' + popupstatementbefore + '</center>';
            }   

            //loop through the fields defined in the config and add them to the popup
            for (var i in popupfields){
              //if there are popup fields in the map config
              if (feature.properties[popupfields[i]] != ''){
                //if there is a value for that field
                if (feature.properties[popupfields[i].fieldname] != ''){
                  //if there is a label for this field in the config
                  if (popupfields[i].fieldlabel != ''){
                      stringpopup = stringpopup + '<br><center><b>' + popupfields[i].fieldlabel + '</b>: ' + feature.properties[popupfields[i].fieldname] + '</center>';
                  }
                  else {
                      stringpopup = stringpopup + '<br><center>' +  feature.properties[popupfields[i].fieldname] + '</center>';
                  }
                }                   
              }
            }
            if (popupstatementafter){
              stringpopup = stringpopup + '<br><center>' + popupstatementafter + '</center>';
           }  
            var popup = L.popup({ closeButton: true }).setContent(stringpopup);

            //Add layer to the map.
            // layer = L.geoJson(data, {style: style}).addTo(map);
            //layer = L.geoJson(data).addTo(map);

            layer.bindPopup(popup);
            

          },
          
          //alphabetic sorting of layers in legend
          sortorder: sortorder,
          
          //style function
          style: function style(feature) {
            if (layerstyle == 'default'){
              //Style purely based on config.
              return {
                stroke: layerstroke,
                color: layerstrokecolor,
                opacity: layeropacity,
                fillColor: layerfillcolor,
                fillOpacity: layerfillOpacity,
                dashArray: layerlinedash,
                weight: layerweight
              };
            }
      
            if (layerstyle == 'random polygons'){       
              //Create a random style and uses it as fillColor.
              var colorHEX = "#" + (Math.round(Math.random() * 0XFFFFFF)).toString(16);
              return {
                stroke: layerstroke,
                color: layerstrokecolor,
                fillColor: colorHEX,
                fillOpacity: layerfillOpacity,
                weight: layerweight
              };
            }

            if (layerstyle == 'random polygons'){       
              //Create a random style and uses it as fillColor.
              var colorHEX = "#" + (Math.round(Math.random() * 0XFFFFFF)).toString(16);
              return {
                stroke: layerstroke,
                color: layerstrokecolor,
                fillColor: colorHEX,
                fillOpacity: layerfillOpacity,
                weight: layerweight
              };
            }
          }          
        });
        
        function resetHighlight(e) {
          layer.resetStyle(e.target);
      }

        // title.onAdd = function (map) {
        //     this._div = L.DomUtil.get('title'); // create a div with a class "info"
        //     this.update();
        //     return this._div;
        // };

        // // method that we will use to update the control based on feature properties passed
        // title.update = function (props) {
        //     this._div.innerHTML = ' ';
        // };

      //cluster style
      if (cluster){
        var markers = L.markerClusterGroup({
          maxClusterRadius:60,
          disableClusteringAtZoom:16,
          spiderfyOnMaxZoom:false});
        markers.addLayer(layer);
        map.addLayer(markers);

      }

      //non cluster style
      else{
        layer.addTo(map);
      }
      

      }//end success    
    });//end ajax
  } //end i
}//end loadLayers

function loadMetadata(mapConfig) {
  var nbLoadedLayers = 0;
  var layers = [];
  var maptitle = mapConfig.name;
  var mapabstract = mapConfig.abstract;
  var aboutTheData = mapConfig.aboutTheData;
  var showMetadataUnderTitle = mapConfig.showMetadataUnderTitle;
  
  //load metadata from geoserver
  if (showMetadataUnderTitle){
    if (mapConfig.layers.length > 0){
      var cqlValues = "'"+mapConfig.layers[0].geoserverLayerName+"'";
    }
    //next values with commas
    for (var i=1 ; i<mapConfig.layers.length ; i++) {   
      cqlValues = cqlValues+",'"+mapConfig.layers[i].geoserverLayerName+"'";
    }
      
    var url="https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName=metadata:public_metadata&outputFormat=json&cql_filter=layer_name IN ("+cqlValues+")";
    //console.log (url);
    $.ajax({
      url: url,
      dataType: 'json',
      /* context freezes the values associated to indexes i and j. This way, when the ajax query succeeds, 
      it will use the values as they were when the query was created, and not the values associated to 'current' i and j.
      */ 
      context: {},
      success: function (data) {
        //decode metadata to create nice formatted text
        var metadataText = '';
        for (var m=0 ; m<data.features.length ; m++){
          metadataText = metadataText + '<p><b>'+data.features[m].properties.title+'</b><br>';
          if (data.features[m].properties.abstract){
            metadataText = metadataText + '<i>'+data.features[m].properties.abstract +'</i><br>';
          }
          metadataText = metadataText + '<b>Source:</b> '+data.features[m].properties.source +'<br>';
          if (data.features[m].properties.lastupdatedate){
            metadataText = metadataText + '<b>Last updated:</b> '+data.features[m].properties.lastupdatedate +'</p>';
          }
        }

        //create the tooltip
        createTitle(maptitle, mapabstract, metadataText);
        //console.log(metadataText);        
      },
   });
  }
  else if (aboutTheData){
    aboutTheData = '<p>'+aboutTheData+'</p>';
    createTitle(maptitle, mapabstract, aboutTheData);
  }
  else {
    createTitle(maptitle, mapabstract, null);
  }
}

function createTitle(maptitle, mapabstract, aboutTheData){
  var titleBoxContent;
  var metadataBoxContent;
  
  var metadataWindow = L.control.window(map,
    {content: null,
    modal: false,
    position: 'left',
    closeButton: true,
    maxWidth: 280
  });

  //on desktop
  if (!L.Browser.mobile){
    //with title
    if (maptitle != ''){
      if (mapabstract){
        //console.log ('map abstract not empty');
        var tootipdiv = '<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">'+mapabstract+'</div></span>'
      }
      else{
        var tootipdiv = '';
      }

      if (aboutTheData){
        //console.log ('about the data not empty');
        var datatooltipdiv = '<span class="datatooltip">About the data on this map</span>'
      }
      else{
        var datatooltipdiv = '';
      }
      titleBoxContent = maptitle + tootipdiv + '<br>' + datatooltipdiv
    }
    //without title
    else {
      if (aboutTheData){
        //console.log ('about the data not empty');
        var datatooltipdiv = '<span class="datatooltip">About the data on this map</span>'
        titleBoxContent = datatooltipdiv;
      }
      //without anything (no box)
      else{
        var datatooltipdiv = '';
        titleBoxContent = '';
      }
    }

    //Add box for title and metadata (if the box content is not empty)
    if (titleBoxContent!=''){
      metadataWindow.content('<center><b>About the data on this map:</b></center>'+ aboutTheData)
      L.control.custom({
        id: 'title',
        position: 'topleft',
        collapsed:false,
        content : titleBoxContent,
        //classes : 'map-title',
        classes : 'leaflet-control-layers map-title',
        style   :{
          margin: '12px',
          padding: '12px',
          background: 'white',
          //border: 'none'
        },
        events: {
          click: function(data){
            metadataWindow.show();
          }
        }
      }).addTo(map);
    }
  }
  //on mobile
  else{
  //var tooltipdiv = '<span class="tooltip"><i class="fas fa-info-circle fa-2x"></i><div class="tooltiptext"><b>'+maptitle +'</b><br><br> About the data: <br>'+ aboutTheData+'</div></span>';
  if (maptitle){
    metadataBoxContent = '<center><b>'+ maptitle +'</b><p>About the data on this map:</p></center>'+ aboutTheData;
  }
  else {
    metadataBoxContent = '<center><b>About the data on this map:</b></p></center>'+ aboutTheData;
  }
  

    //Add box for title and metadata (if the box content is not empty)
    if (metadataBoxContent!=''){
      metadataWindow.content(metadataBoxContent);
      L.control.custom({
        id: 'title',
        position: 'topleft',
        collapsed:false,
        content : '<i class="fas fa-info-circle fa-2x"></i>',
        //classes : 'map-title',
        classes : 'leaflet-control-layers map-title',
        style   :{
          margin: '12px',
          padding: '8px',
          //background: 'white',
          border: 'none'
        },
        events: {
          click: function(data){
            metadataWindow.show();
          }
        }
      }).addTo(map);
    }
  }

  
  
}
