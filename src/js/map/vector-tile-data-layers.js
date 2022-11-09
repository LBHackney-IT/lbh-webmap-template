import L, { Point } from "leaflet";
import "leaflet.vectorgrid";
import { pointToLayer } from "./metadata";
import { MARKER_COLORS} from "./consts";
import Personas from "./personas";
import Filters from "./filters";
import Search from "./search";
import addressSearch from "./address-search";
import List from "./list-view";
import DrillDown from "./drill-down";


class VectorTileDataLayers {
  constructor(map) {
    this.mapClass = map;
    this.map = map.map;
    this.container = map.container;
    this.mapConfig = map.mapConfig;
    this.vectorTileOptions = null;
    this.vectorTileUrl = null;
    this.layers = [];
    this.interactive=false;

    // this.controls = map.controls;
    // this.layerCount = map.mapConfig.layers.length;
    // this.loadedLayerCount = 0;
    // this.overlayMaps = {};
    // this.personas = [];
    // this.layerControl = null;
    // this.personasClass = null;
    // this.filters = null;
    // this.layersData = [];
    // this.search = null;
    // this.showAddressSearch = null;
    // this.list = null;
  }

  addVectorTileToolTip(e,configLayer,layer) {
    const toolTipTitle = configLayer.tooltip.title;

    let toolTipString = '';

      if (toolTipTitle) {
        toolTipString = `<h3 class="lbh-heading-h6 popup__title">${e.sourceTarget.options.color[toolTipTitle]}</h3>`;
      } else {
        //If not, we use the name of the layer, unless no title is specified
        toolTipString = `<h3 class="lbh-heading-h6 popup__title">${configLayer.title}</b></h3>`;
      }
    

    //TODO:Review the location of the tooltip. And there is an error in the console. 
    const tooltip = L.tooltip()
      .setContent(toolTipString)
      .setLatLng(e.latlng)
      .addTo(this.map);

      layer.bindTooltip(tooltip, { 
        direction: configLayer.tooltip.direction || 'auto',
        offset: configLayer.tooltip.offset || [0,0]
    }); 
  
  }
    

  addVectorTilePopUp(e,configLayer) {
    // console.log(configLayer);
    // console.log(e.layer.properties)
    const fields = configLayer.popup.fields;
    const afterFields = configLayer.popup.afterFields;

    //Add the PopUp title
    let popUpTitle = '';
    //If the popupTitle is NOT 'notitle'...
    if (configLayer.popup.title !== "notitle") {
      //If there is a popup title, we use it
      if (configLayer.popup.title) {
        popUpTitle = `<h3 class="lbh-heading-h6 popup__title">${e.layer.properties[field.name]}</h3>`;
      } else {
        //If not, we use the name of the layer, unless no title is specified
        popUpTitle = `<h3 class="lbh-heading-h6 popup__title">${configLayer.title}</b></h3>`;
      }
    }

    //Create the popUpString
    let popUpString = `<p class="popup__title">${popUpTitle}</p>`;

    for (const field of fields) {
      if (field.label){
        popUpString += `<p class="popup__text"><span class="popup__label">${field.label}</span>: ${e.layer.properties[field.name]}</p>`;
      } else {
        popUpString += `<p class="popup__text">${e.layer.properties[field.name]}</p>`;
      }
    }

    if (afterFields){
      popUpString += `<p class="popup__text">${afterFields}</p>`;
    }

    if (configLayer.popup) {
      L.popup()
        .setContent(popUpString)
        .setLatLng(e.latlng)
        .openOn(this.map);
    }

  }


  customiseLayer(data, configLayer) {
    const layerName = configLayer.title;
    // const sortOrder =
    //   configLayer.sortOrder && !isNaN(configLayer.sortOrder)
    //     ? configLayer.sortOrder
    //     : configLayer.title;

    // const highlightFeatureOnHover = configLayer.highlightFeatureOnHover;
    // const zoomToFeatureOnClick = configLayer.zoomToFeatureOnClick;
    // const searchable = configLayer.searchable;

    // const pointStyle = configLayer.pointStyle;
    // const markerType = pointStyle && pointStyle.markerType;
    // const markerIcon = pointStyle && pointStyle.icon;
    // const markerIcon2 = pointStyle && pointStyle.icon2;
    // const markerColor = pointStyle && pointStyle.markerColor;
    // const markerColorIcon2 = pointStyle && pointStyle.markerColorIcon2;
    // const cluster = pointStyle && pointStyle.cluster;
    // const disableClusteringAtZoom = pointStyle && pointStyle.disableClusteringAtZoom ? pointStyle && pointStyle.disableClusteringAtZoom : 12;

    //var clusterLayer = null;

    // const layer = new L.GeoJSON(data, {
    //   color: MARKER_COLORS[markerColor],
    //   pointToLayer: (feature, latlng) => {
    //     return this.pointToLayer(
    //       latlng,
    //       configLayer
    //     );
    //   },
    //   onEachFeature: (feature, layer) => {
    //     if (configLayer.popup) {
    //       const popupString = this.createMarkerPopup(
    //         configLayer,
    //         feature,
    //         layerName
    //       );
    //       if (popupString){
    //         const popup = L.popup({ closeButton: true }).setContent(popupString);
    //         layer.bindPopup(popup, { maxWidth: 210 });
    //       }         
    //       if (this.mapConfig.performDrillDown) {
    //         layer.off();
    //       } 
    //     }

    //     if (configLayer.tooltip){
    //       const tooltipString = this.createTooltip(
    //         configLayer,
    //         feature,
    //         layerName
    //       );
    //       if (tooltipString){
    //         const tooltip = L.tooltip().setContent(tooltipString);
    //         layer.bindTooltip(tooltip, { 
    //           direction: configLayer.tooltip.direction || 'auto',
    //           offset: configLayer.tooltip.offset || [0,0]
    //         });
    //       }          
    //     }

    //     if (configLayer.followLinkOnClick && feature.properties[configLayer.followLinkOnClick]){
    //       layer.on("click", (event) => {
    //         //external link opens in a new tab
    //         if (feature.properties[configLayer.followLinkOnClick].startsWith('http')){
    //           window.open(feature.properties[configLayer.followLinkOnClick], '_blank');
    //         }
    //         //internal link changes page location
    //         else{ 
    //           //from an iframe
    //           if (window.location != window.parent.location){
    //             window.parent.location = feature.properties[configLayer.followLinkOnClick];
    //           }
    //           //from the main window
    //           else {
    //             window.location = feature.properties[configLayer.followLinkOnClick];
    //           }      
    //         }     
    //       });
    //     }
    //   },
    //   sortOrder: sortOrder,
    //   style: () => {
    //     if (layerStyle === "default") {
    //       return Object.assign(baseLayerStyles, {
    //         opacity: opacity,
    //         fillColor: fillColor,
    //         dashArray: layerLineDash
    //       });
    //     } else if (layerStyle === "random polygons") {
    //       //Create a random style and uses it as fillColor.
    //       const colorHex = `#${Math.round(Math.random() * 0xffffff).toString(
    //         16
    //       )}`;
    //       return Object.assign(baseLayerStyles, {
    //         fillColor: colorHex
    //       });
    //     }
    //   }
    // });

    // if (zoomToFeatureOnClick) {
    //   layer.on("click", event => {
    //     if (event.layer instanceof L.Polygon) {
    //       this.map.fitBounds(event.layer.getBounds());
    //     }
    //   });
    // }

    // if (highlightFeatureOnHover) {
    //   layer.on("mouseover", event => {
    //     event.layer.setStyle({
    //       weight: 3
    //     });
    //   });

    //   layer.on("mouseout", event => {
    //     event.layer.setStyle({
    //       weight: baseLayerStyles.weight
    //     });
    //   });
    // }

    // if (cluster) {
    //   //set the clusters color
    //   document.documentElement.style.setProperty(
    //     '--cluster-color', MARKER_COLORS[markerColor]
    //   );
    //   //create clusters layer
    //   clusterLayer = L.markerClusterGroup({
    //     maxClusterRadius: 60,
    //     disableClusteringAtZoom: disableClusteringAtZoom,
    //     spiderfyOnMaxZoom: false,
    //     showCoverageOnHover: false
    //   });
    //   clusterLayer.addLayer(layer);
    //   //add the sortorder as an option to the clusterLayer (needed for the legend)
    //   clusterLayer.options.sortOrder = layer.options.sortOrder;
    //   this.layersData.push({configLayer, layer, data, clusterLayer});
    // }
    // else{
    //   this.layersData.push({configLayer, layer, data});
    // }
    
    
    // TODO: refactor showLayersOnLoad to showAllLayersOnLoad, it will be clearer
    // if (this.mapConfig.showLayersOnLoad) {
    //   if (cluster) {     
    //     this.map.addLayer(clusterLayer);
    //   }
    //   else {
    //     layer.addTo(this.map);
    //     if (configLayer.loadToBack){
    //       layer.bringToBack();
    //     }  
    //   } 
    // }
    // else if (this.mapConfig.showFirstLayerOnLoad && sortOrder == 1){
    //   if (cluster) {     
    //     this.map.addLayer(clusterLayer);
    //   }
    //   else {
    //     layer.addTo(this.map);
    //     if (configLayer.loadToBack){
    //       layer.bringToBack();
    //    }
    //   }    
    // }
    //open popup closest to the map centre
    // if (configLayer.openPopupClosestToMapCentre){
    //   let closestMarker = L.GeometryUtil.closestLayer(this.map, layer.getLayers(), this.map.getCenter());
    //   closestMarker.layer.openPopup();
    // }

    // this.loadedLayerCount++;

    //only happens once, after the last layer has loaded - put the BLPUpolygon layer on top if it exists
    // if (this.mapClass.blpuPolygon && this.loadedLayerCount == this.layerCount) {
    //   this.mapClass.blpuPolygon.bringToFront();
    // }

    //only happens once, after the last layer has loaded - create filters above the map
    // if (this.mapConfig.filters && this.loadedLayerCount == this.layerCount) {
    //   this.filters = new Filters(this.mapClass, this.layersData);
    //   this.filters.init();
    // }

    //only happens once, after the last layer has loaded - create list view after the map
    // if (this.mapConfig.list && this.loadedLayerCount == this.layerCount) {
    //   this.list = new List(this.mapClass,this.layersData);
    //   this.list.init();
    // }

    //only happens once, after the last layer has loaded - add the drill down listener if true
    // if (this.mapConfig.performDrillDown && this.loadedLayerCount == this.layerCount) {
    //     this.drilldown = new DrillDown(this.map);
    //     this.drilldown.init();
    // }
      
    // if (this.mapConfig.showLegend) {
    //   let legendEntry = '';
    //   const count = layer.getLayers().length;
      
    //   if (cluster) {
    //     this.layers.push(clusterLayer);
    //   }
    //   else {
    //     this.layers.push(layer);
    //   }
    //   if (markerIcon2){
    //     if (this.mapConfig.hideNumberOfItems){
    //       legendEntry = `<div class="legend-entry-hidden-items"><div><span aria-hidden="true" class="control__active-border" style="background:${
    //         MARKER_COLORS[markerColorIcon2]
    //         }"></span></div><div><span class="fa-layers fa-fw"><i class="${markerIcon}" style="color:${MARKER_COLORS[markerColor]}"></i><i class="${markerIcon2}" data-fa-transform="shrink-2" style="color:${MARKER_COLORS[markerColorIcon2]}"></i></span></div></div><div class="legend-entry-text-hidden-items"><span class="control__text">${layerName}</span></div></div>`;          
    //     } else{
    //       legendEntry = `<div class="legend-entry"><div><span aria-hidden="true" class="control__active-border" style="background:${
    //         MARKER_COLORS[markerColorIcon2]
    //         }"></span></div><div><span class="fa-layers fa-fw"><i class="${markerIcon}" style="color:${MARKER_COLORS[markerColor]}"></i><i class="${markerIcon2}" data-fa-transform="shrink-2" style="color:${MARKER_COLORS[markerColorIcon2]}"></i></span></div><div class="legend-entry-text"><span class="control__text">${layerName}</br><span id="map-layer-count-${layer.getLayerId(
    //         layer
    //         )}" class="control__count">${count} items shown</span></div></div>`;          
    //     }
         
    //   } else {
    //     if (this.mapConfig.hideNumberOfItems){
    //       legendEntry = `<div class="legend-entry-hidden-items"><div><span aria-hidden="true" class="control__active-border" style="background:${
    //         MARKER_COLORS[markerColor]
    //         }"></span></div><div><span class="fa-layers fa-fw"><i class="${markerIcon}" style="color:${MARKER_COLORS[markerColor]}"></i></span></div><div class="legend-entry-text-hidden-items"><span class="control__text">${layerName}</span></div></div>`;          
    //     } else {
    //       legendEntry = `<div class="legend-entry"><div><span aria-hidden="true" class="control__active-border" style="background:${
    //         MARKER_COLORS[markerColor]
    //         }"></span></div><div><span class="fa-layers fa-fw"><i class="${markerIcon}" style="color:${MARKER_COLORS[markerColor]}"></i></span></div><div class="legend-entry-text"><span class="control__text">${layerName}</br><span id="map-layer-count-${layer.getLayerId(
    //         layer
    //         )}" class="control__count">${count} items shown</span></div></div>`;         
    //     }
    //   }
    //   if (cluster){
    //     this.overlayMaps[legendEntry] = clusterLayer;
    //   }
    //   else{
    //     this.overlayMaps[legendEntry] = layer;
    //   }
    //   // const layerPersonas = configLayer.personas;
    //   // for (const x in this.personas) {
    //   //   if (layerPersonas.includes(this.personas[x].id)) {
    //   //     if (cluster) {
    //   //       this.personas[x].layers.push(clusterLayer);
    //   //     }
    //   //     else {
    //   //       this.personas[x].layers.push(layer);
    //   //     }
    //   //   }
    //   // }
      
    //   //only happens once, after the last layer has loaded
    //   // if (this.loadedLayerCount == this.layerCount) {
    //   //   this.createControl();

    //   //   if (this.mapConfig.personas && this.mapConfig.personas.length > 0) {
    //   //     this.personasClass = new Personas(
    //   //       this.mapClass,
    //   //       this.layers,
    //   //       this.personas,
    //   //       this.layerControl,
    //   //       this.overlayMaps,
    //   //       this.filters
    //   //     );
    //   //     this.personasClass.init();
    //   //   }
    //   // }
    // } 

    // if (this.mapConfig.search && searchable){
    //   // this.search = new Search(this.mapClass, layer);
    //   // this.search.init();
    //   this.search.searchLayer.addLayer(layer);
      
    //   //only happens once, after the last layer has loaded
    //   if (this.loadedLayerCount == this.layerCount){
    //     this.search.createMarkup();
    //   }     
    // }
  }

  // createControl() {
  //   this.layerControl = new L.control.layers(null, this.overlayMaps, {
  //     collapsed: false,
  //     sortLayers: true,
  //     sortFunction: (a, b) => {
  //       const x = a.options.sortOrder;
  //       const y = b.options.sortOrder;
  //       if (isNaN(x) && isNaN(y)) {
  //         return x.localeCompare(y);
  //       } else {
  //         return x >= y ? 1 : -1;
  //       }
  //     }
  //   });
  //   this.map.addControl(this.layerControl, {
  //     collapsed: false,
  //     position: "topleft"
  //   });
  //   const mapLegend = document.getElementById("legend");
  //   mapLegend.appendChild(this.layerControl.getContainer());
  //   L.DomEvent.on(this.layerControl.getContainer(), "click", () => {
  //     L.DomEvent.stopPropagation;
  //     if (this.personasClass) {
  //       this.personasClass.removeActiveClass();
  //     }
  //   });
  //   return this.layerControl;
  // }

  loadLayers() {
    // if (this.mapConfig.personas) {
    //   for (const group of this.mapConfig.personas) {
    //     //crate layergroup object with this new empty list of layers
    //     const persona = {
    //       id: group.id,
    //       icon: group.icon,
    //       iconActive: group.iconActive,
    //       text: group.text,
    //       collapsed: false,
    //       layers: [],
    //       easyButton: null
    //     };
    //     this.personas.push(persona);
    //   }
    // }
    // if (this.mapConfig.search){
    //   //this.searchLayer = new L.LayerGroup([]);
    //   this.search = new Search(this.mapClass);
    //   this.search.init();
    // }
    
    if (this.mapConfig.showAddressSearch){
      //this.searchLayer = new L.LayerGroup([]);
      this.showAddressSearch = new addressSearch(this.mapClass);
      this.showAddressSearch.init();
      //this.showAddressSearch.createMarkup();
    }

    //for each layer in the config file
    for (const configLayer of this.mapConfig.layers) {

      //console.log("inside vectorTilesLayer")
      //If there is popups, we make the vector tile layer interactive
      if(configLayer.popup){
        this.interactive= true;
      } 

      if(configLayer.tooltip){
        this.interactive= true;
      } 

      // Set vectorTileOptions
      //https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html
      this.vectorTileOptions = {
        vectorTileLayerStyles: configLayer.vectorTileLayerStyles,
        interactive: this.interactive, // Make sure that this VectorGrid fires mouse/pointer events
      }
          
      // Creating the full vectorTile url
          
      this.vectorTileUrl = configLayer.vectorTileUrl;
      // Creating the vectorGrid layer
      const layer = L.vectorGrid.protobuf(this.vectorTileUrl, this.vectorTileOptions);
          
      // Add the vectorGrid layer to the map
      layer.addTo(this.map);

      //Create the popups if you click on the layer and there are popup fields
      if(configLayer.popup){
        layer.on('click', (e) => {
          this.addVectorTilePopUp(e,configLayer);
        }); 
      }
          
      //Create the tooltips when hovering if there are tooltips fields
      if(configLayer.tooltip){
        layer.on('mouseover', (e) => {
          this.addVectorTileToolTip(e,configLayer,layer);
          //console.log("mouseover")
        }); 
      }     
    }
  }
}

export default VectorTileDataLayers;
