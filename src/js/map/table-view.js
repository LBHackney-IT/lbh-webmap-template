// import DataLayers from "./data-layers";
// import { MARKER_COLORS } from "./consts";
// import { header } from "express-validator/check";

class Table {
  constructor(map, layersData) {
    this.mapClass = map;
    // this.mapConfig = map.mapConfig;
    this.mapConfig = {
      "title": "Hackney EV Network Plan",
      "about": "This map shows the location of all the active and potential electric vehicle charging points in Hackney. Click on a point on the map to see the number of sockets and number of EV charging bays proposed at that location.",
      "aboutTitle": "About the map",
      "showLegend": true,
      "showLayersOnLoad": true,
      "baseStyle": "OSoutdoor",
      "showMask": true,
      "showBoundary": true,
      "showResetZoomButton": true,
      "showFullScreenButton": true,
      "filtersSection":{
      "filtersSectionTitle": "Restrict view to a specific status or location",
      "filtersSectionState":"open",
      "filters": {
        "status":{
          "heading": "Status (all shown by default)",
          "options": [
            "Active",
            "Potential"
          ]
          },
          "estate_or_street":{
            "heading": "Location (all shown by default)",
            "options": [
              "Estate",
              "Streetside"
            ]
            }
        }
      },
      "list":{
        "sectionHeader": "",
        "showIcons": false,
        "accordionStatus": "allExpanded"
      }, 
      "layers": [
        {
          "title": "Lamp columns / Slow chargers",
          "geoserverLayerName": "transport:electrical_vehicle_charger_all",
          "cqlFilter":"type LIKE 'Lamp column' AND status IN ('Active', 'Potential')",
          "countLabel": "locations",
          "pointStyle": {
            "markerType": "CircleMarker",
            "circleMarkerRadius": 1,
            "markerColor": "darkblue",
            "icon": "fas fa-battery-bolt"
    
          },
          "linePolygonStyle": {
            "styleName": "default",
            "stroke": true,
            "strokeColor": "#0e67a3",
            "opacity": 1,
            "fillColor": "#0e67a3",
            "fillOpacity": 1,
            "layerLineDash": "",
            "weight": 3
          },
          "popup": {
            "fields": [
              {
                "label": "Status",
                "name": "status"
              },
              {
                "label": "Organisation",
                "name": "organisation"
              },
              {
                "label": "Power rating (kW)",
                "name": "power_rating"
              },
              {
                "label": "Number of bays",
                "name": "no_bays"
              },
              { 
                "label": "Number of sockets",
                "name": "no_charging_points"
              }
            ]
          }
        },
        {
          "title": "Free standing Fast",
          "geoserverLayerName": "transport:electrical_vehicle_charger_all",
          "cqlFilter":"type LIKE 'Free standing Fast' AND status IN ('Active', 'Potential')",
          "countLabel": "locations",
          "pointStyle": {
            "markerType": "CircleMarker",
            "circleMarkerRadius": 1,
            "icon": "fas fa-battery-bolt",
            "markerColor": "darkgreen"
          },
          "linePolygonStyle": {
            "styleName": "default",
            "stroke": true,
            "strokeColor": "#70ad26",
            "opacity": 1,
            "fillColor": "#70ad26",
            "fillOpacity": 1,
            "layerLineDash": "",
            "weight": 3
          },
          "popup": {
            "fields": [
              {
                "label": "Status",
                "name": "status"
              },
              {
                "label": "Organisation",
                "name": "organisation"
              },
              {
                "label": "Power rating (kW)",
                "name": "power_rating"
              },
              {
                "label": "Number of bays",
                "name": "no_bays"
              },
              { 
                "label": "Number of sockets",
                "name": "no_charging_points"
              }
            ]
          }
        },    
        {
          "title": "Free standing Rapid",
          "geoserverLayerName": "transport:electrical_vehicle_charger_all",
          "cqlFilter":"type LIKE 'Free standing Rapid' AND status IN ('Active', 'Potential')",
          "countLabel": "locations",
          "pointStyle": {
            "markerType": "CircleMarker",
            "circleMarkerRadius": 1,
            "icon": "fas fa-battery-bolt",
            "markerColor": "darkpurple"
          },
          "linePolygonStyle": {
            "styleName": "default",
            "stroke": true,
            "strokeColor": "#a36ec5",
            "opacity": 1,
            "fillColor": "#a36ec5",
            "fillOpacity": 1,
            "layerLineDash": "",
            "weight": 2
          },
          "popup": {
            "fields": [
              {
                "label": "Status",
                "name": "status"
              },
              {
                "label": "Organisation",
                "name": "organisation"
              },
              {
                "label": "Power rating (kW)",
                "name": "power_rating"
              },
              {
                "label": "Number of bays",
                "name": "no_bays"
              },
              { 
                "label": "Number of sockets",
                "name": "no_charging_points"
              }
            ]
          }
        },
        {
          "title": "Free standing Smart Fast ",
          "geoserverLayerName": "transport:electrical_vehicle_charger_all",
          "cqlFilter":"type LIKE 'Free standing smart fast' AND status IN ('Active', 'Potential')",
          "countLabel": "locations",
          "pointStyle": {
            "markerType": "CircleMarker",
            "circleMarkerRadius": 1,
            "icon": "fas fa-battery-bolt",
            "markerColor": "orange"
          },
          "linePolygonStyle": {
            "styleName": "default",
            "stroke": true,
            "strokeColor": "#F69730",
            "opacity": 1,
            "fillColor": "#F69730",
            "fillOpacity": 1,
            "layerLineDash": "",
            "weight": 3
          },
          "popup": {
            "fields": [
              {
                "label": "Status",
                "name": "status"
              },
              {
                "label": "Organisation",
                "name": "organisation"
              },
              {
                "label": "Power rating (kW)",
                "name": "power_rating"
              },{
                "label": "Number of bays",
                "name": "no_bays"
              },
              { 
                "label": "Number of sockets",
                "name": "no_charging_points"
              }
            ]
          }
        },
        {
        "title": "Wards",
          "geoserverLayerName": "boundaries:hackney_ward",
          "highlightFeatureOnHoverOrSelect": true,
          "loadToBack": true,
          "excludeFromLegend": true,
          "excludeFromFilter": true,
          "pointStyle": {
            "markerType": "AwesomeMarker",
            "markerColor": "marineblue",
            "icon": "far fa-square"
          },
          "linePolygonStyle": {
            "styleName": "default",
            "stroke": true,
            "strokeColor": "#01386a",
            "opacity": 1,
            "fillColor": "#01386a",
            "fillOpacity": 0,
            "layerLineDash": "",
            "weight": 5
          },
          "tooltip": {
            "direction": "top",
            "offset": [0,0],
            "title": "name",
            "fields": []
          }
        },
        {
          "title": "TFL Owned Roads",
          "geoserverLayerName": "transport:hackney_tfl_owned_road_line",
          "countLabel": "roads",
          "excludeFromFilter": true,
          "pointStyle": {
            "markerType": "AwesomeMarker",
            "icon": "fas fa-horizontal-rule",
            "markerColor": "barelybrown"
          },
          "linePolygonStyle": {
            "styleName": "default",
            "stroke": true,
            "strokeColor": "#DD6055",
            "opacity": 0.8,
            "fillColor": "#DD6055",
            "fillOpacity": 0.8,
            "layerLineDash": "",
            "weight": 3
          },
          "popup": {
            "fields": [
              {
                "label": "Road name",
                "name": "road_name"
              }
            ],
            "afterFields": "The council cannot install EV chargers on TFL-owned roads."
          }
        },
        {
          "title": "Private Roads",
          "geoserverLayerName": "transport:private_road",
          "countLabel": "roads",
          "excludeFromFilter": true,
          "pointStyle": {
            "markerType": "AwesomeMarker",
            "icon": "fas fa-horizontal-rule",
            "markerColor": "philippinegray"
          },
          "linePolygonStyle": {
            "styleName": "default",
            "stroke": true,
            "strokeColor": "#929291",
            "opacity": 0.8,
            "fillColor": "#929291",
            "fillOpacity": 0.8,
            "layerLineDash": "",
            "weight": 3
          },
          "popup": {
            "fields": [
              {
                "label": "Road name",
                "name": "fullstreet"
              }
            ],
            "afterFields": "The council cannot install EV chargers on private roads."
          }
        },
        {
          "title": "Charge points count",
          "geoserverLayerName": "transport:ev_chargers_statistics",
          "excludeFromFilter": true,
          "excludeFromLegend": true,
          "pointStyle": {
            "markerType": "AwesomeMarker",
            "icon": "fas fa-horizontal-rule",
            "markerColor": "barelybrown"
          },
          "listView": {
            "title": "charger_type",
            "fields": [
              {
                "label": "",
                "name": "statistics_table"
              }
            ]
          }
        }
      ],
      "statistics":{
        "sectionHeader": "A few statistics...",
        "accordionStatus": "allExpanded",
        "statisticsTables": [
          {
            "tableTitle": "Number of charging locations by type in the borough with their average number of sockets",
            "downloadable":false,
            "scope": ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers
            "groupByLayer": true,
            "functions": {
              "count": "",
              "average": ["number_of_sockets"],
              "median": ["number_of_sockets"]
            }
          },
          {
            "tableTitle": "Total number of charging points in the borough",
            "downloadable":false,
            "scope":  ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers
            "groupByLayer": false,
            "functions": {
              "sum": ["number_of_sockets"]
            }
          },
          {
            "tableTitle": "Number of charging locations by type and by ward",
            "downloadable":false,
            "scope": ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers 
            "groupByLayer": true,
            "groupByGeography": {
              "geographyLayer": "boundaries:hackney_ward"
            },
            "functions": {
              "count": ""
            }
          },
          {
            "tableTitle": "Number of charving locations by provider and by ward",
            "downloadable":false,
            "scope": ["Lamp columns / Slow chargers","Free standing Fast","Free standing Rapid","Free standing Smart Fast"],//all EV layers
            "groupByLayer": false,
            "groupByGeography": {
              "geographyLayer": "boundaries:hackney_ward"
            },
            "groupByAttribute": {
              "attribute": "provider",
              "values": ["Zest", "Vivacity", "Providr 3"]
            },
            "functions": {
              "count": ""
            }
          },
          {
            "tableTitle": "Number of rapid bays by estate",
            "downloadable":false,
            "scope": ["Free standing Rapid"],//only 1 layer on map
            "groupByLayer": false,
            "groupByGeography": {
              "geographyLayer": "housing:lbh_estate"
            },
            "functions": {
              "sum": ["no_bays"]
            }
          }
        ]
      }
    }
    this.map = map.map
    this.layersData = layersData;
    this.container = map.container;
    this.table = null;
    this.accordionExpandedClass = null;
    this.tableLayers = ['Free standing Fast','Free standing Rapid','Free standing Smart Fast ','Lamp columns / Slow chargers']//@TRACK  put this into a config
  }

  init() {
    this.table = this.mapConfig.statistics;
    this.layersData.sort((a, b) => (a.layer.options.sortOrder > b.layer.options.sortOrder) ? 1 : -1);
    this.layersData.map((layerObj) =>{layerObj.layer.isVisible =true;return null})

    
    if (this.table.accordionStatus == 'allExpanded'){
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
    const df = new dfd.DataFrame(combinedData)
    // df.print()
    const grp = df.groupby(['status']) 
    // grp.agg({id:['count']}).print()
    grp.col(["id"]).count().print()
    window.LBHFrontend.initAll();
  }

  
 

 
}

export default Table;


//________________Functions_______________
// createTables      || Main 
// createCountTable || MarkUp
// createGroupedTables || MarkUp

// groupLayersBy    || function to invoke the groupby methods
// formart grouped  || dataframe

// groupByGeography || function to use turf.js to group by geometries / wards
