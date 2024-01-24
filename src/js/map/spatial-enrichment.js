import L from "leaflet";
import * as turf from '@turf/turf';

class SpatialEnrichment {
  constructor(mapClass, layersData) {
    this.mapClass = mapClass;
    this.layersData = layersData;
  }

  init(){
    this.loadGeographies(this.layersData);
  }

  loadGeographies(layersData){
    //list all geography layers to load
    let listGeographyLayerNames = [];
    for (const layerData of layersData){
      if (layerData.configLayer.spatialEnrichments){
        for (const spatialEnrichment of layerData.configLayer.spatialEnrichments){
          if (! listGeographyLayerNames.includes(spatialEnrichment.geographyLayer)){
            listGeographyLayerNames.push(spatialEnrichment.geographyLayer);
          }
        }
      }
    }
    
    //load each layer and keep count
    let geographyLayerDict = {};
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
          geographyLayerDict[geographyLayerName] = data;
          if (Object.keys(geographyLayerDict).length == listGeographyLayerNames.length){
            // console.log('Load completed for ' +listGeographyLayerNames.length+ ' geography layers');
            this.enrichLayers(layersData, geographyLayerDict);
          }
        })
      .catch(error => {
        console.log(error);
        alert("Something went wrong while loading geography layers for spatial enrichment");
      });     

    }

  }
  
  //Use TURF to do spatial joins between map layers and geography layers 
  enrichLayers(layersData, geographyLayerDict){ 
    var enriched_data;
    for (const layerData of layersData){
      if (layerData.configLayer.spatialEnrichments){
        for (const spatialEnrichment of layerData.configLayer.spatialEnrichments){
          console.log('Enriching, assuming the layer to enrich is a point layer');
          enriched_data = turf.tag(layerData.data, geographyLayerDict[spatialEnrichment.geographyLayer], spatialEnrichment.sourceAttribute, spatialEnrichment.targetAttribute);  
          layerData.data = enriched_data;
        }
        // console.log('after enrichment: ');
        // console.log(layersData);
      }
    }     
  }
}

export default SpatialEnrichment;
