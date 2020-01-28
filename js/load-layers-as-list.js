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
        var markericon = this.configlayer.icon;
        var markercolour = this.configlayer.markercolour;
        var metadata = this.configlayer.metadata;
        var popuptitlefield = this.configlayer.popup.popuptitlefield;
        var popupfields = this.configlayer.popup.popupfields;
        var layercontrol = this.layercontrol;
        var overlayMaps = this.overlayMaps;
        var layerGroups = this.layerGroups;
        var layers = this.layers;
        var maptitle = mapConfig.name;
        var mapabstract = mapConfig.abstract;
        var hover = this.configlayer.hover;  
        //Style variables
        var layerstyle = this.configlayer.style.stylename;
        var layerstroke = this.configlayer.style.layerstroke;
        var layerstrokecolor =this.configlayer.style.layerstrokecolor;
        var layeropacity = this.configlayer.style.layeropacity;
        var layerfillcolor = this.configlayer.style.layerfillcolor;
        var layerfillOpacity = this.configlayer.style.layerfillOpacity;
        var layerweight = this.configlayer.style.layerweight;
        var layerlinedash = this.configlayer.style.layerlinedash;
        var stringtooltip = '';  
        
        if (mapabstract){
          console.log ('map abstract not empty');
          var tootipdiv = '<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">'+mapabstract+'</div></span>'
        }
        else{
          var tootipdiv = '';
        }

          //Add title 
       var title = L.control.custom({
        id: 'title',
        position: 'topleft',
        collapsed:false,
        content : maptitle + '     '+ tootipdiv,
        //content : 'Hello',
        classes : 'leaflet-control-layers map-title',
        style   :{
          margin: '12px',
          padding: '12px',
          background: 'white',
        },
      }).addTo(map);

        //Create layer
        var layer = new L.GeoJSON(data, { 
          color: leafletMarkerColours[markercolour],
          pointToLayer: function (feature, latlng) {      
              var marker = L.marker(latlng, {
                  icon: L.AwesomeMarkers.icon({ icon: markericon, prefix: 'fa', markerColor: markercolour, spin: false }),
                  alt: layername
              });
            return marker;               
          },
          

          onEachFeature: function (feature, layer) { 
            if (hover == 'yes'){
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
  
                title.remove(map);
                //Add title 
                var title = L.control.custom({
                  id: 'title',
                  position: 'topleft',
                  collapsed:false,
                  content : maptitle + '     '+ tootipdiv + 'hello',
                  //content : 'Hello',
                  classes : 'leaflet-control-layers map-title',
                  style   :{
                    margin: '12px',
                    padding: '12px',
                    background: 'white',
                  },
                }).addTo(map);
  
                             
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
            if (metadata != ''){
               stringpopup = stringpopup + '<br><center>' + metadata + '</center>';
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

    
      layer.addTo(map);

      }//end success    
    });//end ajax

    

  } //end i
}//end loadLayers

