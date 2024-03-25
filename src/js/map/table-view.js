import { MARKER_COLORS } from "./consts.js";
import SpatialEnrichment from "./spatial-enrichment.js"

class Table {
  constructor(map, layersData) {
    this.mapClass = map;
    this.mapConfig = map.mapConfig;
    this.map = map.map
    this.layersData = layersData;
    this.container = map.container;
    this.table = null;
    this.list = null;
    this.accordionExpandedClass = null;
    // Retrieve all layer names from all the scopes - these will be assinged event listeners 
    if (this.mapConfig.statistics){
      
      this.tableLayers = this.mapConfig.statistics.statisticsTables.reduce(
        (accumulator, currentValue) => {
          const scope = currentValue.scope
          scope.map(layerName => accumulator.add(layerName))
          return accumulator
        },
        new Set(),
      );
    }

  }

  init() {
    this.list = this.mapConfig.list;
    this.table = this.mapConfig.statistics;
    this.layersData.sort((a, b) => (a.layer.options.sortOrder > b.layer.options.sortOrder) ? 1 : -1);
    // TAG each layer Visible initially
    this.layersData.map((layerObj) =>{layerObj.layer.isVisible = true;return null})
    //______________________ENRICH LAYERS
    this.spatialEnrichment = new SpatialEnrichment(this.mapClass);
    this.spatialEnrichment.enrichLayers(this.layersData)


    if (this.list && this.list.accordionStatus == 'allExpanded'){
      this.accordionExpandedClass = 'govuk-accordion__section--expanded';
    }
    //@TODO add 'firstExpanded' option
    else{
      this.accordionExpandedClass = '';
    }
    this.list && this.createMarkup();

    //if tables are defined
    if (this.mapConfig.statistics){
      this.addlayerEventListeners(this.layersData,this.createTables.bind(this),this.createMarkup.bind(this));
      this.createTables();
    }

    //Activate List components from lbh-frontend of no Statistics present
    window.LBHFrontend.initAll();
  }
  
  addlayerEventListeners(dataLayers,createTables,createListViews){

    // console.log(dataLayers)
    dataLayers.map((layerObj) => {
      if(Array.from(this.tableLayers).includes(layerObj.configLayer.title)){

        // get layer
        let layer = layerObj.layer
        // assign event listeners to layers
        layer.on('add',()=>{
          // add visibility state
          layer.isVisible = true
          this.list && createListViews()
          this.table && createTables();
          window.LBHFrontend.initAll()
        })
        
        layer.on('remove',()=>{
          layer.isVisible = false
          this.list && createListViews()
          this.table && createTables();
          window.LBHFrontend.initAll()
        })
      }
      return null
    })

  }

  
  createTable(config){

    //________Prep table content 
    let totalRows = 0
    let combinedData = []
     
    //_______get rows from visible lyers on map
    for (const layerObj of this.layersData){
      if(config.scope.includes(layerObj.configLayer.title)&&layerObj.layer.isVisible){
        // console.log(layerObj.configLayer.title)
        totalRows += layerObj.data.features.length
        for (const feature of layerObj.data.features){
          combinedData = [...combinedData,...[feature.properties]]
        }
        
      }
    }

    let filteredData = combinedData
    
    //________________________________________FILTER_DF________________________________________
    if(config.filters){
      filteredData = filteredData.filter(feature => {
        return config.filters.every(filter =>{
          const {attribute,operator,value} = filter;
          switch (operator){
            case '>':
              return feature[attribute] > value;
            case '<':
              return feature[attribute] < value;
            case '>=':
              return feature[attribute] >= value;
            case '<=':
              return feature[attribute] <= value;
            case '===':
              return feature[attribute] === value;
            case '!==':
              return feature[attribute] !== value;
            case 'contains':
              return feature[attribute].includes(value);
            default:
              return false
          }

        });
      });
      
    }

    const dataPresent  = filteredData.length > 0
    // console.log('DATA PRESENT ? ',dataPresent)

    //__________________________________________________________________________________________

    const df = dataPresent ? new dfd.DataFrame(filteredData):null

    // console.log(df.columns)
    console.log(config.tableTitle)
    // console.log('FILTERED DATA : ',filteredData)

    
    
    // Configure data types for aggregation functions to run correctly e.g change strings into numbers
    if(dataPresent&&config.dtypes){
      for (const [dtype,columns] of Object.entries(config.dtypes)){
        columns.map(col => {
          df.asType(col,dtype,{inplace:true})
          return null
        })
      }
    }
    
    let new_df =  df
   
    //________Handle Errors before creating tables
    if(dataPresent&&config.aggregations&&config.functions){
      alert(`Error in rendering table: "${config.tableTitle}"`)
      console.error('Cannot use Aggregations and Functions in the same Table. ')
      return;
    }
    if(dataPresent&&config.aggregations&& !config.groupBy){
      alert(`Error in rendering table: "${config.tableTitle}"`)
      console.error('Cannot use Aggregations without a groupBy clause.')
      return;
    }

    //_____________________GROUP DATAFRAME and AGGREGATE________________
    if(dataPresent&&config.groupBy){
      new_df = df.groupby(config.groupBy).agg(
        config.aggregations
      )
    }

    if(dataPresent&&config.functions){
      
      let functions = config.functions
      let results = []
      for (const key in functions){
        
        functions[key].map(col =>{ 
          switch(key){

            case('sum'):
              results.push({column:`${col}_${key}`,value:new_df[col].sum()})
              break
            case('count'):
              results.push({column:`${col}_${key}`,value:new_df[col].count()})
              break
            case('count_distinct'):
            results.push({column:`${col}_${key}`,value: (new Set(new_df[col]["$data"])).size})
              break
            case('median'):
              results.push({column:`${col}_${key}`,value:new_df[col].median()})
              break
            case('mean'):
              results.push({column:`${col}_${key}`,value:new_df[col].mean()})
              break
            case('mode'):
              results.push({column:`${col}_${key}`,value:new_df[col].mode()})
              break
            case('max'):
              results.push({column:`${col}_${key}`,value:new_df[col]["$data"].reduce((a, b) => Math.max(a, b), -Infinity)})
              break
              case('min'):
              results.push({column:`${col}_${key}`,value:new_df[col]["$data"].reduce((a, b) => Math.min(a, b), Infinity)})
              break
            case('var'):
              results.push({column:`${col}_${key}`,value:new_df[col].var()})
              break
            case('std'):
              results.push({column:`${col}_${key}`,value:new_df[col].std()})
              break
            default:
              results.push({column:`${col}_${key}`,value:'Error'})
              console.error(`${key} is not a valid operator.`)

          }
          return null}
          )
      }
      if(results.length > 0){
        new_df = new dfd.DataFrame(results)
      }else{
        console.error('No data from "functions" aggregations')
        return;
      }
      
    }

    // ________Rename columns using config labels_____________
    if(dataPresent&&config.labels){ 
      new_df.rename(config.labels, { inplace: true })
    }

    
    //__________________________FILLNA_________
    if(dataPresent&&config.fillNa){
      let values = Object.values(config.fillNa)
      let columns = Object.keys(config.fillNa)
      
      new_df.fillNa(values, {
        columns:columns,
        inplace: true
      })
    }
    
    
    let tableData = dataPresent ? dfd.toJSON(new_df, {format: "column"}) :[]
    
    
    //_______Rounding Specific Columns________________________
    if(dataPresent&&config.round){
      
      const roundNumber = (x,decimalPlaces) => {
        const factor = 10 ** decimalPlaces;
        if(parseFloat(x)){
          return Math.round(parseFloat(x)*factor)/factor
        }else{
          return(x)
        }
      }
      tableData.map((tr)=>{
        Object.entries(tr).map(([col,data])=>{
          if(config.round&&Object.keys(config.round).includes(col)){
            tr[col] = roundNumber(data,config.round[col])
          }
          
        })
      })
    }
    // ______________SORT_DATA_BY_Columns______
    if(dataPresent&&config.sortBy){

      const handleSort = ()=>{
        let sortConfig = config.sortBy
        return  tableData.sort((a,b) => {
          for(const key of Object.keys(sortConfig)){
            const sortOrder = sortConfig[key] === 'descending'? -1 : 1;;
            const comparison = (a[key] > b[key]) ? 1 : ((a[key] < b[key]) ? -1 : 0);
            if (comparison !== 0) {
              return comparison * sortOrder;
            }
          }
          
          return 0;
        });
        
      }
      tableData = handleSort()
      // console.log('SORTED DATA: ',tableData)
    }
    //_______________Replace specific values for specific attributes
    if(dataPresent&&config.replacers){
     
      tableData = tableData.map(feature => {
        Object.entries(feature).forEach(([attribute,value])=>{
          config.replacers.forEach(replacer =>{
            
            if(attribute === replacer.attribute && value==replacer.value){
              feature[attribute] = replacer.replacerValue
            }
          })
      })
      return feature
    })

    }

  

    // console.log('TABLE DATA: ',tableData)
    const tableHeaders = dataPresent ? Object.keys(tableData[0]) :[]
    const tableHeaderString = dataPresent ? tableHeaders.map((header,index)=>{
      if(index>0){
        return `<th><h6>${header}</h6></th>`
      }else{
        return `<th><h6>${' '}</h6></th>`
      }
    }).join('') : "No Data Present"
    
    const tableRows = dataPresent ? tableData.map((rowData)=>{
    return `<tr>  
            ${
              tableHeaders.map((header,index) => {
              if(index==0){
                return `<td class="table-row-header"><h6>${rowData[header]}</h6></td>`
              }
              else{
                return `<td class="table-row-data">${rowData[header]}</td>`
              }
            }).join('')
          } 
        </tr>
      `
      }
    ).join('') : ""
  

    return  `<div class="govuk-accordion__section ${config.expanded&&'govuk-accordion__section--expanded'}">
        <div class="govuk-accordion__section-header">
          <h5 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button">
            ${config.tableTitle}
            </span>
          </h5>
        </div>
        <div id="default-example-content-2" class="govuk-accordion__section-content">
          <div class="table-container">
            <div class="table-wrapper">
              <table>
                <tr>
                  ${tableHeaderString}
                </tr>
                ${tableRows}
              </table>
            </div>
            
          </div>
        </div>
      </div>`
  }
  createTables(){
    console.log('Creating Tables...')

    const tableDiv =  document.getElementById('tableview')
    tableDiv&&tableDiv.remove()

    if(this.mapConfig.statistics.statisticsTables){

      const tables = this.mapConfig.statistics.statisticsTables.map(tableConfig => this.createTable(tableConfig)).join("")
      
      let tableMarkup = `
      <div class="tableview-container"><h3>${this.table.sectionHeader?this.table.sectionHeader:'Tables'}</h3>
      <div class="govuk-accordion lbh-accordion" data-module="govuk-accordion" data-attribute="value">
      ${tables}
      </div>
      `
      this.mapClass.addMarkupToMapAfter(tableMarkup, "tableview", "tableview");
    }
    

  }
  createMarkup() {
    const listDiv =  document.getElementById('listview')
    listDiv&&listDiv.remove()


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
        for (const feature of layerData.data.features){
          html += `<div id="default-example-content-1" class="govuk-accordion__section-content">
          <h6>${feature.properties[layerData.configLayer.listView.title]}</h6>`;
          if (layerData.configLayer.listView.fields) {
            html += `<p class="lbh-body-s">`;
            for (const field of layerData.configLayer.listView.fields) {
              if (feature.properties[field] !== "") {
                if (
                  feature.properties[field.name] !== "" &&
                  feature.properties[field.name] !== null
                ) {
                  if (field.label != "") {
                    html += `${field.label}</span>: ${feature.properties[field.name]}<br>`;
                  } else {
                    html += `${feature.properties[field.name]}<br>`;
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
    

  }
 
}

export default Table;

