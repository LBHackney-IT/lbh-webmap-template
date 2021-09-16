
import L from "leaflet";
import "proj4leaflet";
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
  //CENTER_MOBILE_FULLSCREEN,
  DEFAULT_ZOOM_DESKTOP,
  DEFAULT_ZOOM_MOBILE,
  MAP_BOUNDS,
  HACKNEY_GEOSERVER_WMS,
  MAPBOX_TILES_URL,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS_MAPBOX,
  TILE_LAYER_OPTIONS_OS,
  PERSONA_ACTIVE_CLASS
} from "./consts";
import MAPBOX_ACCESS_KEY from "../helpers/mapbox";
import OS_RASTER_API_KEY  from "../helpers/osdata";
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
    this.mapBase = null;
    this.hasPersonas = false;
    this.errorOutsideHackney = GENERIC_OUTSIDE_HACKNEY_ERROR;
    this.errorNoLocation = GENERIC_GEOLOCATION_ERROR;
    this.controls = null;
    this.isEmbed = false;
    //this.centerDesktop = null;
    this.centerDesktop = [];
    this.centerMobile = [];
    this.zoom =null;
    this.zoom_mobile=null;
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
          
        //Save the value of the parameters (if any) in the variables
        let latlonString = new URL(location.href).searchParams.get("latlon");
        let latlon= null;
        if (latlonString){
          latlon = latlonString.split(",");
        }
        let zoomParam = new URL(location.href).searchParams.get("zoom");
        //Convert zoom parameter to Int
        let zoomInt = parseInt(zoomParam);
        //If there is a zoom parameter in url, this is taken and we create the zoom on mobile from the parameter (-2). If not, default zoom desktop value will be taken. 
        zoomParam ? (this.zoom = zoomInt,this.zoom_mobile = zoomInt - 2) : (this.zoom = DEFAULT_ZOOM_DESKTOP,this.zoom_mobile = DEFAULT_ZOOM_MOBILE)
        
        if (this.mapConfig.showLegend) {
          if(this.isFullScreen){
            //this.centerDesktop = CENTER_DESKTOP_LEGEND_FULLSCREEN;
            latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_LEGEND_FULLSCREEN,this.centerMobile=CENTER_MOBILE);
          } else{
            //this.centerDesktop = CENTER_DESKTOP_LEGEND;
            latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_LEGEND,this.centerMobile=CENTER_MOBILE);

          }
        } else {
          if(this.isFullScreen){
            //this.centerDesktop = CENTER_DESKTOP_NO_LEGEND_FULLSCREEN;
            latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_NO_LEGEND_FULLSCREEN,this.centerMobile=CENTER_MOBILE);

          }else{
            //this.centerDesktop = CENTER_DESKTOP_NO_LEGEND;
            latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_NO_LEGEND,this.centerMobile=CENTER_MOBILE);

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
        layer !== this.mapBase &&
        layer !== this.hackneyMask &&
        layer !== this.hackneyBoundary
      ) {
        this.map.removeLayer(layer);
      }
    });

    //this.setZoom();
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
    // Setup the EPSG:27700 (British National Grid) projection.
    var crs = new L.Proj.CRS('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs', {
      resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
      origin: [ -238375.0, 1376256.0 ]
    });

    //gesture handler
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

    this.map = L.map("map", {
      crs: crs,
      zoomControl: false,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      center: this.centerDesktop,
      zoom: DEFAULT_ZOOM_DESKTOP,
      zoom: this.zoom,
      gestureHandling: L.Browser.mobile
    });

    this.map.setMaxBounds(MAP_BOUNDS);

    if (this.isFullScreen){
      mobileDesktopSwitch(
        //() => this.map.setView(CENTER_MOBILE_FULLSCREEN, DEFAULT_ZOOM_MOBILE),
        () => this.map.setView(this.centerMobile, this.zoom_mobile),
        () => this.map.setView(this.centerDesktop, this.zoom)
        // () => this.map.setView(this.centerDesktop, DEFAULT_ZOOM_DESKTOP)
      );
    } else{
      mobileDesktopSwitch(
        //() => this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE),
        () => this.map.setView(this.centerMobile, this.zoom_mobile),
        () => this.map.setView(this.centerDesktop, this.zoom)
        //() => this.map.setView(this.centerDesktop, DEFAULT_ZOOM_DESKTOP)
      );
    }
    

    this.addBaseLayer();

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


  addBaseLayer() {
    if (this.mapConfig.baseStyle == "OSoutdoor") {
      this.mapBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Outdoor_27700/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    } else if (this.mapConfig.baseStyle == "OSlight") {
      this.mapBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Light_27700/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    } else if (this.mapConfig.baseStyle == "OSroad") {
      this.mapBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Road_27700/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    }
    
    //limit zoom for OSM if mastermap is shown 
    //TODO: set a max zoom in zoomToMasterMap is false
    // if (this.mapConfig.zoomToMasterMap || this.mapConfig.zoomToMasterMapBW){
    //   this.mapBase.maxZoom = 17;
    // }
    this.map.addLayer(this.mapBase);
  }

  addHackneyMaskLayer() {
    this.hackneyMask = L.tileLayer.wms(HACKNEY_GEOSERVER_WMS, {
      layers: "boundaries:hackney_mask",
      transparent: true,
      tiled: true,
      format: "image/png"
    });
    this.map.addLayer(this.hackneyMask);
  }

  addHackneyBoundaryLayer() {
    this.hackneyBoundary = L.tileLayer.wms(HACKNEY_GEOSERVER_WMS, {
      layers: "boundaries:hackney",
      transparent: true,
      tiled: true,
      format: "image/png"
    });
    this.map.addLayer(this.hackneyBoundary);
  }

  setZoom() {
    if (isMobileFn()) {
        if (this.isFullScreen){
          //We are using the same center for fullscreen or index/embed 
          this.map.setView(this.centerMobile, this.zoom_mobile);
        } else {
          this.map.setView(this.centerMobile, this.zoom_mobile);
        }  
      } else {
        this.map.setView(this.centerDesktop, this.zoom);
      }
      } 
  

  addResetButton() {
    L.easyButton(
      "fa-globe",
      () => {
        // Still check this as someone may be on a desktop device at around 760px
        if (isMobileFn()) {
          if (this.isFullScreen){
            //this.map.setView(CENTER_MOBILE_FULLSCREEN, DEFAULT_ZOOM_MOBILE);
            this.map.setView(this.centerMobile, this.zoom_mobile);
          } else {
            //this.map.setView(CENTER_MOBILE, DEFAULT_ZOOM_MOBILE);
            this.map.setView(this.centerMobile, this.zoom_mobile);
          } 
        } else {
           //this.map.setView(this.centerDesktop, DEFAULT_ZOOM_DESKTOP);
           this.map.setView(this.centerDesktop, this.zoom);
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