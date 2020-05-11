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
    
    let html = `<div class="listview-container"><h3>${this.list.sectionHeader}</h3>`;
    html += `<div class="govuk-accordion lbh-accordion" data-module="govuk-accordion" data-attribute="value">`;
    for (var layerData of this.layersData){
      console.log(layerData)
      if (layerData.configLayer.listView){
        html += `<div class="govuk-accordion__section ">
        <div class="govuk-accordion__section-header">
          <h5 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button">
            ${layerData.configLayer.title} &nbsp <i class="fas fa-${layerData.configLayer.pointStyle.icon}" style="color:${MARKER_COLORS[layerData.configLayer.pointStyle.markerColor]}"></i>
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
          <h6>${feat.feature.properties[layerData.configLayer.listView.title]}</h6>`;
          if (layerData.configLayer.listView.fields) {
            html += `<p class="lbh-body-s">`;
            for (const field of layerData.configLayer.listView.fields) {
              if (feat.feature.properties[field] !== "") {
                if (
                  feat.feature.properties[field.name] !== "" &&
                  feat.feature.properties[field.name] !== null
                ) {
                  if (field.label != "") {
                    html += `${field.label}</span>: ${feat.feature.properties[field.name]}<br>`;
                  } else {
                    html += `${feat.feature.properties[field.name]}<br>`;
                  }
                }     
              }
            }
            html += `</p>`
          }          
          html += `</div>`;
        }
        html += `</div>`;
      }
    }
    html += `</div></div>`;
    
    this.mapClass.addMarkupToMapAfter(html, "listview", "listview");
    //activate component from lbh-frontend
    window.LBHFrontend.initAll();

  }
 

 
}

export default List;
