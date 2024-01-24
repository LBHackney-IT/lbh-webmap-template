import L from "leaflet";
import * as turf from '@turf/turf';

class SpatialEnrichment {
  constructor(mapClass) {
    this.mapClass = mapClass;
    this.mapConfig = mapClass.mapConfig;
    this.geographyLayerDict = {};
  }

  init(){
    
  }

  loadGeographyLayers(){
    //list all geography layers to load
    let listGeographyLayerNames = [];
    for (const configLayer of this.mapConfig.layers){
      if (configLayer.spatialEnrichments){
        for (const spatialEnrichment of configLayer.spatialEnrichments){
          if (! listGeographyLayerNames.includes(spatialEnrichment.geographyLayer)){
            listGeographyLayerNames.push(spatialEnrichment.geographyLayer);
          }
        }
      }
    }
    
    //load each layer and keep count
    let url = '';
    for (const geographyLayerName of listGeographyLayerNames){
      url = this.mapClass.geoserver_wfs_url + geographyLayerName;
      //Fetch the url
      fetch(url, {
        method: "get"
      })
        .then(response => response.json())
        .then(data => {
          // console.log(layersData);
          this.geographyLayerDict[geographyLayerName] = data;
          if (Object.keys(this.geographyLayerDict).length == listGeographyLayerNames.length){
            // console.log('Load completed for ' +listGeographyLayerNames.length+ ' geography layers');
          }
        })
      .catch(error => {
        console.log(error);
        alert("Something went wrong while loading geography layers for spatial enrichment");
      });     
    }
  }
  
  //Use TURF to do spatial joins between map layers and geography layers 
  enrichLayers(layersData){ 
    var enriched_data;
    for (const layerData of layersData){
      if (layerData.configLayer.spatialEnrichments){
        for (const spatialEnrichment of layerData.configLayer.spatialEnrichments){
          console.log('Enriching, assuming the layer to enrich is a point layer');
          enriched_data = turf.tag(layerData.data, this.geographyLayerDict[spatialEnrichment.geographyLayer], spatialEnrichment.sourceAttribute, spatialEnrichment.targetAttribute);  
          layerData.data = enriched_data;
        }
        console.log('after enrichment: ');
        console.log(layersData);
      }
    }     
  }
}

export default SpatialEnrichment;
