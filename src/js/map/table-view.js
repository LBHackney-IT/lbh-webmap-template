// import DataLayers from "./data-layers";
// import { MARKER_COLORS } from "./consts";
import SpatialEnrichment from "./spatial-enrichment"

class Table {
  constructor(map, layersData) {
    this.mapClass = map;
    this.mapConfig = map.mapConfig;
    // this.mapConfig = {
    //   "title": "Hackney EV Network Plan",
    //   "about": "This map shows the location of all the active and potential electric vehicle charging points in Hackney. Click on a point on the map to see the number of sockets and number of EV charging bays proposed at that location.",
    //   "aboutTitle": "About the map",
    //   "showLegend": true,
    //   "showLayersOnLoad": true,
    //   "baseStyle": "OSoutdoor",
    //   "showMask": true,
    //   "showBoundary": true,
    //   "showResetZoomButton": true,
    //   "showFullScreenButton": true,
    //   "filtersSection":{
    //   "filtersSectionTitle": "Restrict view to a specific status or location",
    //   "filtersSectionState":"open",
    //   "filters": {
    //     "status":{
    //       "heading": "Status (all shown by default)",
    //       "options": [
    //         "Active",
    //         "Potential"
    //       ]
    //       },
    //       "estate_or_street":{
    //         "heading": "Location (all shown by default)",
    //         "options": [
    //           "Estate",
    //           "Streetside"
    //         ]
    //         }
    //     }
    //   },
    //   "list":{
    //     "sectionHeader": "",
    //     "showIcons": false,
    //     "accordionStatus": "allExpanded"
    //   }, 
    //   "layers": [
    //     {
    //       "title": "Lamp columns / Slow chargers",
    //       "geoserverLayerName": "transport:electrical_vehicle_charger_all",
    //       "cqlFilter":"type LIKE 'Lamp column' AND status IN ('Active', 'Potential')",
    //       "countLabel": "locations",
    //       "spatialEnrichments": [
    //         {
    //           "geographyLayer": "housing:lbh_estate&cql_filter=estate_name NOT LIKE 'BROADWAY ESTATE'",
    //           "sourceAttribute": "estate_name",
    //           "targetAttribute": "estate_name"
    //         }
    //       ],
    //       "pointStyle": {
    //         "markerType": "CircleMarker",
    //         "circleMarkerRadius": 1,
    //         "markerColor": "darkblue",
    //         "icon": "fas fa-battery-bolt"
    
    //       },
    //       "linePolygonStyle": {
    //         "styleName": "default",
    //         "stroke": true,
    //         "strokeColor": "#0e67a3",
    //         "opacity": 1,
    //         "fillColor": "#0e67a3",
    //         "fillOpacity": 1,
    //         "layerLineDash": "",
    //         "weight": 3
    //       },
    //       "popup": {
    //         "fields": [
    //           {
    //             "label": "Status",
    //             "name": "status"
    //           },
    //           {
    //             "label": "Organisation",
    //             "name": "organisation"
    //           },
    //           {
    //             "label": "Power rating (kW)",
    //             "name": "power_rating"
    //           },
    //           {
    //             "label": "Number of bays",
    //             "name": "no_bays"
    //           },
    //           { 
    //             "label": "Number of sockets",
    //             "name": "no_charging_points"
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "title": "Free standing Fast",
    //       "geoserverLayerName": "transport:electrical_vehicle_charger_all",
    //       "cqlFilter":"type LIKE 'Free standing Fast' AND status IN ('Active', 'Potential')",
    //       "countLabel": "locations",
    //       "spatialEnrichments": [
    //         {
    //           "geographyLayer": "housing:lbh_estate&cql_filter=estate_name NOT LIKE 'BROADWAY ESTATE'",
    //           "sourceAttribute": "estate_name",
    //           "targetAttribute": "estate_name"
    //         }
    //       ],
    //       "pointStyle": {
    //         "markerType": "CircleMarker",
    //         "circleMarkerRadius": 1,
    //         "icon": "fas fa-battery-bolt",
    //         "markerColor": "darkgreen"
    //       },
    //       "linePolygonStyle": {
    //         "styleName": "default",
    //         "stroke": true,
    //         "strokeColor": "#70ad26",
    //         "opacity": 1,
    //         "fillColor": "#70ad26",
    //         "fillOpacity": 1,
    //         "layerLineDash": "",
    //         "weight": 3
    //       },
    //       "popup": {
    //         "fields": [
    //           {
    //             "label": "Status",
    //             "name": "status"
    //           },
    //           {
    //             "label": "Organisation",
    //             "name": "organisation"
    //           },
    //           {
    //             "label": "Power rating (kW)",
    //             "name": "power_rating"
    //           },
    //           {
    //             "label": "Number of bays",
    //             "name": "no_bays"
    //           },
    //           { 
    //             "label": "Number of sockets",
    //             "name": "no_charging_points"
    //           }
    //         ]
    //       }
    //     },    
    //     {
    //       "title": "Free standing Rapid",
    //       "geoserverLayerName": "transport:electrical_vehicle_charger_all",
    //       "cqlFilter":"type LIKE 'Free standing Rapid' AND status IN ('Active', 'Potential')",
    //       "countLabel": "locations",
    //       "spatialEnrichments": [
    //         {
    //           "geographyLayer": "housing:lbh_estate&cql_filter=estate_name NOT LIKE 'BROADWAY ESTATE'",
    //           "sourceAttribute": "estate_name",
    //           "targetAttribute": "estate_name"
    //         }
    //       ],
    //       "pointStyle": {
    //         "markerType": "CircleMarker",
    //         "circleMarkerRadius": 1,
    //         "icon": "fas fa-battery-bolt",
    //         "markerColor": "darkpurple"
    //       },
    //       "linePolygonStyle": {
    //         "styleName": "default",
    //         "stroke": true,
    //         "strokeColor": "#a36ec5",
    //         "opacity": 1,
    //         "fillColor": "#a36ec5",
    //         "fillOpacity": 1,
    //         "layerLineDash": "",
    //         "weight": 2
    //       },
    //       "popup": {
    //         "fields": [
    //           {
    //             "label": "Status",
    //             "name": "status"
    //           },
    //           {
    //             "label": "Organisation",
    //             "name": "organisation"
    //           },
    //           {
    //             "label": "Power rating (kW)",
    //             "name": "power_rating"
    //           },
    //           {
    //             "label": "Number of bays",
    //             "name": "no_bays"
    //           },
    //           { 
    //             "label": "Number of sockets",
    //             "name": "no_charging_points"
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "title": "Free standing Smart Fast ",
    //       "geoserverLayerName": "transport:electrical_vehicle_charger_all",
    //       "cqlFilter":"type LIKE 'Free standing smart fast' AND status IN ('Active', 'Potential')",
    //       "countLabel": "locations",
    //       "spatialEnrichments": [
    //         {
    //           "geographyLayer": "housing:lbh_estate&cql_filter=estate_name NOT LIKE 'BROADWAY ESTATE'",
    //           "sourceAttribute": "estate_name",
    //           "targetAttribute": "estate_name"
    //         }
    //       ],
    //       "pointStyle": {
    //         "markerType": "CircleMarker",
    //         "circleMarkerRadius": 1,
    //         "icon": "fas fa-battery-bolt",
    //         "markerColor": "orange"
    //       },
    //       "linePolygonStyle": {
    //         "styleName": "default",
    //         "stroke": true,
    //         "strokeColor": "#F69730",
    //         "opacity": 1,
    //         "fillColor": "#F69730",
    //         "fillOpacity": 1,
    //         "layerLineDash": "",
    //         "weight": 3
    //       },
    //       "popup": {
    //         "fields": [
    //           {
    //             "label": "Status",
    //             "name": "status"
    //           },
    //           {
    //             "label": "Organisation",
    //             "name": "organisation"
    //           },
    //           {
    //             "label": "Power rating (kW)",
    //             "name": "power_rating"
    //           },{
    //             "label": "Number of bays",
    //             "name": "no_bays"
    //           },
    //           { 
    //             "label": "Number of sockets",
    //             "name": "no_charging_points"
    //           }
    //         ]
    //       }
    //     },
    //     {
    //     "title": "Wards",
    //       "geoserverLayerName": "boundaries:hackney_ward",
    //       "highlightFeatureOnHoverOrSelect": true,
    //       "loadToBack": true,
    //       "excludeFromLegend": true,
    //       "excludeFromFilter": true,
    //       "pointStyle": {
    //         "markerType": "AwesomeMarker",
    //         "markerColor": "marineblue",
    //         "icon": "far fa-square"
    //       },
    //       "linePolygonStyle": {
    //         "styleName": "default",
    //         "stroke": true,
    //         "strokeColor": "#01386a",
    //         "opacity": 1,
    //         "fillColor": "#01386a",
    //         "fillOpacity": 0,
    //         "layerLineDash": "",
    //         "weight": 5
    //       },
    //       "tooltip": {
    //         "direction": "top",
    //         "offset": [0,0],
    //         "title": "name",
    //         "fields": []
    //       }
    //     },
    //     {
    //       "title": "TFL Owned Roads",
    //       "geoserverLayerName": "transport:hackney_tfl_owned_road_line",
    //       "countLabel": "roads",
    //       "excludeFromFilter": true,
    //       "pointStyle": {
    //         "markerType": "AwesomeMarker",
    //         "icon": "fas fa-horizontal-rule",
    //         "markerColor": "barelybrown"
    //       },
    //       "linePolygonStyle": {
    //         "styleName": "default",
    //         "stroke": true,
    //         "strokeColor": "#DD6055",
    //         "opacity": 0.8,
    //         "fillColor": "#DD6055",
    //         "fillOpacity": 0.8,
    //         "layerLineDash": "",
    //         "weight": 3
    //       },
    //       "popup": {
    //         "fields": [
    //           {
    //             "label": "Road name",
    //             "name": "road_name"
    //           }
    //         ],
    //         "afterFields": "The council cannot install EV chargers on TFL-owned roads."
    //       }
    //     },
    //     {
    //       "title": "Private Roads",
    //       "geoserverLayerName": "transport:private_road",
    //       "countLabel": "roads",
    //       "excludeFromFilter": true,
    //       "pointStyle": {
    //         "markerType": "AwesomeMarker",
    //         "icon": "fas fa-horizontal-rule",
    //         "markerColor": "philippinegray"
    //       },
    //       "linePolygonStyle": {
    //         "styleName": "default",
    //         "stroke": true,
    //         "strokeColor": "#929291",
    //         "opacity": 0.8,
    //         "fillColor": "#929291",
    //         "fillOpacity": 0.8,
    //         "layerLineDash": "",
    //         "weight": 3
    //       },
    //       "popup": {
    //         "fields": [
    //           {
    //             "label": "Road name",
    //             "name": "fullstreet"
    //           }
    //         ],
    //         "afterFields": "The council cannot install EV chargers on private roads."
    //       }
    //     },
    //     {
    //       "title": "Charge points count",
    //       "geoserverLayerName": "transport:ev_chargers_statistics",
    //       "excludeFromFilter": true,
    //       "excludeFromLegend": true,
    //       "pointStyle": {
    //         "markerType": "AwesomeMarker",
    //         "icon": "fas fa-horizontal-rule",
    //         "markerColor": "barelybrown"
    //       },
    //       "listView": {
    //         "title": "charger_type",
    //         "fields": [
    //           {
    //             "label": "",
    //             "name": "statistics_table"
    //           }
    //         ]
    //       }
    //     }
    //   ],
    //   "statistics":{
    //     "sectionHeader": "A few statistics...",
    //     "accordionStatus": false,
    //     "statisticsTables": [
    //       {
    //         "tableTitle": "Total number of charging points in the borough",
    //         "downloadable":false,
    //         "scope":  ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers
    //         "groupBy": false,
    //         "dtypes":{"int32":["no_charging_points"]},
    //         "functions": {
    //           "sum": ["no_charging_points"],
    //           "count": ["id"]
    //         },
    //         "labels":{
    //           "value":' '
    //         },
    //         "replacers":[
    //           // { "attribute": "Number of Rapid Bays", "value":new NaN,"replacerValue":0},
    //           { "attribute": "column", "value":"no_charging_points_sum","replacerValue":"Number of Charging points"},
    //           { "attribute": "column", "value":"id_count","replacerValue":"Number of Charging Locations"},
    //         ],
    //       },
    //       {
    //         "tableTitle": "Number of charging locations by type in the borough with their average number of sockets",
    //         "downloadable":false,
    //         "scope": ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers
    //         "groupBy": ["type"],
    //         "dtypes":{"int32":["no_charging_points"]},
    //         "aggregations": {
    //           "no_charging_points":{
    //             "functions":["count","mean","median"],
    //         }},
    //         "labels":{
    //               "no_charging_points_count":'Number of Charge Locations',
    //               "no_charging_points_mean":'Average Number of Sockets',
    //               "no_charging_points_median":'Median number of Sockets'
    //             },
    //         "sortBy":{
    //           "Number of Charge Locations":"descending"
    //         },
    //         "round":{"Average Number of Sockets":2}
    //       },
    //       {
    //         "tableTitle": "Number of charging locations by provider and by ward",
    //         "downloadable":false,
    //         "scope": ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers
    //         "groupBy":["ward_name","organisation"],
    //         "dtypes":{"int32":["no_charging_points"]},
    //         "aggregations": {
    //           "no_charging_points":{
    //             "functions":["count"],
                
                
    //           }
    //         },
    //         "labels":{
    //           "no_charging_points_count":'Number of Charge Locations',
    //           "organisation":'Provider',
    //         },
    //         "sortBy":{"ward_name":'ascending',"Number of Charge Locations":'descending'},
    //         "round":null
    //       },
    //       {
    //         "tableTitle": "Number of charging locations by type and by ward",
    //         "downloadable":false,
    //         "scope": ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers 
    //         "groupBy":["ward_name","type"],
    //         "dtypes":{"int32":["no_charging_points"]},
    //         "aggregations": {
    //           "no_charging_points":{
    //               "functions":["count"],
    //               },
    //           },
    //         "labels":{
    //                 "no_charging_points_count":'Number of Charge Locations',
    //                 "type":'Charger Type'
    //               },
    //         "sortBy":{
    //           "ward_name":"ascending",
    //           "Number of Charge Locations":"descending",
    //         },
    //         "round":null
    //       },
    //       {
    //         "tableTitle": "Number of rapid bays by estate",
    //         "downloadable":false,
    //         "expanded":true,
    //         "scope": ["Free standing Rapid"],//only 1 layer on map
    //         "filters":[
    //           { "attribute": "type", "operator": "===", "value": "Free standing Rapid"},

    //         ],
    //         "groupBy": ["estate_name"],
    //         "dtypes":{"int32":["no_bays"]},
    //         "aggregations": {
    //           "no_bays":{
    //             "functions":["sum"],
    //           }
    //         },
    //         "labels":{
    //           "no_bays_sum":'Number of Rapid Bays',
    //         },
    //         "sortBy":{"Number of Rapid Bays":'descending'},
    //         "round":null,
    //         "replacers":[
    //           // { "attribute": "Number of Rapid Bays", "value":new NaN,"replacerValue":0},
    //           { "attribute": "estate_name", "value":"Unspecified","replacerValue":"UNKNOWN ESTATE"},
    //         ],
    //         "fillNa":{"Number of Rapid Bays":0}
            
    //       }
    //     ]
    //   }
    // }
    this.map = map.map
    this.layersData = layersData;
    this.container = map.container;
    this.table = null;
    this.list = null;
    this.accordionExpandedClass = null;
    // this.tableLayers = ['Free standing Fast','Free standing Rapid','Free standing Smart Fast ','Lamp columns / Slow chargers']//@TRACK  put this into a config
    this.tableLayers = map.mapConfig.statistics.statisticsTables.reduce(
      (accumulator, currentValue) => {
        const scope = currentValue.scope
        scope.map(layerName => accumulator.add(layerName))
        return accumulator
        
      },
      new Set(),
    );

  }

  init() {
    console.log("Map Config: ",this.mapConfig)
    console.log("TABLE LAYERS : ",this.tableLayers)
    this.list = this.mapConfig.list;
    this.table = this.mapConfig.statistics;
    this.layersData.sort((a, b) => (a.layer.options.sortOrder > b.layer.options.sortOrder) ? 1 : -1);
    this.layersData.map((layerObj) =>{layerObj.layer.isVisible =true;return null})
    //______________________ENRICH LAYERS
    this.spatialEnrichment = new SpatialEnrichment(this.mapClass);
    this.spatialEnrichment.enrichLayers(this.layersData)


    if (this.list.accordionStatus == 'allExpanded'){
      this.accordionExpandedClass = 'govuk-accordion__section--expanded';
    }
    if (this.table.accordionStatus == 'allExpanded'){
      this.accordionExpandedClass = 'govuk-accordion__section--expanded';
    }
    //@TODO add 'firstExpanded' option
    else{
      this.accordionExpandedClass = '';
    }

    this.addlayerEventListeners(this.layersData,this.createTables.bind(this),this.createMarkup.bind(this))
    this.createMarkup();
    this.createTables();
  }
  
  addlayerEventListeners(dataLayers,createTables,createListViews){

    console.log(dataLayers)
    dataLayers.map((layerObj) => {
      if(Array.from(this.tableLayers).includes(layerObj.configLayer.title)){

        // get layer
        let layer = layerObj.layer
        // add visibility state
        // layer.isVisible = true
        // assign event listeners to layers
        layer.on('add',()=>{
          layer.isVisible = true
          createListViews()
          createTables()
        })
        
        layer.on('remove',()=>{
          layer.isVisible = false
          createListViews()
          createTables()
        })
      }
      return null
    })

  }

  // createTable(combinedData,config){
  createTable(config){
    //Prep table content 

    let totalRows = 0
    let combinedData = []
     
    // get rows where layer is visible on map
    for (const layerObj of this.layersData){
      if(config.scope.includes(layerObj.configLayer.title)&&layerObj.layer.isVisible){
        console.log(layerObj.configLayer.title)
        totalRows += layerObj.data.features.length
        for (const feature of layerObj.data.features){
          combinedData = [...combinedData,...[feature.properties]]
        }
        
      }
    }

    // const ensureSameAttributes = (data)=>{
    //   //Step 1 Identify all unique attributes
    //   const allAttributes = new Set();
    //   data.forEach(feature => {
    //     Object.keys(feature).forEach(attribute =>{
    //       allAttributes.add(attribute)
    //     })
        
    //   });

    //   //step 2
    //   data.forEach(feature =>{
    //     Array.from(allAttributes).forEach(attribute =>{
    //       if(!(attribute in feature)){
    //         feature[attribute] = 'Unspecified'
    //       }
    //     })
    //   })

    // }

    // ensureSameAttributes(combinedData)

    let filteredData = combinedData
    

    //______________FILTER_DF______________
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
    console.log('FILTERED DATA 1: ',filteredData)
    console.log('DATA PRESENT ? ',dataPresent)
    //__________________________________________________________________________________________

    const df = dataPresent ? new dfd.DataFrame(filteredData):null

    // console.log(df.columns)
    console.log(config.tableTitle)
    console.log('FILTERED DATA 2: ',filteredData)

    
    
    // configure data types for aggregation functions to run correctly
    if(dataPresent&&config.dtypes){
      for (const [dtype,columns] of Object.entries(config.dtypes)){
        columns.map(col => {
          df.asType(col,dtype,{inplace:true})
          return null
        })
      }
    }
    
    let new_df =  df
    //_____________________GROUP DATAFRAME and AGGREGATE________________
    if(dataPresent&&config.groupBy){

      new_df = df.groupby(config.groupBy).agg(
        Object.fromEntries(
          Object.entries(config.aggregations).map(([key,value])=> [key,value.functions])
          )
          )
    }
    // console.log(dfd.toJSON(new_df, {format: "row"}))

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
              results.push({column:`${col}_${key}`,value:new_df[col].maximum()})
              break
            case('min'):
              results.push({column:`${col}_${key}`,value:new_df[col].minimum()})
              break
            case('var'):
              results.push({column:`${col}_${key}`,value:new_df[col].var()})
              break
            case('std'):
              results.push({column:`${col}_${key}`,value:new_df[col].std()})
              break
            default:
              console.log('No aggregation provided')

          }
          return null}
          )
      }
      if(results.length >0){
        new_df = new dfd.DataFrame(results)
        console.log(results)

      }else{
        return ''
      }
      
    }

    // ________Rename columns using config labels_____________
    if(dataPresent&&config.labels){ // &&config.groupBy ??
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
      console.log('SORTED DATA: ',tableData)
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

  

    console.log('TABLE DATA: ',tableData)
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
        <div id="default-example-content-1" class="govuk-accordion__section-content">
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
    console.log('Creating table...')

    const tableDiv =  document.getElementById('tableview')
    tableDiv&&tableDiv.remove()

    // //Prep table content 

    // let totalRows = 0
    // let combinedData = []
     
    // // get rows where layer is visible on map
    // for (const layerObj of this.layersData){
    //   if(this.tableLayers.includes(layerObj.configLayer.title)&&layerObj.layer.isVisible){
    //     console.log(layerObj.configLayer.title)
    //     totalRows += layerObj.data.features.length
    //     for (const feature of layerObj.data.features){
    //       combinedData = [...combinedData,...[feature.properties]]
    //     }
        
    //   }
    // }

    // const ensureSameAttributes = (data)=>{
    //   //Step 1 Identify all unique attributes
    //   const allAttributes = new Set();
    //   data.forEach(feature => {
    //     Object.keys(feature).forEach(attribute =>{
    //       allAttributes.add(attribute)
    //     })
        
    //   });

    //   //step 2
    //   data.forEach(feature =>{
    //     Array.from(allAttributes).forEach(attribute =>{
    //       if(!(attribute in feature)){
    //         feature[attribute] = 'Unspecified'
    //       }
    //     })
    //   })

    // }

    // ensureSameAttributes(combinedData)
    

    
    // const tables = this.mapConfig.statistics.statisticsTables.map(tableConfig => this.createTable(combinedData,tableConfig)).join("")
    const tables = this.mapConfig.statistics.statisticsTables.map(tableConfig => this.createTable(tableConfig)).join("")
    
    // <div class="tableview-container">
    let tableMarkup = `
      <h4>TABLES</h4>
      <div class="govuk-accordion lbh-accordion" data-module="govuk-accordion" data-attribute="value">
        ${tables}
      </div>
      `
    // </div>

    // <div class="table-footer">
    //   <span class="table-row-count">Showing&nbsp;${totalRows}&nbsp;row(s)</span>
    //   <button id="table-download-btn" class="lbh-button download-btn">Download</button>
    // </div>
   
    //activate component from lbh-frontend
    this.mapClass.addMarkupToMapAfter(tableMarkup, "tableview", "tableview");
    window.LBHFrontend.initAll();

  }
  createMarkup() {
    const tableDiv =  document.getElementById('listview')
    tableDiv&&tableDiv.remove()


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
    //activate component from lbh-frontend
    // window.LBHFrontend.initAll();

  }
 
}

export default Table;


// let downloadBtn = document.getElementById("table-download-btn")
    // downloadBtn&&downloadBtn.addEventListener('click',()=>{
      
    //   const downloadCSV=(csvString)=>{
    //     const dataBlob = new Blob([csvString],{type:'text/csv'});
    //     const a =document.createElement('a');
    //     a.href = URL.createObjectURL(dataBlob);
    //     a.download='data.csv'

    //     document.body.appendChild(a)
    //     a.click()
    //     setTimeout(()=>{
    //       document.body.removeChild(a)
    //     },100)
      
    //   }
    //   const convertToCSV=(data)=>{
    //     const headers= Object.keys(data[0]);
    //     const csvData = data.map(object => headers.map(header => object[header]).join(','));
    //     csvData.unshift(headers.join(','));
    //     const csvString = csvData.join('\n');
    //     // console.log(csvString)
    //     // return csvString;

    //     downloadCSV(csvString)
    //   }
      
    //   convertToCSV(combinedData)
    // })