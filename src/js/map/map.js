import L from "leaflet";
import {
  isMobile as isMobileFn,
  mobileDesktopSwitch
} from "../helpers/isMobile";
import "leaflet-easybutton";
import "leaflet-control-custom";
import "leaflet-control-window";
import "leaflet-search";
import { GestureHandling } from "leaflet-gesture-handling";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  CENTER_DESKTOP_LEGEND,
  CENTER_DESKTOP_LEGEND_FULLSCREEN,
  CENTER_DESKTOP_NO_LEGEND,
  CENTER_DESKTOP_NO_LEGEND_FULLSCREEN,
  CENTER_MOBILE,
  CENTER_MOBILE_FULLSCREEN,
  DEFAULT_ZOOM_DESKTOP,
  DEFAULT_ZOOM_MOBILE,
  MAP_BOUNDS,
  HACKNEY_GEOSERVER_WMS,
  MAPBOX_TILES_URL,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS,
  PERSONA_ACTIVE_CLASS
} from "./consts";
import MAPBOX_ACCESS_KEY from "../helpers/mapbox";
import "@fortawesome/fontawesome-pro/js/all";
import Geolocation from "./geolocation";
import Controls from "./controls";
import DataLayers from "./data-layers";
import Metadata from "./metadata";
import "classlist-polyfill";


class Map {
  constructor(map) {
    this.map = map;
    this.container = map.parentElement.parentElement;
    this.dataFolder = null;
    this.mapConfig = null;
    this.hackneyMask = null;
    this.hackneyBoundary = null;
    this.masterMapLayer = null;
    this.OSMBase = null;
    this.hasPersonas = false;
    this.errorOutsideHackney = GENERIC_OUTSIDE_HACKNEY_ERROR;
    this.errorNoLocation = GENERIC_GEOLOCATION_ERROR;
    this.controls = null;
    this.isEmbed = false;
    this.centerDesktop = null;
    this.isFullScreen = false;
  }

  init() {
    this.getDataName();

    // Tell leaflet where to look for our images
    L.Icon.Default.prototype.options.imagePath = "../images/";

    fetch(this.dataFolder + "/map-definition.json", {
      method: "get"
    })
      .then(response => response.json())
      .then(data => {
        this.mapConfig = data;
        this.hasPersonas = this.mapConfig.hasPersonas || this.hasPersonas;
        this.errorOutsideHackney =
          this.mapConfig.errorOutsideHackney || this.errorOutsideHackney;
        this.errorNoLocation =
          this.mapConfig.errorNoLocation || this.errorNoLocation;
        if (this.mapConfig.showLegend) {
          if(this.isFullScreen){
            this.centerDesktop = CENTER_DESKTOP_LEGEND_FULLSCREEN;
          } else{
            this.centerDesktop = CENTER_DESKTOP_LEGEND;
          }
        } else {
          if(this.isFullScreen){
            this.centerDesktop = CENTER_DESKTOP_NO_LEGEND_FULLSCREEN;
          }else{
            this.centerDesktop = CENTER_DESKTOP_NO_LEGEND;
          }
        }
        this.createMap();
        if (this.mapConfig.showLegend) {
          this.controls = new Controls(this);
          this.controls.init();
        }
        new DataLayers(this).loadLayers();
        new Metadata(this).loadMetadata();
      })
      .catch(error => {
        console.log(error);
      });
      // if (document.getElementById("fullscreen_container")){
      //   this.isFullScreen = true;
      // }
  }

  clear() {
    this.map.eachLayer(layer => {
      if (
        layer !== this.OSMBase &&
        layer !== this.hackneyMask &&
        layer !== this.hackneyBoundary &&
        layer !== this.masterMapLayer &&
        layer !== this.masterMapLayerBW
      ) {
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
    const pathname = window.location.pathname;
    const paths = pathname.split("/");
    this.dataFolder = `../data/${paths[paths.length - 2]}` || "../data";
    this.isEmbed = paths[paths.length - 1] === "embed.html";
    this.isFullScreen = paths[paths.length - 1] === "fullscreen" || paths[paths.length - 1] === "fullscreen.html";
  }


  
  createMap() {

    //gesture handler
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

    this.map = L.map("map", {
      zoomControl: false,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      center: this.centerDesktop,
      zoom: DEFAULT_ZOOM_DESKTOP,
      gestureHandling: L.Browser.mobile
    });

    this.map.setMaxBounds(MAP_BOUNDS);

    if (this.isFullScreen){
      mobileDesktopSwitch(
        () => this.map.setView(CENTER_MOBILE_FULLSCREEN, DEFAULT_ZOOM_MOBILE),
        () => this.map.setView(this.centerDesktop, DEFAULT_ZOOM_DESKTOP)
      );
    } else{
      mobileDesktopSwitch(
        () => this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE),
        () => this.map.setView(this.centerDesktop, DEFAULT_ZOOM_DESKTOP)
      );
    }
    

    this.addBaseLayer();

    if (this.mapConfig.zoomToMasterMap) {
      this.addMasterMapLayer();
    }

    if (this.mapConfig.zoomToMasterMapBW) {
      this.addMasterMapLayerBW();
    }

    if (this.mapConfig.showHackneyMask) {
      this.addHackneyMaskLayer();
    }

    if (this.mapConfig.showHackneyBoundary) {
      this.addHackneyBoundaryLayer();
    }

    // Disable zoom specifically on mobile devices, not based on screensize.
    if (!L.Browser.mobile && !this.isFullScreen) {
      L.control.zoom({ position: "topright" }).addTo(this.map);
    } 

  

    if (this.mapConfig.showLocateButton) {
      new Geolocation(
        this.map,
        this.errorNoLocation,
        this.errorOutsideHackney
      ).init();
    }

    // Add reset button specifically on non-mobile devices, not based on screensize.
    if (this.mapConfig.showResetZoomButton && !L.Browser.mobile) {
      this.addResetButton();
    }

     //Add fullscreen button
     if (this.mapConfig.showFullScreenButton && !this.isFullScreen) {
      this.addFullScreenButton();
    }

  }

  addMasterMapLayer() {
    this.masterMapLayer = L.tileLayer.wms(HACKNEY_GEOSERVER_WMS, {
      layers: "osmm:OSMM_outdoor_leaflet",
      format: "image/png",
      tiled: true,
      transparent: true,
      minZoom: 18,
      maxZoom: 20,
      opacity: 1
    });
    this.map.addLayer(this.masterMapLayer);
  }


  addMasterMapLayerBW() {
    this.masterMapLayerBW = L.tileLayer.wms(HACKNEY_GEOSERVER_WMS, {
      layers: "osmm:OSMM_blackwhite_leaflet",
      format: "image/png",
      tiled: true,
      transparent: true,
      minZoom: 18,
      maxZoom: 20,
      opacity: 1
    });
    this.map.addLayer(this.masterMapLayerBW);
  }

  addBaseLayer() {
    if (this.mapConfig.baseStyle == "streets") {
      this.OSMBase = L.tileLayer(
        `https://api.mapbox.com/styles/v1/hackneygis/ck7ounc2t0cg41imjb3j53dp8/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_KEY}`,
        TILE_LAYER_OPTIONS
      );
    } else if (this.mapConfig.baseStyle == "light") {
      this.OSMBase = L.tileLayer(
        `https://api.mapbox.com/styles/v1/hackneygis/cj8vdhus57vpi2spshe68ho4m/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_KEY}`,
        TILE_LAYER_OPTIONS
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
    //limit zoom for OSM if mastermap is shown
    if (this.mapConfig.zoomToMasterMap || this.mapConfig.zoomToMasterMapBW){
      this.OSMBase.maxZoom = 17;
    }
    this.map.addLayer(this.OSMBase);
  }

  addHackneyMaskLayer() {
    this.hackneyMask = L.tileLayer.wms(HACKNEY_GEOSERVER_WMS, {
      layers: "boundaries:hackney_mask",
      transparent: true,
      format: "image/png"
    });
    this.map.addLayer(this.hackneyMask);
  }

  addHackneyBoundaryLayer() {
    this.hackneyBoundary = L.tileLayer.wms(HACKNEY_GEOSERVER_WMS, {
      layers: "boundaries:hackney",
      transparent: true,
      format: "image/png"
    });
    this.map.addLayer(this.hackneyBoundary);
  }

  setZoom() {
    if (isMobileFn()) {
        if (this.isFullScreen){
          this.map.setView(CENTER_MOBILE_FULLSCREEN, DEFAULT_ZOOM_MOBILE);
        } else {
          this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
        }  
      } else {
        this.map.setView(this.centerDesktop, DEFAULT_ZOOM_DESKTOP);
      }
      } 
  

  addResetButton() {
    L.easyButton(
      "fa-globe",
      () => {
        // Still check this as someone may be on a desktop device at around 760px
        if (isMobileFn()) {
          if (this.isFullScreen){
            this.map.setView(CENTER_MOBILE_FULLSCREEN, DEFAULT_ZOOM_MOBILE);
          } else {
            this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
          } 
        } else {
          this.map.setView(this.centerDesktop, DEFAULT_ZOOM_DESKTOP);
        }
      },
      "Zoom to all Hackney",
      { position: "topright" }
    ).addTo(this.map);
  }

  addFullScreenButton() {
    L.easyButton(
      "fa-expand",
      () => {
        // Open a new page
        console.log(this.isFullScreen);
        console.log(window.location.pathname);
        window.open(
          'fullscreen',
          //this.isFullScreen,
          //window.location.pathname,
          //'http://www.google.com',
          '_blank'
        );
      },
      "Open full screen mode",
      { position: "topright" }
    ).addTo(this.map);
  }

  addMarkupToMap(markup, id, className) {
    const element = document.createElement("section");
    element.setAttribute("id", id);
    element.classList.add(className);
    element.innerHTML = markup;
    this.container.insertBefore(element, this.container.firstChild);
  }

  addMarkupToMapAfter(markup, id, className) {
    const element = document.createElement("section");
    element.setAttribute("id", id);
    element.classList.add(className);
    element.innerHTML = markup;
    this.container.insertAdjacentElement("beforeend", element);
  }
}

export default Map;
