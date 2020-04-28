import DataLayers from "./data-layers";

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
    this.createMarkup();
  }

  createMarkup() {
    let html = `<div class="govuk-accordion listview lbh-accordion" data-module="govuk-accordion" id="listview" data-attribute="value">
    <div class="govuk-accordion__section ">
      <div class="govuk-accordion__section-header">
        <h5 class="govuk-accordion__section-heading">
          <span class="govuk-accordion__section-button" id="listview-heading-1">`
          + this.layersData+
          `</span>
        </h5>
      </div>
      <div id="listview-content-1" class="govuk-accordion__section-content" aria-labelledby="listview-heading-1">
        <ul class="lbh-list lbh-list--bullet">
<li>Example item 1</li>
</ul></div></div>`;
    
    this.mapClass.addMarkupToMap(html, "listview", "listview");

  }
 

 
}

export default List;
