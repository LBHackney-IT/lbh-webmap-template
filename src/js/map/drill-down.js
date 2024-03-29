import L from "leaflet";
import * as turf from '@turf/turf';

class DrillDown {
  constructor(map) {
    this.map = map;
  }

  init(){
    this.map.on('click', (e) => {
      this.inspectClickedLocation(e);
    });
  }


  inspectClickedLocation(e){
    //Create bounding box for the point (L.latLngBounds)
    var turfClickPoint = turf.point([e.latlng.lng, e.latlng.lat]);
    //Empty intersectingFeatures array where we will push the features that intersect the clicked location
    var intersectingFeatures = [];
    //Empty array to filter the intersecting features later
    var uniqueIntersectingFeatures = [];
    //Empty globalPopUp variable where we will be adding the popUp content of the intersecting features
    var globalPopUp = '';
   
    this.map.eachLayer(layer => {
      if (layer.feature){
        //console.log(layer);
        //If the feature is a polygon...
        if (layer.feature.geometry.type == 'Polygon'){
          let turfPoly = turf.polygon(layer.feature.geometry.coordinates);
            //Check if the point is within the polygon. If it is, we push the feature into the intersectingFeatures array
            if (turf.booleanPointInPolygon(turfClickPoint, turfPoly)){
              intersectingFeatures.push(layer);
            } 
        }
        //If the feature is a multipolygon...
        else if (layer.feature.geometry.type == 'MultiPolygon'){
          layer.feature.geometry.coordinates.forEach(part => {
            //Check if the point is within any of the polygon parts. If it is, we push the feature into the intersectingFeatures array
            let turfPoly = turf.polygon(part);
              if (turf.booleanPointInPolygon(turfClickPoint, turfPoly)){
                intersectingFeatures.push(layer);
              }
            
          })         
        }
        //If the feature is a point...
        else if (layer.feature.geometry.type == 'Point'){
            let turfPoint = turf.point(layer.feature.geometry.coordinates);
            let turfClickPointBuffer = turf.buffer(turfClickPoint, 0.03, {units: 'kilometers'});         
            //Check if the feature point is whithin the clicked location buffer. If it is, we push the feature into the intersectingFeatures array
              if (turf.booleanPointInPolygon(turfPoint,turfClickPointBuffer)){
                intersectingFeatures.push(layer);
              }       
        }
         //If the feature is a multipoint
         else if (layer.feature.geometry.type == 'MultiPoint'){
              let turfClickPointBuffer = turf.buffer(turfClickPoint, 0.03, {units: 'kilometers'}); 
              layer.feature.geometry.coordinates.forEach(point => {
                let turfPoint = turf.point(point);
              //Check if the feature point is whithin the clicked location buffer. If it is, we push the feature into the intersectingFeatures array 
              if (turf.booleanPointInPolygon(turfPoint,turfClickPointBuffer)){
                intersectingFeatures.push(layer);
                
              }   
            })   
                      
        }
        //If the feature is a line...
        else if(layer.feature.geometry.type == 'LineString'){
            //Create a turf line from the feature, create the bounding box and covert the bounding box into a turf polygon. 
            let turfLine = turf.lineString(layer.feature.geometry.coordinates);
            //Create a buffer around the clickLatLong point (the clicked location)
            let clickLatLonBuffer = turf.buffer(turfClickPoint, 0.02, {units: 'kilometers'});
            //Check if both polygons intersect. If they do, we push the feature into the intersectingFeatures array
            if (turf.lineIntersect(clickLatLonBuffer, turfLine).features.length > 0) {
              intersectingFeatures.push(layer);
            }  
        }
        //If the feature is a multiline...
        else if (layer.feature.geometry.type == 'MultiLineString'){
            let clickLatLonBuffer = turf.buffer(turfClickPoint, 0.02, {units: 'kilometers'});
            layer.feature.geometry.coordinates.forEach(part => {
              //Check if both polygons intersect. If they do, we push the feature into the intersectingFeatures array
              let turfLine = turf.lineString(part);
              if (turf.lineIntersect(clickLatLonBuffer, turfLine).features.length > 0) {
                intersectingFeatures.push(layer);
              }
           })
        }            
      }
    });

    
    //If there is at least one intersecting feature...
    if (intersectingFeatures.length > 0){
      //We remove the duplicates and include them in the uniqueIntersectingFeatures array
      intersectingFeatures.forEach(layer => {
        if (!uniqueIntersectingFeatures.includes(layer)){
          uniqueIntersectingFeatures.push(layer)
          //We get the global pop up content of the unique intersecting features
          if (layer.getPopup()){
            if (globalPopUp != ''){
              globalPopUp += '<br/><hr><br/>';
            }
            globalPopUp += layer.getPopup().getContent();
          }
        }
      }); 
      //Open pop up window using the glocal pop up content of the unique intersecting features array
      this.map.openPopup(globalPopUp, e.latlng, {
        offset: L.point(0, -24),
        maxHeight: 300
      }); 
    }
 
  }
}

export default DrillDown;
