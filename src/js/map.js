import L from "leaflet";
import {
  isMobile as isMobileFn,
  mobileDesktopSwitch
} from "./helpers/isMobile";
import "leaflet-easybutton";
import "leaflet-control-custom";
import "leaflet-control-window";
import { pointToLayer, createTitle } from "./map-helpers";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  CENTER_DESKTOP,
  CENTER_MOBILE,
  DEFAULT_ZOOM_DESKTOP,
  DEFAULT_ZOOM_MOBILE,
  ZOOM_CONTROL,
  MAP_BOUNDS,
  HACKNEY_BOUNDS_1,
  HACKNEY_BOUNDS_2,
  HACKNEY_GEOSERVER,
  MAPBOX_TILES_URL,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS,
  MARKER_COLOURS
} from "./map-consts";
import MAPBOX_ACCESS_KEY from "./helpers/mapbox";

class Map {
  constructor(map) {
    this.map = map;
    this.dataFolder = null;
    this.mapConfig = null;
    this.layerGroups = [];
  }

  init() {
    this.getDataName();

    fetch(this.dataFolder + "/config/map-definition.json", {
      method: "get"
    })
      .then(response => response.json())
      .then(data => {
        this.mapConfig = data;
        this.createMap();
        this.loadLayers();
        this.loadMetadata();
      })
      .catch(error => {
        console.log(error);
      });
  }

  getDataName() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    this.dataFolder = `/data/${url.searchParams.get("name")}` || "/data";
  }

  createMap() {
    const isMobile = isMobileFn();

    this.map = L.map("map", {
      zoomControl: ZOOM_CONTROL,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      center: CENTER_DESKTOP,
      zoom: DEFAULT_ZOOM_DESKTOP
    });

    this.map.setMaxBounds(MAP_BOUNDS);

    if (isMobile) {
      this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
    }
    mobileDesktopSwitch(
      () => {
        this.map.setView(CENTER_DESKTOP, DEFAULT_ZOOM_DESKTOP);
      },
      () => {
        this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
      }
    );

    this.addBaseLayer();

    if (this.mapConfig.zoomtomastermap) {
      this.addMasterMapLayer();
    }

    if (this.mapConfig.showHackneyMask) {
      this.addHackneyMaskLayer();
    }

    if (!isMobile) {
      L.control.zoom({ position: "topright" }).addTo(this.map);
    }

    if (this.mapConfig.locateControl) {
      this.addLocateControl();
    }

    if (this.mapConfig.resetzoomcontrol && !isMobile) {
      this.addResetButton();
    }
  }

  addMasterMapLayer() {
    const mastermapLayer = L.tileLayer.wms(HACKNEY_GEOSERVER, {
      layers: "osmm:OSMM_outdoor_leaflet",
      format: "image/png",
      uppercase: true,
      transparent: true,
      continuousWorld: true,
      tiled: true,
      info_format: "text/html",
      opacity: 1,
      identify: false,
      minZoom: 10,
      maxZoom: 20
    });
    this.map.addLayer(mastermapLayer);
  }

  addBaseLayer() {
    let OSM_base;
    if (this.mapConfig.basestyle == "streets") {
      OSM_base = L.tileLayer(
        `https://api.mapbox.com/styles/v1/hackneygis/cj8vnelpqfetn2rox0ik873ic/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_KEY}`,
        TILE_LAYER_OPTIONS
      );
    } else if (this.mapConfig.basestyle == "light") {
      OSM_base = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS, { id: "mapbox.light" })
      );
    } else if (this.mapConfig.basestyle == "dark") {
      OSM_base = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS, { id: "mapbox.dark" })
      );
    } else {
      OSM_base = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS, { id: "mapbox.streets" })
      );
    }
    this.map.addLayer(OSM_base);
  }

  addHackneyMaskLayer() {
    const hackney_mask = L.tileLayer.wms(HACKNEY_GEOSERVER, {
      layers: "boundaries:hackney_mask",
      transparent: true,
      format: "image/png"
    });
    this.map.addLayer(hackney_mask);
  }

  addHackneyBoundaryLayer() {
    const hackney_boundary = L.tileLayer.wms(HACKNEY_GEOSERVER, {
      layers: "boundaries:hackney",
      transparent: true,
      format: "image/png"
    });
    this.map.addLayer(hackney_boundary);
  }

  setZoom() {
    if (isMobile()) {
      this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
    } else {
      this.map.setView(CENTER_DESKTOP, DEFAULT_ZOOM_DESKTOP);
    }
  }

  addLocateControl() {
    //prepare marker and event for geolocation
    let locateCircle = null;
    this.map.on("locationerror", function(e) {
      alert(this.mapConfig.locationError || GENERIC_GEOLOCATION_ERROR);
    });
    const currentLocation2 = L.easyButton(
      "fa-location",
      btn => {
        const onLocationFoundViaControl = e => {
          if (locateCircle !== null) {
            this.map.removeLayer(locateCircle);
          }
          locateCircle = L.circleMarker(e.latlng).addTo(this.map);
          const hackneyBounds = L.bounds(HACKNEY_BOUNDS_1, HACKNEY_BOUNDS_2);
          if (hackneyBounds.contains([e.latlng.lat, e.latlng.lng])) {
            map.setView([e.latlng.lat, e.latlng.lng], 16);
          } else {
            alert(
              this.mapConfig.outsideHackneyError ||
                GENERIC_OUTSIDE_HACKNEY_ERROR
            );
            this.setZoom();
          }
          this.map.off("locationfound", onLocationFoundViaControl);
        };

        this.map.on("locationfound", onLocationFoundViaControl.bind(this));

        this.map.locate({
          setView: false,
          timeout: 5000,
          maximumAge: 0,
          maxZoom: 16
        });
      },
      "Show me where I am",
      { position: "topright" }
    ).addTo(this.map);
  }

  addResetButton() {
    L.easyButton(
      "fa-globe",
      () => {
        this.map.setView(CENTER_DESKTOP, DEFAULT_ZOOM_DESKTOP);
      },
      "Zoom to all Hackney",
      { position: "topright" }
    ).addTo(this.map);
  }

  createPopupString(configLayer, feature, layerName) {
    const popupStatementBefore = configLayer.popup.popupstatementbefore;
    const popupTitleField = configLayer.popup.popuptitlefield;
    const popupFields = configLayer.popup.popupfields;
    const popupStatementAfter = configLayer.popup.popupstatementafter;
    // Set up Pop up windows
    // If the title is 'notitle', no title (an empty string) will be added at the top.
    let stringPopup = "";
    if (popupTitleField !== "notitle") {
      // put the title field at the top of the popup in bold. If there is none in the config, just use the layer title instead.
      if (popupTitleField !== "") {
        stringPopup = `<center><b>${feature.properties[popupTitleField]}</b></center>`;
      } else {
        stringPopup = `<center><b>${layerName}</b></center>`;
      }
    }

    if (popupStatementBefore) {
      stringPopup += `<br><center>${popupStatementBefore}</center>`;
    }

    for (const i in popupFields) {
      if (feature.properties[popupFields[i]] !== "") {
        if (
          feature.properties[popupFields[i].fieldname] !== "" &&
          feature.properties[popupFields[i].fieldname] !== null
        ) {
          if (popupFields[i].fieldlabel != "") {
            stringPopup += `<br><center><b>${popupFields[i].fieldlabel}</b>: ${
              feature.properties[popupFields[i].fieldname]
            }</center>`;
          } else {
            stringPopup += `<br><center>${
              feature.properties[popupFields[i].fieldname]
            }</center>`;
          }
        }
      }
    }

    if (popupStatementAfter) {
      stringPopup += `<br><center>${popupStatementAfter}</center>`;
    }

    return stringPopup;
  }

  addWFSLayer(data, configLayer) {
    const layerName = configLayer.title; // get from context
    const sortOrder = configLayer.title;

    const markerType = configLayer.pointstyle.markertype;
    const markerIcon = configLayer.pointstyle.icon;
    const markerColor = configLayer.pointstyle.markercolor;
    const cluster = configLayer.pointstyle.cluster;
    const layerStyle = configLayer.linepolygonstyle.stylename;

    const layerOpacity = configLayer.linepolygonstyle.layeropacity;
    const layerFillColor = configLayer.linepolygonstyle.layerfillcolor;
    const layerLineDash = configLayer.linepolygonstyle.layerlinedash;
    const baseLayerStyles = {
      stroke: configLayer.linepolygonstyle.layerstroke,
      color: configLayer.linepolygonstyle.layerstrokecolor,
      fillOpacity: configLayer.linepolygonstyle.layerfillOpacity,
      weight: configLayer.linepolygonstyle.layerweight
    };

    const noPopup = configLayer.popup.nopopup;

    const layer = new L.GeoJSON(data, {
      color: MARKER_COLOURS[markerColor],
      pointToLayer: function(feature, latlng) {
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
      sortorder: sortOrder,
      style: function style(feature) {
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
    //cluster style
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

  loadLayers() {
    for (const group of this.mapConfig.layergroups) {
      //crate layergroup object with this new empty list of layers
      const layergroup = {
        group: group.name,
        groupIcon: group.groupicon,
        groupIconActive: group.groupiconactive,
        groupText: group.grouptext,
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

      //const url="http://localhost:8080/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+this.mapConfig.layergroups[i].layers[j].geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
      //const iconn=this.mapConfig.layergroups[i].layers[j].icon;

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
      metadataText += `<p><b>${feature.properties.title}</b><br>`;
      if (feature.properties.abstract) {
        metadataText += `<i>${feature.properties.abstract}</i><br>`;
      }
      metadataText += `<b>Source:</b> ${feature.properties.source}<br>`;
      if (feature.properties.lastupdatedate) {
        metadataText += `<b>Last updated:</b> ${feature.properties.lastupdatedate}</p>`;
      }
    }

    const control = createTitle(mapTitle, mapAbstract, metadataText);
    control.addTo(this.map);
  }

  loadMetadata() {
    const mapTitle = this.mapConfig.name;
    const mapAbstract = this.mapConfig.abstract;
    const aboutTheData = this.mapConfig.aboutTheData;
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
      aboutTheData = `<p>${aboutTheData}</p>`;
      control = createTitle(mapTitle, mapAbstract, aboutTheData);
      if (control) {
        control.addTo(this.map);
      }
    } else {
      control = createTitle(mapTitle, mapAbstract, null);
      if (control) {
        control.addTo(this.map);
      }
    }
  }
}

export default Map;
