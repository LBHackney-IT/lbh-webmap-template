import DataLayers from "./data-layers";
import { MARKER_COLORS } from "./consts";
import { header } from "express-validator/check";

class List {
  constructor(map, layersData) {
    this.mapClass = map;
    this.mapConfig = map.mapConfig;
    this.map = map.map
    this.layersData = layersData;
    this.container = map.container;
    this.list = null;
    this.accordionExpandedClass = null;
    this.tableLayers = ['Free standing Fast','Free standing Rapid','Free standing Smart Fast ','Lamp columns / Slow chargers']//@TRACK  put this into a config
  }

  init() {
    this.list = this.mapConfig.list;
    this.layersData.sort((a, b) => (a.layer.options.sortOrder > b.layer.options.sortOrder) ? 1 : -1);
    this.layersData.map((layerObj) =>{layerObj.layer.isVisible =true;return null})

    
    if (this.list.accordionStatus == 'allExpanded'){
      this.accordionExpandedClass = 'govuk-accordion__section--expanded';
    }
    //@TODO add 'firstExpanded' option
    else{
      this.accordionExpandedClass = '';
    }

    this.addlayerEventListeners(this.layersData,this.createTable.bind(this))
    this.createTable()
    // this.createMarkup();
  }
  
  addlayerEventListeners(dataLayers,createTable){

    console.log(dataLayers)
    dataLayers.map((layerObj) => {
      if(this.tableLayers.includes(layerObj.configLayer.title)){

        // get layer
        let layer = layerObj.layer
        // add visibility state
        // layer.isVisible = true
        // assign event listeners to layers
        layer.on('add',()=>{
          layer.isVisible = true
          createTable()
        })
        
        layer.on('remove',()=>{
          layer.isVisible = false
          createTable()
        })
      }
      return null
    })

  }

  createTable(){
    console.log('Creating table...')

    const tableDiv =  document.getElementById('tableview')
    tableDiv&&tableDiv.remove()

    //Prep table content 

    let tableHeaders =""
    let tableRows = ""
    let totalRows = 0
    let combinedData = []
    
    // get headers
    for (const layerObj of this.layersData){
      if(this.tableLayers.includes(layerObj.configLayer.title)){
        for (const header of Object.keys(layerObj.data.features[0].properties)){
          tableHeaders += `<th>${header}</th>`
        }
        break
      }
    }
    // get rows
    for (const layerObj of this.layersData){
      if(this.tableLayers.includes(layerObj.configLayer.title)&&layerObj.layer.isVisible){
        console.log(layerObj.configLayer.title)
        totalRows += layerObj.data.features.length
        for (const feature of layerObj.data.features){
          let row = "<tr>"
          combinedData = [...combinedData,...[feature.properties]]
          Object.values(feature.properties).map((propertyValue) =>{
              row += `<td>${propertyValue}</td>`
              return null
            })
            row +="</tr>"
            tableRows += row
        }
        
      }
    }

    let tableMarkup = `
    <div class="listview-container">
      <h3>TABLES</h3>
      <div class="govuk-accordion lbh-accordion" data-module="govuk-accordion" data-attribute="value">
        <div class="govuk-accordion__section ${this.accordionExpandedClass}">
          <div class="govuk-accordion__section-header">
            <h5 class="govuk-accordion__section-heading">
              <span class="govuk-accordion__section-button">
                Summary Table
              </span>
            </h5>
          </div>
          <div id="default-example-content-1" class="govuk-accordion__section-content">
            <div class="table-container">
              <div class="table-wrapper">
                <table>
                  <tr>
                    ${tableHeaders}
                  </tr>
                  ${tableRows}
                </table>
              </div>
              <div class="table-footer">
                <span class="table-row-count">Showing&nbsp;${totalRows}&nbsp;row(s)</span>
                <button id="table-download-btn" class="lbh-button download-btn">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `

   
    
  
    
    this.mapClass.addMarkupToMapAfter(tableMarkup, "tableview", "listview");
    //activate component from lbh-frontend
    
    let downloadBtn = document.getElementById("table-download-btn")
    downloadBtn&&downloadBtn.addEventListener('click',()=>{
      
      const downloadCSV=(csvString)=>{
        const dataBlob = new Blob([csvString],{type:'text/csv'});
        const a =document.createElement('a');
        a.href = URL.createObjectURL(dataBlob);
        a.download='data.csv'

        document.body.appendChild(a)
        a.click()
        setTimeout(()=>{
          document.body.removeChild(a)
        },100)
      
      }
      const convertToCSV=(data)=>{
        const headers= Object.keys(data[0]);
        const csvData = data.map(object => headers.map(header => object[header]).join(','));
        csvData.unshift(headers.join(','));
        const csvString = csvData.join('\n');
        // console.log(csvString)
        // return csvString;

        downloadCSV(csvString)
      }
      
      convertToCSV(combinedData)
    })
    window.LBHFrontend.initAll();
  }

  createMarkup() {
    let html = `<div class="listview-container"><h3>${this.list.sectionHeader}</h3>`;
    html += `<div class="govuk-accordion lbh-accordion" data-module="govuk-accordion" data-attribute="value">`;
    for (var layerData of this.layersData){
      if (layerData.configLayer.listView){
        if (this.list.showIcons){
          html += `<div class="govuk-accordion__section ${this.accordionExpandedClass}">
            <div class="govuk-accordion__section-header">
            <h5 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button">
            ${layerData.configLayer.title} &nbsp <i class="fas fa-${layerData.configLayer.pointStyle.icon}" style="color:${MARKER_COLORS[layerData.configLayer.pointStyle.markerColor]}"></i>
            </span>
            </h5>
          </div>`;
        }
        else{
          html += `<div class="govuk-accordion__section ${this.accordionExpandedClass}">
            <div class="govuk-accordion__section-header">
            <h5 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button">
            ${layerData.configLayer.title}
            </span>
            </h5>
          </div>`;
        }
        
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
