
            
               function style(feature) {
                if (layerstyle == 'default'){
                    return {
                        stroke: layerstroke,
                        color: layerstrokecolor,
                        opacity: layeropacity,
                        fillColor: layerfillcolor,
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
                  //opacity: layeropacity,
                  //fillColor: colorHEX,
                  // fillColor: 'blue',
                  // fillOpacity: layerfillOpacity,
                  fillOpacity:0.5
                  //weight: layerweight
                };
            }
          }
        