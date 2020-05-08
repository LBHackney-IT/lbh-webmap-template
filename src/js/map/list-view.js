import DataLayers from "./data-layers";
import { MARKER_COLORS } from "./consts";

class List {
  constructor(map, layersData) {
    this.mapClass = map;
    this.mapConfig = map.mapConfig;
    this.layersData = layersData;
    this.container = map.container;
    this.list = null;
  }

  init() {
    this.list = this.mapConfig.list;
    this.layersData.sort((a, b) => (a.layer.options.sortOrder > b.layer.options.sortOrder) ? 1 : -1);
    console.log(this.layersData);
    this.createMarkup();
  }

  createMarkup() {
    let html = `<div class="govuk-accordion lbh-accordion" data-module="govuk-accordion" id="default-example" data-attribute="value">`;
    for (var layerData of this.layersData){
      console.log(layerData)
      html += `<div class="govuk-accordion__section ">
      <div class="govuk-accordion__section-header">
        <h5 class="govuk-accordion__section-heading">
          <span class="govuk-accordion__section-button" id="default-example-heading-1">
          <i class="fas fa-${layerData.configLayer.pointStyle.icon}" style="color:${MARKER_COLORS[layerData.configLayer.pointStyle.markerColor]}"></i>&nbsp &nbsp
          ${layerData.configLayer.title} (${layerData.layer.getLayers().length})
          </span>
        </h5>
      </div>`;
      for (var feat of layerData.layer.getLayers()){
        //for (var feature of layerData.data.features){
        // html += `<div id="default-example-content-1" class="govuk-accordion__section-content" aria-labelledby="default-example-heading-1">
        // <ul class="lbh-list lbh-list--bullet">
        // <li>${feature.properties.organisation_name}</li>
        // </ul></div>`;
        html += `<div id="default-example-content-1" class="govuk-accordion__section-content">
        <h6>${feat.feature.properties.organisation_name}</h6>
        <p class="lbh-body-s">${feat.feature.properties.about_us}
        <br>Address - ${feat.feature.properties.address}
        <br>Tel - ${feat.feature.properties.phone}
        <br>${feat.feature.properties.links}</p>
        </div>`;
      }
      html += `</div>`;
    }
  html += `</div>`;
    
    this.mapClass.addMarkupToMap(html, "listview", "listview");
    //activate component from lbh-frontend
    window.LBHFrontend.initAll();

  }
 

 
}

export default List;
