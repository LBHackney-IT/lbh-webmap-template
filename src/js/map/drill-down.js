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
    //Empty globalPopUp variable where we will be adding the popUp content of the intersecting features
    var globalPopUp = '';
   
    this.map.eachLayer(layer => {
      if (layer.feature){
        console.log(layer);
        //If the feature is a polygon...
        if (layer.feature.geometry.type == 'Polygon'){
          console.log("polygon");
          console.log(intersectingFeatures.includes(layer));
          let turfPoly = turf.polygon(layer.feature.geometry.coordinates);
          //Check if the point is within the polygon. If it is, we push the feature into the intersectingFeatures array and create get the popUp content
          if (turf.booleanPointInPolygon(turfClickPoint, turfPoly)){
            intersectingFeatures.push(layer);
            if (globalPopUp != ''){
              globalPopUp += '<br/><hr><br/>';
            }
            globalPopUp += layer.getPopup().getContent();
          }
        }
        //If the feature is a multipolygon...
        else if (layer.feature.geometry.type == 'MultiPolygon'){
          console.log("multipolygon");
          console.log(intersectingFeatures.includes(layer));
          layer.feature.geometry.coordinates.forEach(part => {
            if (!intersectingFeatures.includes(layer)){
              let turfPoly = turf.polygon(part);
              if (turf.booleanPointInPolygon(turfClickPoint, turfPoly)){
                intersectingFeatures.push(layer);
                if (globalPopUp != ''){
                  globalPopUp += '<br/><hr><br/>';
                }
                globalPopUp += layer.getPopup().getContent();
              }
            } 
          })         
        }
        //If the feature is a point...
        else if (layer.feature.geometry.type == 'Point'){
          console.log("point");
          console.log(intersectingFeatures.includes(layer));
          let turfPoint = turf.point(layer.feature.geometry.coordinates);
          let turfClickPointBuffer = turf.buffer(turfClickPoint, 0.01, {units: 'kilometers'});         
          //Check if the feature point is whithin the clicked location buffer. If it is, we push the feature into the intersectingFeatures array and create get the popUp content
          if (turf.booleanPointInPolygon(turfPoint,turfClickPointBuffer)){
            intersectingFeatures.push(layer);
            if (globalPopUp != ''){
              globalPopUp += '<br/><hr><br/>';
            }
            globalPopUp += layer.getPopup().getContent();
          }       
        }
         //If the feature is a multipoint
         else if (layer.feature.geometry.type == 'MultiPoint'){
          console.log("multipoint");
          console.log(intersectingFeatures.includes(layer));
          let turfClickPointBuffer = turf.buffer(turfClickPoint, 0.01, {units: 'kilometers'}); 
          layer.feature.geometry.coordinates.forEach(point => {
            let turfPoint = turf.point(point);
           //Check if the feature point is whithin the clicked location buffer. If it is, we push the feature into the intersectingFeatures array and create get the popUp content
          if (turf.booleanPointInPolygon(turfPoint,turfClickPointBuffer)){
            intersectingFeatures.push(layer);
            if (globalPopUp != ''){
              globalPopUp += '<br/><hr><br/>';
            }
            globalPopUp += layer.getPopup().getContent();
          }   
          })               
        }
        //If the feature is a line...
        else if(layer.feature.geometry.type == 'LineString'){
          console.log("linestring");
          console.log(intersectingFeatures.includes(layer));
          //Create a turf line from the feature, create the bounding box and covert the bounding box into a turf polygon. 
          let turfLine = turf.lineString(layer.feature.geometry.coordinates);
          //Create a buffer around the clickLatLong point (the clicked location)
          let clickLatLonBuffer = turf.buffer(turfClickPoint, 0.02, {units: 'kilometers'});
          //Check if both polygons intersect. If they do, we push the feature into the intersectingFeatures array and create get the popUp content
          if (turf.lineIntersect(clickLatLonBuffer, turfLine).features.length > 0) {
            intersectingFeatures.push(layer);
            if (globalPopUp != ''){
              globalPopUp += '<br/><hr><br/>';
            }
            globalPopUp += layer.getPopup().getContent();
          }
        }
        //If the feature is a multiline...
        else if (layer.feature.geometry.type == 'MultiLineString'){
          console.log("multilinestring");
          console.log(intersectingFeatures.includes(layer));
          let clickLatLonBuffer = turf.buffer(turfClickPoint, 0.02, {units: 'kilometers'});
          layer.feature.geometry.coordinates.forEach(part => {
            let turfLine = turf.lineString(part);
            console.log(intersectingFeatures.includes(layer));
            if (turf.lineIntersect(clickLatLonBuffer, turfLine).features.length > 0) {
              intersectingFeatures.push(layer);
              if (globalPopUp != ''){
                globalPopUp += '<br/><hr><br/>';
              }
              globalPopUp += layer.getPopup().getContent();
            }
          })
        }   
                 
      }
    

    });

    if (intersectingFeatures.length > 0){
      console.log(intersectingFeatures);
      this.map.openPopup(globalPopUp, e.latlng, {
        offset: L.point(0, -24),
        maxHeight: 300
      }); 
    }
 
  }
}

export default DrillDown;
