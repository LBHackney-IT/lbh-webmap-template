import L from "leaflet";
import { pointToLayer } from "./metadata";
import { MARKER_COLOURS } from "./consts";
import Personas from "./personas";
import Filters from "./filters";

class DataLayers {
  constructor(map) {
    this.mapClass = map;
    this.map = map.map;
    this.container = map.container;
    this.mapConfig = map.mapConfig;
    this.controls = map.controls;
    this.layers = [];
    this.layerCount = map.mapConfig.layers.length;
    this.loadedLayerCount = 0;
    this.overlayMaps = {};
    this.layerGroups = [];
    this.layerControl = null;
    this.filters = null;
    this.personas = null;
    this.layersData = [];
  }

  createMarkerPopup(configLayer, feature, layerName) {
    const popupStatementBefore = configLayer.popup.popupStatementBefore;
    const popupTitleField = configLayer.popup.popupTitleField;
    const popupFields = configLayer.popup.popupFields;
    const popupStatementAfter = configLayer.popup.popupStatementAfter;
    // Set up Pop up windows
    // If the title is 'notitle', no title (an empty string) will be added at the top.
    let stringPopup = "";
    if (popupTitleField !== "notitle") {
      // put the title field at the top of the popup in bold. If there is none in the config, just use the layer title instead.
      if (popupTitleField !== "") {
        stringPopup = `<h3 class="lbh-heading-h6 popup__title">${feature.properties[popupTitleField]}</h3>`;
      } else {
        stringPopup = `<h3 class="lbh-heading-h6 popup__title">${layerName}</b></h3>`;
      }
    }

    if (popupStatementBefore) {
      stringPopup += `<p class="popup__text">${popupStatementBefore}</p>`;
    }

    for (const i in popupFields) {
      if (feature.properties[popupFields[i]] !== "") {
        if (
          feature.properties[popupFields[i].fieldName] !== "" &&
          feature.properties[popupFields[i].fieldName] !== null
        ) {
          if (popupFields[i].fieldLabel != "") {
            stringPopup += `<p class="popup__text"><span class="popup__label">${
              popupFields[i].fieldLabel
            }</span>: ${feature.properties[popupFields[i].fieldName]}</p>`;
          } else {
            stringPopup += `<p class="popup__text">${
              feature.properties[popupFields[i].fieldName]
            }</p>`;
          }
        }
      }
    }

    if (popupStatementAfter) {
      stringPopup += `<p class="popup__text">${popupStatementAfter}</p>`;
    }

    return stringPopup;
  }

  addWFSLayer(data, configLayer) {
    const layerName = configLayer.title; // get from context
    const sortOrder = configLayer.title;
    const parentGroups = configLayer.groups;

    const markerType = configLayer.pointStyle.markerType;
    const markerIcon = configLayer.pointStyle.icon;
    const markerColor = configLayer.pointStyle.markerColor;
    const cluster = configLayer.pointStyle.cluster;
    const layerStyle = configLayer.linePolygonStyle.styleName;

    const layerOpacity = configLayer.linePolygonStyle.layerOpacity;
    const layerFillColor = configLayer.linePolygonStyle.layerFillColor;
    const layerLineDash = configLayer.linePolygonStyle.layerLineDash;
    const baseLayerStyles = {
      stroke: configLayer.linePolygonStyle.layerStroke,
      color: configLayer.linePolygonStyle.layerStrokeColor,
      fillOpacity: configLayer.linePolygonStyle.layerFillOpacity,
      weight: configLayer.linePolygonStyle.layerWeight
    };

    const noPopup = configLayer.popup.noPopup;

    const layer = new L.GeoJSON(data, {
      color: MARKER_COLOURS[markerColor],
      pointToLayer: (feature, latlng) => {
        return pointToLayer(
          latlng,
          markerType,
          markerIcon,
          markerColor,
          layerName
        );
      },
      onEachFeature: (feature, layer) => {
        if (!noPopup) {
          const popupString = this.createMarkerPopup(
            configLayer,
            feature,
            layerName
          );
          const popup = L.popup({ closeButton: true }).setContent(popupString);
          layer.bindPopup(popup, { maxWidth: 210 });
        }
      },
      sortOrder: sortOrder,
      style: () => {
        if (layerStyle === "default") {
          return Object.assign(baseLayerStyles, {
            opacity: layerOpacity,
            fillColor: layerFillColor,
            dashArray: layerLineDash
          });
        } else if (layerStyle === "random polygons") {
          //Create a random style and uses it as fillColor.
          const colorHex = `#${Math.round(Math.random() * 0xffffff).toString(
            16
          )}`;
          return Object.assign(baseLayerStyles, {
            fillColor: colorHex
          });
        }
      }
    });

    this.layersData.push({ layer, data });

    if (this.mapConfig.showLayersOnLoad) {
      console.log("here");
      layer.addTo(this.map);
    }

    this.loadedLayerCount++;
    if (this.mapConfig.filters && this.loadedLayerCount == this.layerCount) {
      this.filters = new Filters(this.mapClass, this.layersData);
      this.filters.init();
    }

    if (this.mapConfig.showLegend) {
      this.layers.push(layer);
      const count = layer.getLayers().length;
      const legendEntry = `<span aria-hidden="true" class="control__active-border" style="background:${
        MARKER_COLOURS[markerColor]
      }"></span><i class="fas fa-${markerIcon}" style="color:${
        MARKER_COLOURS[markerColor]
      }"></i><span class="control__text">${layerName}</span><span id="map-layer-count-${layerName
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        )}" class="control__count">${count} items shown</span>`;
      this.overlayMaps[legendEntry] = layer;

      for (const k in parentGroups) {
        for (const l in this.layerGroups) {
          if (this.layerGroups[l].group == parentGroups[k]) {
            this.layerGroups[l].layersInGroup.push(layer);
          }
        }
      }

      if (this.loadedLayerCount == this.layerCount) {
        this.createControl();

        if (this.mapConfig.showPersonas) {
          this.personas = new Personas(
            this.mapClass,
            this.layers,
            this.layerGroups,
            this.layerControl,
            this.overlayMaps,
            this.filters
          );
          this.personas.init();
        }
      }
    } else {
      if (cluster) {
        const markers = L.markerClusterGroup({
          maxClusterRadius: 60,
          disableClusteringAtZoom: 16,
          spiderfyOnMaxZoom: false
        });
        markers.addLayer(layer);
        this.map.addLayer(markers);
      } else {
        layer.addTo(this.map);
      }
    }
  }

  createControl() {
    this.layerControl = new L.control.layers(null, this.overlayMaps, {
      collapsed: false,
      sortLayers: true,
      sortFunction: function(a, b) {
        return a.options.sortOrder.localeCompare(b.options.sortOrder);
      }
    });
    this.map.addControl(this.layerControl, {
      collapsed: false,
      position: "topleft"
    });
    const mapLegend = document.getElementById("legend");
    mapLegend.appendChild(this.layerControl.getContainer());
    L.DomEvent.on(this.layerControl.getContainer(), "click", () => {
      L.DomEvent.stopPropagation;
      if (this.personas) {
        this.personas.removeActiveClass();
      }
    });
    return this.layerControl;
  }

  loadLayers() {
    for (const group of this.mapConfig.layerGroups) {
      //crate layergroup object with this new empty list of layers
      const layergroup = {
        group: group.name,
        groupIcon: group.groupIcon,
        groupIconActive: group.groupIconActive,
        groupText: group.groupText,
        alt: group.alt,
        collapsed: false,
        layersInGroup: [],
        groupEasyButton: null
      };
      this.layerGroups.push(layergroup);
    }

    //for each layer in the config file
    for (const configLayer of this.mapConfig.layers) {
      //Live
      const url =
        "https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName=" +
        configLayer.geoserverLayerName +
        "&outputFormat=json&SrsName=EPSG:4326";
      //Test
      //const url="http://lbhgiswebt01/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configLayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";

      //const url="http://localhost:8080/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+this.mapConfig.layerGroups[i].layers[j].geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
      //const iconn=this.mapConfig.layerGroups[i].layers[j].icon;

      fetch(url, {
        method: "get"
      })
        .then(response => response.json())
        .then(data => this.addWFSLayer(data, configLayer))
        .catch(error => {
          console.log(error);
          alert("Something went wrong, please reload the page");
        });
    }
  }
}

export default DataLayers;
