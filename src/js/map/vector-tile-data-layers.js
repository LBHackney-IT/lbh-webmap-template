import L, { Point } from "leaflet";
import "leaflet.vectorgrid";
import { MARKER_COLORS} from "./consts.js";
import addressSearch from "./address-search.js";

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
    this.controls = map.controls;
    this.layerCount = map.mapConfig.layers.length;
    this.loadedLayerCount = 0;
    this.overlayMaps = {};
    this.layersData = [];
    this.showAddressSearch = null;
    this.layerControl = null;
  }

  addVectorTilePopUp(e,configLayer) {
    // console.log(configLayer);
    console.log(e.layer.properties)
    console.log(e.latlng);
    const title = configLayer.popup.title;
    const fields = configLayer.popup.fields;
    const afterTitle = configLayer.popup.afterTitle;
    const afterFields = configLayer.popup.afterFields;

    let stringPopup = "";
    //If the popupTitle is NOT 'notitle'...
    if (title !== "notitle") {
      //If there is a popup title, we use it
      if (configLayer.popup.title) {
        stringPopup = `<h3 class="lbh-heading-h6 popup__title">${e.layer.properties[title]}</h3>`;
      } else {
        //If not, we use the name of the layer, unless no title is specified
        stringPopup = `<h3 class="lbh-heading-h6 popup__title">${configLayer.title}</b></h3>`;
      }
    }
    
    if (afterTitle) {
      stringPopup += `<p class="popup__text">${afterTitle}</p>`;
    }
    

    for (const field of fields) {
      if (field.label){
        stringPopup += `<p class="popup__text"><span class="popup__label">${field.label}</span>: ${e.layer.properties[field.name]}</p>`;
      } else {
        stringPopup += `<p class="popup__text">${e.layer.properties[field.name]}</p>`;
      }
    }

    if (afterFields){
      stringPopup += `<p class="popup__text">${afterFields}</p>`;
    }

    if (configLayer.popup) {
      L.popup({maxWidth: 210}).setContent(stringPopup)
      .setLatLng(e.latlng)
      .openOn(this.map);
    }
  }


  customiseVectorTile(layer, configLayer) {
    const layerName = configLayer.title;

    const pointStyle = configLayer.pointStyle;
    const markerIcon = pointStyle && pointStyle.icon;
    const markerIcon2 = pointStyle && pointStyle.icon2;
    const markerColor = pointStyle && pointStyle.markerColor;
    const markerColorIcon2 = pointStyle && pointStyle.markerColorIcon2;


    if (this.mapConfig.showLegend) {
      //console.log("inside the showLegend code");
      let legendEntry = '';
      this.layers.push(layer);
     
      if (markerIcon2){
        legendEntry = `<div class="legend-entry-hidden-items"><div><span aria-hidden="true" class="control__active-border" style="background:${MARKER_COLORS[markerColorIcon2]}"></span></div><div><span class="fa-layers fa-fw"><i class="${markerIcon}" style="color:${MARKER_COLORS[markerColor]}"></i><i class="${markerIcon2}" data-fa-transform="shrink-2" style="color:${MARKER_COLORS[markerColorIcon2]}"></i></span></div><div class="legend-entry-text"><span class="control__text">${layerName}</span></div></div>`;          
      } else {
        legendEntry = `<div class="legend-entry-hidden-items"><div><span aria-hidden="true" class="control__active-border" style="background:${MARKER_COLORS[markerColor]}"></span></div><div><span class="fa-layers fa-fw"><i class="${markerIcon}" style="color:${MARKER_COLORS[markerColor]}"></i></span></div><div class="legend-entry-text-hidden-items"><span class="control__text">${layerName}</span></div></div>`;          
      }

    this.overlayMaps[legendEntry] = layer;
    //console.log(this.overlayMaps);
    
    //only happens once, after the last layer has loaded
    if (this.loadedLayerCount == this.layerCount) {
      this.createVectorTileControl();
      }
    } 
  }

  createVectorTileControl() {
    //console.log("inside the create control in the vector tile code");
    this.layerControl = new L.control.layers(null, this.overlayMaps, {
      collapsed: false,
      sortLayers: false,
      sortFunction: (a, b) => {
        const x = a.options.sortOrder;
        const y = b.options.sortOrder;
        if (isNaN(x) && isNaN(y)) {
          return x.localeCompare(y);
        } else {
          return x >= y ? 1 : -1;
        }
      }
    });
    //console.log(this.layerControl);
    this.map.addControl(this.layerControl, {
      collapsed: false,
      position: "topleft"
    });
    const mapLegend = document.getElementById("legend");
    mapLegend.appendChild(this.layerControl.getContainer());
    L.DomEvent.on(this.layerControl.getContainer(), "click", () => {
      L.DomEvent.stopPropagation;
      if (this.personasClass) {
        this.personasClass.removeActiveClass();
      }
    });
    return this.layerControl;
  }

  loadLayers() {
    
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
      
      // add a listener for the map to add/remove the layer based on zoom
      // this.map.on('zoomend ', (e) => {
      //   console.log('zoom = '+ this.map.getZoom());
      //   if ( this.map.getZoom() > 14 ){ this.map.addLayer(layer)}
      //   else if ( this.map.getZoom() <= 14 ){ this.map.removeLayer(layer)}
      // });

      // Add the vectorGrid layer to the map
      if (this.mapConfig.showLayersOnLoad) {
        //if (this.map.getZoom()>14){
          layer.addTo(this.map);
        //}       
        this.loadedLayerCount++;
        this.customiseVectorTile(layer, configLayer) 
      }
      
      //Create the popups if you click on the layer and there are popup fields
      if(configLayer.popup){
        layer.on('click', (e) => {
          this.addVectorTilePopUp(e,configLayer);
        }); 
      }
          
      // //Create the tooltips when hovering if there are tooltips fields
      // if(configLayer.tooltip){
      //   layer.on('mouseover', (e) => {
      //     this.addVectorTileToolTip(e,configLayer,layer);
      //     console.log("mouseover")
      //   }); 
      // }     
    }
    
  }
}

export default VectorTileDataLayers;
