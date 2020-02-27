import L from "leaflet";
import { pointToLayer } from "./metadata";
import { MARKER_COLORS } from "./consts";
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
    this.personas = [];
    this.layerControl = null;
    this.personasClass = null;
    this.filters = null;
    this.layersData = [];
  }

  createMarkerPopup(configLayer, feature, layerName) {
    const title = configLayer.popup.title;
    const afterTitle = configLayer.popup.afterTitle;
    const fields = configLayer.popup.fields;
    const afterFields = configLayer.popup.afterFields;

    let stringPopup = "";
    if (title !== "notitle") {
      if (title) {
        stringPopup = `<h3 class="lbh-heading-h6 popup__title">${feature.properties[title]}</h3>`;
      } else {
        stringPopup = `<h3 class="lbh-heading-h6 popup__title">${layerName}</b></h3>`;
      }
    }

    if (afterTitle) {
      stringPopup += `<p class="popup__text">${afterTitle}</p>`;
    }

    for (const field of fields) {
      if (feature.properties[field] !== "") {
        if (
          feature.properties[field.name] !== "" &&
          feature.properties[field.name] !== null
        ) {
          if (field.label != "") {
            stringPopup += `<p class="popup__text"><span class="popup__label">${
              field.label
            }</span>: ${feature.properties[field.name]}</p>`;
          } else {
            stringPopup += `<p class="popup__text">${
              feature.properties[field.name]
            }</p>`;
          }
        }
      }
    }

    if (afterFields) {
      stringPopup += `<p class="popup__text">${afterFields}</p>`;
    }

    return stringPopup;
  }

  addWFSLayer(data, configLayer) {
    const layerName = configLayer.title;
    const sortOrder =
      configLayer.sortOrder && !isNaN(configLayer.sortOrder)
        ? configLayer.sortOrder
        : configLayer.title;

    const pointStyle = configLayer.pointStyle;
    const markerType = pointStyle && pointStyle.markerType;
    const markerIcon = pointStyle && pointStyle.icon;
    const markerColor = pointStyle && pointStyle.markerColor;
    const cluster = pointStyle && pointStyle.cluster;

    const linePolygonStyle = configLayer.linePolygonStyle;
    const layerStyle = linePolygonStyle && linePolygonStyle.styleName;
    const opacity = linePolygonStyle && linePolygonStyle.opacity;
    const fillColor = linePolygonStyle && linePolygonStyle.fillColor;
    const layerLineDash = linePolygonStyle && linePolygonStyle.layerLineDash;

    const baseLayerStyles = {
      stroke: linePolygonStyle && linePolygonStyle.stroke,
      color: linePolygonStyle && linePolygonStyle.strokeColor,
      fillOpacity: linePolygonStyle && linePolygonStyle.fillOpacity,
      weight: linePolygonStyle && linePolygonStyle.weight
    };

    const noPopup = configLayer.popup.noPopup;

    const layer = new L.GeoJSON(data, {
      color: MARKER_COLORS[markerColor],
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
            opacity: opacity,
            fillColor: fillColor,
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
        MARKER_COLORS[markerColor]
      }"></span><i class="fas fa-${markerIcon}" style="color:${
        MARKER_COLORS[markerColor]
      }"></i><span class="control__text">${layerName}</span><span id="map-layer-count-${layer.getLayerId(
        layer
      )}" class="control__count">${count} items shown</span>`;
      this.overlayMaps[legendEntry] = layer;

      const layerPersonas = configLayer.personas;
      for (const x in this.personas) {
        if (layerPersonas.includes(this.personas[x].id)) {
          this.personas[x].layers.push(layer);
        }
      }

      if (this.loadedLayerCount == this.layerCount) {
        this.createControl();

        if (this.mapConfig.personas && this.mapConfig.personas.length > 0) {
          this.personasClass = new Personas(
            this.mapClass,
            this.layers,
            this.personas,
            this.layerControl,
            this.overlayMaps,
            this.filters
          );
          this.personasClass.init();
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
    if (this.mapConfig.personas) {
      for (const group of this.mapConfig.personas) {
        //crate layergroup object with this new empty list of layers
        const persona = {
          id: group.id,
          icon: group.icon,
          iconActive: group.iconActive,
          text: group.text,
          collapsed: false,
          layers: [],
          easyButton: null
        };
        this.personas.push(persona);
      }
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

      //const url="http://localhost:8080/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+this.mapConfig.personas[i].layers[j].geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
      //const iconn=this.mapConfig.personas[i].layers[j].icon;

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
