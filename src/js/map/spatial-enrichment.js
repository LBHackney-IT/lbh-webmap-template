import L from "leaflet";
import * as turf from '@turf/turf';

class SpatialEnrichment {
  constructor(mapClass) {
    this.mapClass = mapClass;
  }

  init(){}

  enrichLayers(layersData) {
    //use TURF to do spatial joins between map layers and geography layers 
    for (const enrichedLayer of layersData){
      if (enrichedLayer.configLayer.spatialEnrichments){
        console.log('Enriching '+enrichedLayer.configLayer.title+', assuming it is a point layer');
        for (const spatialEnrichment of enrichedLayer.configLayer.spatialEnrichments){
          //look for the corresponding enriching layer (already loaded)
          for (const enrichingLayer of layersData){
            if (enrichingLayer.configLayer.title == spatialEnrichment.geographyLayer) {
              console.log('Enriching with '+enrichingLayer.configLayer.title+', assuming it is an area layer');
              enrichedLayer.data = turf.tag(enrichedLayer.data, enrichingLayer.data, spatialEnrichment.sourceAttribute, spatialEnrichment.targetAttribute);  
            }
          }
        }
      }
    }     
  }
}

export default SpatialEnrichment;
