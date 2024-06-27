
import L, { icon } from "leaflet";
import "proj4leaflet";
import {getWFSurl, getWMSurl} from "../helpers/hackneyGeoserver.js";
import {isMobile,isMobile as isMobileFn,mobileDesktopSwitch} from "../helpers/isMobile.js";
import "leaflet-easybutton";
import "leaflet-control-custom";
import "leaflet-control-window";
import "leaflet-search";
import "leaflet-geometryutil";
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
} from "./consts.js";
import OS_RASTER_API_KEY  from "../helpers/osdata.js";
import "@fortawesome/fontawesome-pro/js/solid.js";
import "@fortawesome/fontawesome-pro/js/regular.js";
import "@fortawesome/fontawesome-pro/js/fontawesome.js";
import Geolocation from "./geolocation.js";
import Controls from "./controls.js";
import DataLayers from "./data-layers.js";
import VectorTileDataLayers from "./vector-tile-data-layers.js";
import Metadata from "./metadata.js";
import "classlist-polyfill";
import SpatialEnrichment from "./spatial-enrichment.js";

class Map {
  constructor(map) {
    this.map = map;
    this.container = map.parentElement.parentElement;
    this.dataFolder = null;
    this.mapConfig = null;
    this.configUrl = null;
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
    this.minZoom = null;
    this.isFullScreen = false;
    this.uprn = null;
    this.blpuMarker = null;
    this.blpuPolygon = null;
    this.geoserver_wfs_url = getWFSurl();
    this.geoserver_wms_url = getWMSurl();
  }

  init() {
    // this.getDataName();
    this.getConfigUrl();
    //this.getGeoserverURLsFromHostname();

    // Tell leaflet where to look for our images
    L.Icon.Default.prototype.options.imagePath = "../images/";

    // fetch(this.dataFolder + "/map-definition.json", {
    //   method: "get"
    // })
    fetch(this.configUrl, {
      method: "get"
    })
      .then(response => response.json())
      .then(data => {
        this.mapConfig = JSON.parse(data.features[0].properties.json);
        //this.mapConfig = data;
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
  
  getConfigUrl() {
    const pathname = window.location.pathname;
    const paths = pathname.split("/");
    const cqlFilter = `config_title='${paths[paths.length - 2]}'`;
    this.configUrl = `${this.geoserver_wfs_url}webmap_backend:data_repository&propertyname=json&cql_filter=${cqlFilter}`;
    this.isEmbed = paths[paths.length - 1] === "embed.html";
    this.isFullScreen = paths[paths.length - 1] === "fullscreen" || paths[paths.length - 1] === "fullscreen.html";
  }


  createMap() {
    //set the max zoom if blockZoomToMasterMap is true to block the detailed view. By default, the max zoom is 12 and zoom to MasterMap.
     if (this.mapConfig.blockZoomToMasterMap){
      this.maxZoom = 9;
    } else {
      this.maxZoom = 12;
    }

     //set the minZoom level.
     if (this.mapConfig.minMapZoom){
      this.minZoom = this.mapConfig.minMapZoom;
    } else {
      this.minZoom = MIN_ZOOM;
    }

    //gesture handler
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
    
    //Set up the EPSG3857 if it is a vectorTile Layer
    if(this.mapConfig.layers[0].vectorTilesLayer){
      //Adjust the zoom levels to EPSG3857
      this.zoom = this.zoom +7;
      this.maxZoom = this.maxZoom +7;
      this.minZoom = this.minZoom +7;
      this.zoom_mobile = this.zoom_mobile +7;

      this.map = L.map("map", {
        //crs: L.CRS.EPSG3857,
        zoomControl: false,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        center: this.centerDesktop,
        zoom: this.zoom,
        gestureHandling: L.Browser.mobile
      });
      this.map.setMaxBounds(MAP_BOUNDS);
    } else {
      //Setup the EPSG:27700 (British National Grid) projection only if it is not a vector tile layer
      var crs = new L.Proj.CRS('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs', {
        resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
        origin: [ -238375.0, 1376256.0 ]
      });
      this.map = L.map("map", {
        crs: crs,
        zoomControl: false,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        center: this.centerDesktop,
        zoom: this.zoom,
        gestureHandling: L.Browser.mobile
      });
      this.map.setMaxBounds(MAP_BOUNDS);
    }
    
   
    
    // Do not add the zoom and the other buttons yet if it is fullscreen so we can have the right elements order. 
    // Disable zoom and other buttons specifically on mobile devices, not based on screensize.
     if (!L.Browser.mobile && !this.isFullScreen) {
      L.control.zoom({ position: "topright" }).addTo(this.map);
      let zoomControlElement = document.querySelector('.leaflet-control-zoom-in');
      // Assign an ID to the zoom control element
      zoomControlElement.id = 'custom-zoom-control-in';
    } 
    // Add reset button specifically on non-mobile devices, not based on screensize.
    if (this.mapConfig.showResetZoomButton && !L.Browser.mobile && !this.isFullScreen) {
      this.addResetButton();
    }
     //Add fullscreen button specifically on non-mobile devices, not based on screensize.
     if (this.mapConfig.showFullScreenButton && !this.isFullScreen) {
      this.addFullScreenButton();
    }

    //Add geolocation button specifically on non-mobile devices, not based on screensize.
    if (this.mapConfig.showLocateButton) {
      new Geolocation(
        this.map,
        this.errorNoLocation,
        this.errorOutsideHackney
      ).init();
    }

    //Add pickCoordinatesbutton
    if (this.mapConfig.showPickCoordinatesButton) {
      this.addPickCoordinatesButton();
    }

    //Add show and hide legend controls
    if (this.mapConfig.showLegend) {
      this.controls = new Controls(this);
      this.controls.init();
    }
    //.log(this.map);
    if (this.mapConfig.hideLegendOnLoad) {
      let controls_toggle = document.getElementById("controls-toggle")
      if(controls_toggle){
        controls_toggle.click()
      }
    }
  }

  createMapContent() {
    //first, load base map 
    this.addBaseLayer();

    //then, add mask and boundary
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
    //prepare flag for spatial enrichments if necessary
    if (this.mapConfig.spatialEnrichmentRequired) {
      this.spatialEnrichments = new SpatialEnrichment(this);
      //this.spatialEnrichments.loadGeographyLayers();
    }
    //Add the layers from config
    if (this.mapConfig.layers[0].vectorTilesLayer){
      new VectorTileDataLayers(this).loadLayers();
    } 
    else {
      new DataLayers(this).loadLayers();
    }
    //Last, load the info and metadata
    new Metadata(this).loadMetadata();
    //Add the zoom and other buttons in fullscreen to have the right order. 
    if (!L.Browser.mobile && this.isFullScreen){
      L.control.zoom({ position: "topright" }).addTo(this.map);
    }
    if (this.mapConfig.showResetZoomButton && !L.Browser.mobile && this.isFullScreen) {
      this.addResetButton();
    }
    if (this.mapConfig.showLocateButton && !L.Browser.mobile && this.isFullScreen) {
      new Geolocation(
        this.map,
        this.errorNoLocation,
        this.errorOutsideHackney
      ).init();
    }
  }

  addBaseLayer() {
    var epsg_code = '27700'
    if (this.mapConfig.layers[0].vectorTilesLayer){
      //console.log('vector tiles');
      epsg_code = '3857';
    } 
    //console.log(epsg_code);
    if (this.mapConfig.baseStyle == "OSoutdoor") {
      this.mapBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Outdoor_${epsg_code}/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    } else if (this.mapConfig.baseStyle == "OSlight") {
      this.mapBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Light_${epsg_code}/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
        TILE_LAYER_OPTIONS_OS
      );
    } else if (this.mapConfig.baseStyle == "OSroad") {
      this.mapBase = L.tileLayer(
        `https://api.os.uk/maps/raster/v1/zxy/Road_${epsg_code}/{z}/{x}/{y}.png?key=${OS_RASTER_API_KEY}`,
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
      "far fa-magnifying-glass-location",
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
      "Zoom to Hackney extent",
      { position: "topright" }
    ).addTo(this.map);
  }

  addFullScreenButton() {
    L.easyButton(
      "far fa-arrows-maximize",
      // "fa-expand",
      // "fa-maximize",
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

  addPickCoordinatesButton() {
    const pickCoordinates = (e) => {     
      console.log('pick from map');
      var coordtext = e.latlng.lat.toFixed(10) + ", " + e.latlng.lng.toFixed(10);
      var popup = L.popup({maxWidth: 210});
      popup.setLatLng(e.latlng);
      popup.setContent("The coordinates</br>[" + coordtext + "]</br>have been copied to clipboard.<p>To pick another location, close this popup and click again on the 'Pick and copy coordinates' tool.</p>");
      popup.addTo(this.map);
      
      // Copy to clipboard by creating a dummy text field
      var dummy = document.createElement("input");
      document.body.appendChild(dummy);
      dummy.value = (coordtext);
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      
      this.map.off('click', pickCoordinates);
      L.DomUtil.removeClass(this.map._container,'leaflet-crosshair');
      //set normal interactions back
      this.map.eachLayer(function(layer) {
        layer.closePopup();
        layer.off('click', pickCoordinates);
      });
      pickCoordinatesButton.state('inactive');
    };
    
    const pickCoordinatesButton = L.easyButton({
      position: "topright",
      states: [{
        stateName: 'inactive', 
        icon:      'fa-regular fa-bullseye-pointer',
        title:     'Pick coordinates from map',
        onClick: (btn) => {       
          btn.state('active');
          L.DomUtil.addClass(this.map._container,'leaflet-crosshair');
          //Add a listener to all the layers
          this.map.eachLayer(function(layer) {
            layer.on('click', pickCoordinates);
          });
          //Add a listener to the map
          this.map.on('click', pickCoordinates);
        }
      },{
        stateName: 'active',
        icon:      'fa-solid fa-bullseye-pointer',
        title:     'Pick coordinates from map'
      }]
    }).addTo(this.map);
  }

  addMarkupToTop(markup, id, className) {
    const element = document.createElement("section");
    element.setAttribute("id", id);
    element.classList.add(className);
    element.innerHTML = markup;
    console.log(this.container);
    this.container.insertBefore(element, this.container.firstChild);
  }

  addMarkupJustAboveMap(markup, id, className) {
    const element = document.createElement("section");
    element.setAttribute("id", id);
    element.classList.add(className);
    element.innerHTML = markup;
    this.container.insertBefore(element, document.getElementById("controls"));
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