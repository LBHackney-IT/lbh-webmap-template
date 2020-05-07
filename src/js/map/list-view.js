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
    let html = `<div class="govuk-accordion lbh-accordion" data-module="govuk-accordion" id="default-example" data-attribute="value">
    <div class="govuk-accordion__section ">
      <div class="govuk-accordion__section-header">
        <h5 class="govuk-accordion__section-heading">
          <span class="govuk-accordion__section-button" id="default-example-heading-1">
            Section A
          </span>
        </h5>
      </div>
      <div id="default-example-content-1" class="govuk-accordion__section-content" aria-labelledby="default-example-heading-1">
        <ul class="lbh-list lbh-list--bullet">
  <li>Example item 1</li>
  </ul>
  
      </div>
    </div>
    <div class="govuk-accordion__section ">
      <div class="govuk-accordion__section-header">
        <h5 class="govuk-accordion__section-heading">
          <span class="govuk-accordion__section-button" id="default-example-heading-2">
            Section B
          </span>
        </h5>
      </div>
      <div id="default-example-content-2" class="govuk-accordion__section-content" aria-labelledby="default-example-heading-2">
        <ul class="lbh-list lbh-list--bullet">
  <li>Example item 2</li>
  </ul> 
      </div>
    </div>
  </div>`;
    
    this.mapClass.addMarkupToMap(html, "listview", "listview");

  }
 

 
}

export default List;
