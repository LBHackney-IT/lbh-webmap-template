import L from "leaflet";
import {
  isMobile as isMobileFn,
  mobileDesktopSwitch
} from "./helpers/isMobile";
import "leaflet-easybutton";
import "leaflet-control-custom";
import "leaflet-control-window";
import { pointToLayer, createTitle } from "./map-metadata";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  CENTER_DESKTOP,
  CENTER_MOBILE,
  DEFAULT_ZOOM_DESKTOP,
  DEFAULT_ZOOM_MOBILE,
  MAP_BOUNDS,
  HACKNEY_GEOSERVER,
  MAPBOX_TILES_URL,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS,
  MARKER_COLOURS,
  PERSONA_ACTIVE_CLASS
} from "./map-consts";
import MAPBOX_ACCESS_KEY from "./helpers/mapbox";
import "@fortawesome/fontawesome-pro/js/all";
import Geolocation from "./geolocation";
import Legend from "./legend";

class Map {
  constructor(map) {
    this.map = map;
    this.container = map.parentElement.parentElement;
    this.dataFolder = null;
    this.mapConfig = null;
    this.layerGroups = [];
    this.hackneyMask = null;
    this.OSMBase = null;
    this.hasPersonas = false;
    this.clearButton = document.getElementById("map-clear");
    this.errorOutsideHackney = GENERIC_OUTSIDE_HACKNEY_ERROR;
    this.errorNoLocation = GENERIC_GEOLOCATION_ERROR;
    this.legend = null;
    this.overlayMaps = {};
    this.layers = [];
    this.layerCount = 0;
    this.loadedLayerCount = 0;
  }

  init() {
    this.getDataName();

    // Tell leaflet where to look for our images
    L.Icon.Default.prototype.options.imagePath = "../images/";

    fetch(this.dataFolder + "/config/map-definition.json", {
      method: "get"
    })
      .then(response => response.json())
      .then(data => {
        this.mapConfig = data;
        this.layerCount = this.mapConfig.layers.length;
        this.hasPersonas = this.mapConfig.hasPersonas || this.hasPersonas;
        this.errorOutsideHackney =
          this.mapConfig.errorOutsideHackney || this.errorOutsideHackney;
        this.errorNoLocation =
          this.mapConfig.errorNoLocation || this.errorNoLocation;
        this.createMap();
        this.loadLayers();
        this.loadMetadata();
        if (this.clearButton) {
          this.toggleClearButton();
        }
        if (this.mapConfig.showLegend) {
          this.legend = new Legend(this).init();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  toggleClearButton() {
    this.map.on("layeradd", () => this.clearButton.show());
    this.map.on("layerremove", () => {
      let count = 0;
      this.map.eachLayer(() => (count += 1));
      if (count == 2) {
        this.clearButton.hide();
      }
    });
  }

  clear() {
    this.map.eachLayer(layer => {
      if (layer !== this.OSMBase && layer !== this.hackneyMask) {
        this.map.removeLayer(layer);
      }
    });

    this.setZoom();
    if (this.hasPersonas) {
      const activePersonas = document.getElementsByClassName(
        PERSONA_ACTIVE_CLASS
      );
      for (const persona of activePersonas) {
        persona.classList.remove(PERSONA_ACTIVE_CLASS);
      }
    }
  }

  getDataName() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    this.dataFolder = `data/${url.searchParams.get("name")}` || "data";
  }

  createMap() {
    this.map = L.map("map", {
      zoomControl: false,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      center: CENTER_DESKTOP,
      zoom: DEFAULT_ZOOM_DESKTOP
    });

    this.map.setMaxBounds(MAP_BOUNDS);

    mobileDesktopSwitch(
      () => this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE),
      () => this.map.setView(CENTER_DESKTOP, DEFAULT_ZOOM_DESKTOP)
    );

    this.addBaseLayer();

    if (this.mapConfig.zoomToMasterMap) {
      this.addMasterMapLayer();
    }

    if (this.mapConfig.showHackneyMask) {
      this.addHackneyMaskLayer();
    }

    if (this.mapConfig.showHackneyBoundary) {
      this.addHackneyBoundaryLayer();
    }

    // Disable zoom specifically on mobile devices, not based on screensize.
    if (!L.Browser.mobile) {
      L.control.zoom({ position: "topright" }).addTo(this.map);
    }

    if (this.mapConfig.locateControl) {
      new Geolocation(
        this.map,
        this.errorNoLocation,
        this.errorOutsideHackney
      ).init();
    }

    // Add reset button specifically on non-mobile devices, not based on screensize.
    if (this.mapConfig.resetZoomControl && !L.Browser.mobile) {
      this.addResetButton();
    }
  }

  addMasterMapLayer() {
    const masterMapLayer = L.tileLayer.wms(HACKNEY_GEOSERVER, {
      layers: "osmm:OSMM_outdoor_leaflet",
      format: "image/png",
      transparent: true,
      minZoom: 10,
      maxZoom: 20,
      opacity: 1
    });
    this.map.addLayer(masterMapLayer);
  }

  addBaseLayer() {
    if (this.mapConfig.baseStyle == "streets") {
      this.OSMBase = L.tileLayer(
        `https://api.mapbox.com/styles/v1/hackneygis/cj8vnelpqfetn2rox0ik873ic/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_KEY}`,
        TILE_LAYER_OPTIONS
      );
    } else if (this.mapConfig.baseStyle == "light") {
      this.OSMBase = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS, { id: "mapbox.light" })
      );
    } else if (this.mapConfig.baseStyle == "dark") {
      this.OSMBase = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS, { id: "mapbox.dark" })
      );
    } else {
      this.OSMBase = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS, { id: "mapbox.streets" })
      );
    }
    this.map.addLayer(this.OSMBase);
  }

  addHackneyMaskLayer() {
    this.hackneyMask = L.tileLayer.wms(HACKNEY_GEOSERVER, {
      layers: "boundaries:hackney_mask",
      transparent: true,
      format: "image/png"
    });
    this.map.addLayer(this.hackneyMask);
  }

  addHackneyBoundaryLayer() {
    const hackneyBoundary = L.tileLayer.wms(HACKNEY_GEOSERVER, {
      layers: "boundaries:hackney",
      transparent: true,
      format: "image/png"
    });
    this.map.addLayer(hackneyBoundary);
  }

  setZoom() {
    if (isMobileFn()) {
      this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
    } else {
      this.map.setView(CENTER_DESKTOP, DEFAULT_ZOOM_DESKTOP);
    }
  }

  addResetButton() {
    L.easyButton(
      "fa-globe",
      () => {
        // Still check this as someone may be on a desktop device at around 760px
        if (isMobileFn()) {
          this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
        } else {
          this.map.setView(CENTER_DESKTOP, DEFAULT_ZOOM_DESKTOP);
        }
      },
      "Zoom to all Hackney",
      { position: "topright" }
    ).addTo(this.map);
  }

  createPopupString(configLayer, feature, layerName) {
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
          const popupString = this.createPopupString(
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

    if (this.mapConfig.showLegend) {
      this.layers.push(layer);
      const count = layer.getLayers().length;
      const legendEntry = `<span aria-hidden="true" class="control-active-border" style="background:${MARKER_COLOURS[markerColor]}"></span><i class="fas fa-${markerIcon}" style="color:${MARKER_COLOURS[markerColor]}"></i><span class="control-text">${layerName}</span><span class="control-count">${count} items shown</span>`;
      this.overlayMaps[legendEntry] = layer;

      for (const k in parentGroups) {
        for (const l in this.layerGroups) {
          if (this.layerGroups[l].group == parentGroups[k]) {
            this.layerGroups[l].layersInGroup.push(layer);
          }
        }
      }

      this.loadedLayerCount++;
      if (this.loadedLayerCount == this.layerCount) {
        //add the layer control and keep the layercontrol javascript object
        // const layerControl =
        this.createControl();

        //create easy buttons for each group
        // for (const n in this.layerGroups) {
        //this function filters out layers in the layer control, showing only the relevant layers for this persona
        // this.createEasyButtons(
        //   this.layerGroups[n],
        //   this.layers,
        //   this.overlayMaps,
        //   layerControl,
        //   n,
        //   true
        // );
        // }
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
    const layerControl = new L.control.layers(null, this.overlayMaps, {
      collapsed: false,
      sortLayers: true,
      sortFunction: function(a, b) {
        return a.options.sortOrder.localeCompare(b.options.sortOrder);
      }
    });
    this.map.addControl(layerControl, {
      collapsed: false,
      position: "topleft"
    });
    const mapLegend = document.getElementById("map-legend");
    mapLegend.appendChild(layerControl.getContainer());
    L.DomEvent.on(layerControl.getContainer(), "click", () => {
      L.DomEvent.stopPropagation;
      // $(".persona-button--active").removeClass("persona-button--active");
    });
    return layerControl;
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

  addMetadata(data, mapTitle, mapAbstract) {
    let metadataText = "";
    for (const feature of data.features) {
      metadataText += `<div class="metadata__feature"><h3 class="lbh-heading-h6">${feature.properties.title}</h3>`;
      if (feature.properties.abstract) {
        metadataText += `<p class="lbh-body-xs">${feature.properties.abstract}</p>`;
      }
      metadataText += `<p class="lbh-body-xs"><b>Source:</b> ${feature.properties.source}<br></p>`;
      if (feature.properties.lastupdatedate) {
        metadataText += `<p class="lbh-body-xs"><b>Last updated:</b> ${feature.properties.lastupdatedate}</p>`;
      }
      metadataText += "</div>";
    }

    const control = createTitle(this.map, mapTitle, mapAbstract, metadataText);
    control.addTo(this.map);
  }

  loadMetadata() {
    const mapTitle = this.mapConfig.name;
    const mapAbstract = this.mapConfig.abstract;
    let aboutTheData = this.mapConfig.aboutTheData;
    let control;

    //load metadata from geoserver
    if (
      this.mapConfig.showMetadataUnderTitle &&
      this.mapConfig.layers.length > 0
    ) {
      const cqlValues = this.mapConfig.layers
        .map(i => `'${i.geoserverLayerName}'`)
        .toString();

      const url =
        "https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName=metadata:public_metadata&outputFormat=json&cql_filter=layer_name IN (" +
        cqlValues +
        ")";

      fetch(url, {
        method: "get"
      })
        .then(response => response.json())
        .then(data =>
          this.addMetadata(data, mapTitle, mapAbstract, aboutTheData)
        );
    } else if (aboutTheData) {
      aboutTheData = `<div class="metadata__feature"><p class="lbh-body-xs">${aboutTheData}</p></div>`;
      control = createTitle(this.map, mapTitle, mapAbstract, aboutTheData);
      if (control) {
        control.addTo(this.map);
      }
    } else {
      control = createTitle(this.map, mapTitle, mapAbstract, null);
      if (control) {
        control.addTo(this.map);
      }
    }
  }
}

export default Map;
