
import L from "leaflet";
import ADDRESSES_PROXY_PROD from "../helpers/addressesProxy"
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
    this.masterMapLayer = null;
    this.OSMBase = null;
    this.hasPersonas = false;
    this.errorOutsideHackney = GENERIC_OUTSIDE_HACKNEY_ERROR;
    this.errorNoLocation = GENERIC_GEOLOCATION_ERROR;
    this.controls = null;
    this.isEmbed = false;
    this.centerDesktop = [];
    this.centerMobile = [];
    this.zoom =null;
    this.zoom_mobile=null;
    this.isFullScreen = false;
    this.uprn = null;
    this.marker = null;
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
        this.uprn = new URL(location.href).searchParams.get("uprn");
        let latlonString = new URL(location.href).searchParams.get("latlon");
        let latlon= null;
        //If there is an uprn, we get the lat/long from the addresses API, add a marker and zoom to the area of interest
        if (this.uprn){
        fetch(ADDRESSES_PROXY_PROD+"?format=detailed&uprn="+this.uprn, {
            method: "get"
          })
          .then(response => response.json())
          .then(data => {
            console.log (data);
            let latitudeUPRN = data.data.data.address[0].latitude;
            let longitudeUPRN = data.data.data.address[0].longitude;
            let singleLineAddress = data.data.data.address[0].singleLineAddress;
            let usage = data.data.data.address[0].usagePrimary;
            let ward = data.data.data.address[0].ward;

            //TODO Change the setView for replacing the center of the map when creating the map 

            this.popUpText = "ADDRESS: " + singleLineAddress + "<br>" + "UPRN: " + this.uprn+"<br>" + "PRIMARY USAGE: " + usage.toUpperCase() +"<br>" + "WARD: " + ward.toUpperCase() +"<br>" ;
            this.map.setView([latitudeUPRN,longitudeUPRN], this.zoom);
            this.marker = L.marker([latitudeUPRN,longitudeUPRN], {
              icon: L.AwesomeMarkers.icon({
                icon: 'fa-building',
                prefix: "fa",
                markerColor: 'red',
                spin: false
              }),
              alt: 'address'
            })
            .bindPopup(this.popUpText);
            this.marker.addTo(this.map);
            this.marker.openPopup();
            
          })
          .catch(error => {
            console.log(error);
            this.error.innerHTML = "There was a problem retrieving the UPRN. Please try again.";
          });
        }
        
        if (latlonString){
          latlon = latlonString.split(",");
        }

        //Get the zoom from the url
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
      zoom: this.zoom,
      gestureHandling: L.Browser.mobile
    });

    this.map.setMaxBounds(MAP_BOUNDS);

    if (this.isFullScreen){
      mobileDesktopSwitch(
        () => this.map.setView(this.centerMobile, this.zoom_mobile),
        () => this.map.setView(this.centerDesktop, this.zoom)
      );
    } else{
      mobileDesktopSwitch(
        () => this.map.setView(this.centerMobile, this.zoom_mobile),
        () => this.map.setView(this.centerDesktop, this.zoom)
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
        TILE_LAYER_OPTIONS_MAPBOX
      );
    } else if (this.mapConfig.baseStyle == "OSoutdoor") {
      this.OSMBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    } else if (this.mapConfig.baseStyle == "OSlight") {
      this.OSMBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    } else if (this.mapConfig.baseStyle == "OSroad") {
      this.OSMBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    } else if (this.mapConfig.baseStyle == "light") {
      this.OSMBase = L.tileLayer(
        `https://api.mapbox.com/styles/v1/hackneygis/cj8vdhus57vpi2spshe68ho4m/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_KEY}`,
        TILE_LAYER_OPTIONS_MAPBOX
      );
    } else if (this.mapConfig.baseStyle == "dark") {
      this.OSMBase = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS_MAPBOX, { id: "mapbox.dark" })
      );
    } else {
      this.OSMBase = L.tileLayer(
        MAPBOX_TILES_URL,
        Object.assign(TILE_LAYER_OPTIONS_MAPBOX, { id: "mapbox.streets" })
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
            this.map.setView(this.centerMobile, this.zoom_mobile);
          } else {
            this.map.setView(this.centerMobile, this.zoom_mobile);
          } 
        } else {
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
        //Get the URL parameters and open a new fullscreen map including the parameters
        const queryStringFromURL = window.location.search;
        // Open a new page
        window.open(
          'fullscreen' + queryStringFromURL,
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