
import L from "leaflet";
import "proj4leaflet";
import {getWFSurl, getWMSurl} from "../helpers/hackneyGeoserver";
import {
  isMobile,
  isMobile as isMobileFn,
  mobileDesktopSwitch
} from "../helpers/isMobile";
import "leaflet-easybutton";
import "leaflet-control-custom";
import "leaflet-control-window";
import "leaflet-search";
import { GestureHandling } from "leaflet-gesture-handling";
import {
  MIN_ZOOM,
  CENTER_DESKTOP_LEGEND,
  CENTER_DESKTOP_LEGEND_FULLSCREEN,
  CENTER_DESKTOP_NO_LEGEND,
  CENTER_DESKTOP_NO_LEGEND_FULLSCREEN,
  CENTER_MOBILE,
  DEFAULT_ZOOM_DESKTOP,
  DEFAULT_ZOOM_MOBILE,
  MAP_BOUNDS,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS_OS,
  PERSONA_ACTIVE_CLASS,
} from "./consts";
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
    this.mask = null;
    this.maskGeoserverName = null;
    this.boundary = null;
    this.boundaryGeoserverName = null;
    this.mapBase = null;
    this.hasPersonas = false;
    this.errorOutsideHackney = GENERIC_OUTSIDE_HACKNEY_ERROR;
    this.errorNoLocation = GENERIC_GEOLOCATION_ERROR;
    this.controls = null;
    this.isEmbed = false;
    this.centerDesktop = [];
    this.centerMobile = [];
    this.zoom =null;
    this.zoom_mobile=null;
    this.maxZoom = null;
    this.isFullScreen = false;
    this.uprn = null;
    this.blpuMarker = null;
    this.blpuPolygon = null;
    this.geoserver_wfs_url = getWFSurl();
    this.geoserver_wms_url = getWMSurl();
  }

  init() {
    this.getDataName();
    //this.getGeoserverURLsFromHostname();

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
        
        //first get the zoom from the URL
        let zoomParam = new URL(location.href).searchParams.get("zoom");
        //Convert zoom parameter to Int
        let zoomInt = parseInt(zoomParam);
        //If there is a zoom parameter in url, this is taken and we create the zoom on mobile from the parameter (-2). If not, default zoom desktop value will be taken. 
        zoomParam ? (this.zoom = zoomInt,this.zoom_mobile = zoomInt - 2) : (this.zoom = DEFAULT_ZOOM_DESKTOP,this.zoom_mobile = DEFAULT_ZOOM_MOBILE)

        //If there is an uprn, we get the lat/long from the addresses API, add a marker and zoom to the area of interest
        if (this.uprn){
          fetch(this.geoserver_wfs_url+"llpg:blpu_details_test&cql_filter=uprn="+this.uprn, {
            method: "get"
          })
          .then(response => response.json())
          .then(data => {
            let latitudeUPRN = data.features[0].properties.latitude;
            let longitudeUPRN = data.features[0].properties.longitude;
            let singleLineAddress = data.features[0].properties.full_address_line;
            let usage = data.features[0].properties.usage_primary;
            let ward = data.features[0].properties.ward;
            let geometryType = data.features[0].geometry.type;

            let latlon = [latitudeUPRN,longitudeUPRN];
            this.setViewFromLatlon(latlon);
            
            this.createMap();
            this.createMapContent();
        
            if (geometryType == "Polygon"){
              this.popUpText = "PROPERTY BOUNDARY "+"<br>" + "ADDRESS: " + singleLineAddress + "<br>" + "UPRN: " + this.uprn+"<br>" + "PRIMARY USAGE: " + usage.toUpperCase() +"<br>" + "WARD: " + ward.toUpperCase() +"<br>" ;
              this.zoom = null;
              this.blpuPolygon = new L.GeoJSON(data, {
                color:"black",
                weight: 3,
                opacity: 0.8,
                fillOpacity: 0
              });      
              this.blpuPolygon.addTo(this.map);
              this.blpuPolygon.bringToFront();
              //always keep this layer on top 
              this.map.on("overlayadd", (event) => {
                this.blpuPolygon.bringToFront();
              });
              //zoom to the bounds of the blpu polygon (different options depending on showLegend or not)
              if (this.mapConfig.showLegend && (!isMobileFn())){
                if (! this.isFullScreen){
                  this.map.fitBounds(this.blpuPolygon.getBounds(), {
                    animate: false,
                    paddingTopLeft: [270, 0]
                  });
                }
                else{
                  this.map.fitBounds(this.blpuPolygon.getBounds(), {
                    animate: false,
                    paddingTopLeft: [400, 0]
                  });
                }
              }
              else{
                this.map.fitBounds(this.blpuPolygon.getBounds(), {
                  animate: false
                });
              } 
            //If there is no polygon...(only marker)
            } else {
              this.popUpText = "PROPERTY LOCATION "+"<br>" + "ADDRESS: " + singleLineAddress + "<br>" + "UPRN: " + this.uprn+"<br>" + "PRIMARY USAGE: " + usage.toUpperCase() +"<br>" + "WARD: " + ward.toUpperCase() +"<br>" ;
              //zoom to the bounds of the blpu marker (different options depending on showLegend or not)
              if (this.mapConfig.showLegend && (!isMobileFn())){
                if (! this.map.isFullScreen){
                  this.map.fitBounds(L.latLng(latitudeUPRN, longitudeUPRN).toBounds(200), {
                    animate: false,
                    paddingTopLeft: [270, 0]
                  });
                }
                else{
                  this.map.fitBounds(L.latLng(latitudeUPRN, longitudeUPRN).toBounds(400), {
                    animate: false,
                    paddingTopLeft: [400, 0]
                  });
                }
              }
              else{
                this.map.fitBounds(L.latLng(latitudeUPRN, longitudeUPRN).toBounds(150), {
                  animate: false
                });
              } 
            }
            this.blpuMarker = L.marker([latitudeUPRN,longitudeUPRN], {
              icon: L.AwesomeMarkers.icon({
                icon: 'fa-home-alt',
                prefix: "fa",
                markerColor: 'black',
                spin: false
              }),
              alt: 'address'
            })
            .bindPopup(this.popUpText, {maxWidth: 210});
            this.blpuMarker.addTo(this.map);
            this.blpuMarker.openPopup(); 
          })
          .catch(error => {
            this.error.innerHTML = "There was a problem retrieving the UPRN. Please try again.";
          });
        }
        //if no UPRN, get the lat/lon from the URL
        else if (latlonString){
          latlon = latlonString.split(",");
          this.setViewFromLatlon(latlon);
          this.createMap();
          this.createMapContent();
        }
        else {
          this.setViewFromLatlon(null);
          this.createMap();
          this.createMapContent();
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
        }
       
      })
      .catch(error => {
      });
  }

  setViewFromLatlon(latlon) {
    if (this.mapConfig.showLegend) {
      if(this.isFullScreen){
        latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_LEGEND_FULLSCREEN,this.centerMobile=CENTER_MOBILE);
      } else{
        latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_LEGEND,this.centerMobile=CENTER_MOBILE);
      }
    } else {
      if(this.isFullScreen){
        latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_NO_LEGEND_FULLSCREEN,this.centerMobile=CENTER_MOBILE);

      }else{
        latlon ? (this.centerDesktop = latlon, this.centerMobile =latlon) : (this.centerDesktop = CENTER_DESKTOP_NO_LEGEND,this.centerMobile=CENTER_MOBILE);
      }
    }
  }

  clear() {
    this.map.eachLayer(layer => {
      if (
        layer !== this.mapBase &&
        layer !== this.mask &&
        layer !== this.boundary
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
    // Setup the EPSG:27700 (British National Grid) projection.
    var crs = new L.Proj.CRS('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs', {
      resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
      origin: [ -238375.0, 1376256.0 ]
    });

    //set a max zoom if blockZoomToMasterMap is true to block the detailed view. By default, the max soom is 12 and zoom to MasterMap.
     if (this.mapConfig.blockZoomToMasterMap){
      this.maxZoom = 9;
    } else {
      this.maxZoom = 12;
    }

    //gesture handler
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

    this.map = L.map("map", {
      crs: crs,
      zoomControl: false,
      maxZoom: this.maxZoom,
      minZoom: MIN_ZOOM,
      center: this.centerDesktop,
      zoom: this.zoom,
      gestureHandling: L.Browser.mobile
    });
    this.map.setMaxBounds(MAP_BOUNDS);
   

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

    //Add show and hide legend controls
    if (this.mapConfig.showLegend) {
      this.controls = new Controls(this);
      this.controls.init();
    }
  }

  createMapContent() {
    
    this.addBaseLayer();

    if (this.mapConfig.showMask) {
        if (this.mapConfig.maskGeoserverName){
          this.maskGeoserverName = this.mapConfig.maskGeoserverName;
        } else {
          this.maskGeoserverName = "boundaries:hackney_mask";
        }
      this.addMaskLayer(this.maskGeoserverName);
    }

    if (this.mapConfig.showBoundary) {
        if (this.mapConfig.boundaryGeoserverName){
          this.boundaryGeoserverName = this.mapConfig.boundaryGeoserverName;
        } else {
          this.boundaryGeoserverName = "boundaries:hackney";
        }
      this.addBoundaryLayer(this.boundaryGeoserverName);
    }
    
    //Load the layers
    new DataLayers(this).loadLayers();

    //Load the info and metadata
    new Metadata(this).loadMetadata();
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
  
  addMaskLayer(maskLayerName) {
    //The mask style is defined in Geoserver
    this.mask = L.tileLayer.wms(this.geoserver_wms_url, {
      layers: maskLayerName,
      transparent: true,
      tiled: true,
      format: "image/png"
    });
    this.map.addLayer(this.mask);
  }

  addBoundaryLayer(boundaryLayerName) {
    //The boundary style is defined in Geoserver
    this.boundary = L.tileLayer.wms(this.geoserver_wms_url, {
      layers: boundaryLayerName,
      transparent: true,
      tiled: true,
      format: "image/png"
    });
    this.map.addLayer(this.boundary);
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