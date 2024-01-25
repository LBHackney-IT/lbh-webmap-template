import L from "leaflet";
import * as turf from '@turf/turf';

class SpatialEnrichment {
  constructor(mapClass) {
    this.mapClass = mapClass;
    this.mapConfig = mapClass.mapConfig;
    this.geographyLayerDict = {};
  }

  init(){}

  enrichLayers(layersData) {
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
            console.log('Load completed for ' +listGeographyLayerNames.length+ ' geography layers');
            //Now use TURF to do spatial joins between map layers and geography layers 
            for (const layerData of layersData){
              if (layerData.configLayer.spatialEnrichments){
                for (const spatialEnrichment of layerData.configLayer.spatialEnrichments){
                  // console.log('Enriching, assuming the layer to enrich is a point layer');
                  // console.log('layersData:');
                  // console.log(layerData.data);
                  // console.log('laygeography layer: ');
                  // console.log(this.geographyLayerDict[spatialEnrichment.geographyLayer]);
                  layerData.data = turf.tag(layerData.data, this.geographyLayerDict[spatialEnrichment.geographyLayer], spatialEnrichment.sourceAttribute, spatialEnrichment.targetAttribute);  
                }
                // console.log('after enrichment: ');
                // console.log(layersData);
              }
            }     
          }
        })
      .catch(error => {
        console.log(error);
        alert("Something went wrong while loading geography layers for spatial enrichment");
      });     
    }
  }
}

export default SpatialEnrichment;
