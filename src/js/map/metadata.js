import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet.markercluster";
import "leaflet-control-window";
import "leaflet-control-custom";
import { isMobile } from "../helpers/isMobile.js";
import "whatwg-fetch";


const createTitle = (map, mapTitle, mapSummary, about, aboutTitle, showTitleInMetadataBoxOnMobile) => {
  let titleBoxContent = null;
  let tooltip = "";
  let dataTooltip = "";
  let title ="";
  //We want to decide if we show the title on the info icon on mobile. 
  if (isMobile()){
      if (showTitleInMetadataBoxOnMobile){
        //title = mapTitle && `<span class='metadata__name'>${mapTitle}</span>`;
        title = `<span class='metadata__name'>${mapTitle}</span>`;
      } 
  } else {
    if (mapTitle){
      title = mapTitle && `<span class='metadata__name'>${mapTitle}</span>`;
    } else {
      title = "";
    }
  }

  if (aboutTitle) {
    title += `${aboutTitle}:`;
    dataTooltip = `<button aria-label="Open map about details" class="lbh-link metadata__link">${aboutTitle}</button>`;
  }
  const metadataWindow = L.control.window(map, {
    title,
    content: null,
    modal: false,
    position: "bottomRight",
    closeButton: true,
    maxWidth: 280,
    className: "control-window metadata__window"
  });

  if (mapTitle) {
    if (mapSummary) {
      tooltip = `<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">${mapSummary}</div></span>`;
    }
    titleBoxContent = `<h2 class="lbh-heading-h6 metadata__title">${mapTitle}</h2>${tooltip}<br>${dataTooltip}`;
  } else if (about) {
    titleBoxContent = dataTooltip;
  }

  //Add box for title and metadata (if the box content is not empty)
  if (titleBoxContent) {
    metadataWindow.content(about);
    return L.control.custom({
      id: "title",
      position: "bottomright",
      collapsed: false,
      content: `<span class="metadata__title-box--mobile"><i class="fas fa-info-circle fa-2x"></i></span><span class="metadata__title-box--desktop">${titleBoxContent}</span>`,
      classes: "leaflet-control-layers metadata__title-box",
      events: {
        click: () => {
          if (isMobile() || about) {
            return metadataWindow.show();
          }
        }
      }
    }); 
  } 
};

const createTitleFullscreen = (map, mapTitle, mapSummary, about, aboutTitle, showTitleInMetadataBoxOnMobile) => {
  let titleBoxContent = null;
  let tooltip = "";
  let dataTooltip = "";
  let title ="";
  
  //We want to decide if we show the title on the info icon on mobile. 
  if (isMobile()){
      if (showTitleInMetadataBoxOnMobile){
        //title = mapTitle && `<span class='metadata__name'>${mapTitle}</span>`;
        title = `<span class='metadata__name'>${mapTitle}</span>`;
      } 
  } else {
    if (mapTitle){
      title = mapTitle && `<span class='metadata__name'>${mapTitle}</span>`;
    } 
  }
  if (aboutTitle) {
    title += `${aboutTitle}:`;
    dataTooltip = `<button aria-label="Open map about details" class="lbh-link metadata__link">${aboutTitle}</button>`;
  }
  const metadataWindow = L.control.window(map, {
    title,
    content: null,
    modal: false,
    position: "topRight",
    closeButton: true,
    maxWidth: 280,
    className: "control-window metadata__window__fullscreen"
  });

  if (mapTitle) {
    if (mapSummary) {
      tooltip = `<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">${mapSummary}</div></span>`;
    }
    titleBoxContent = `<h2 class="lbh-heading-h6 metadata__title">${mapTitle}</h2>${tooltip}<br>${dataTooltip}`;
  } else if (about) {
    titleBoxContent = dataTooltip;
  }

  //Add box for title and metadata (if the box content is not empty)
  if (titleBoxContent) {
    metadataWindow.content(about);
    return L.control.custom({
      id: "title",
      position: "topright",
      collapsed: false,
      content: `<span class="metadata__title-box--mobile"><i class="fas fa-info-circle fa-2x"></i></span><span class="metadata__title-box--desktop">${titleBoxContent}</span>`,
      classes: "leaflet-control-layers metadata__title-box",
      events: {
        click: () => {
          if (isMobile() || about) {
            return metadataWindow.show();
          }
        }
      }
    }); 
  } 
};

class Metadata {
  constructor(map) {
    this.mapConfig = map.mapConfig;
    this.map = map.map;
    this.isFullScreen = map.isFullScreen;
  }

  addMetadata(data, mapTitle, mapSummary, aboutTitle, showTitleInMetadataBoxOnMobile) {
    let metadataText = "";
    
    for (const feature of data.features) {
      metadataText += `<div tabindex="0" class="metadata__feature"><h3 class="lbh-heading-h6">${feature.properties.title}</h3>`;
      if (feature.properties.abstract) {
        metadataText += `<p tabindex="0" class="lbh-body-xs">${feature.properties.abstract}</p>`;
      }
      metadataText += `<p tabindex="0" class="lbh-body-xs"><b>Source:</b> ${feature.properties.source}<br></p>`;
      if (feature.properties.lastupdatedate_textual) {
        metadataText += `<p tabindex="0" class="lbh-body-xs"><b>Last updated:</b> ${feature.properties.lastupdatedate_textual}</p>`;
      }
      metadataText += "</div>";
    }

    if(this.isFullScreen){
      const control = createTitleFullscreen(this.map, mapTitle, mapSummary, metadataText,aboutTitle, showTitleInMetadataBoxOnMobile);
      control.addTo(this.map);
      // if (!L.Browser.mobile){
      //   L.control.zoom({ position: "topright" }).addTo(this.map);
      // }
    } else {
      const control = createTitle(this.map, mapTitle, mapSummary, metadataText, aboutTitle, showTitleInMetadataBoxOnMobile);
      control.addTo(this.map);
      // const control = createTitleFullscreen(this.map, mapTitle, mapSummary, metadataText, aboutTitle);
      //   if (control) {
      //     control.addTo(this.map);
      //   }
      //   if (!L.Browser.mobile){
      //     L.control.zoom({ position: "topright" }).addTo(this.map);
      //   }
    }
    
   
  }

  loadMetadata() {
    const mapTitle = this.mapConfig.title;
    const mapSummary = this.mapConfig.summary;
    //let aboutTheData = this.mapConfig.aboutTheData;
    let about = this.mapConfig.about;
    let aboutTitle = this.mapConfig.aboutTitle;
    let showTitleInMetadataBoxOnMobile = this.mapConfig.showTitleInMetadataBoxOnMobile;
    let control;

    //load metadata from geoserver
    if (
      this.mapConfig.showGeoServerMetadata &&
      this.mapConfig.layers.length > 0
    ) {
      const cqlValues = this.mapConfig.layers
        .map(i => `'${i.geoserverLayerName}'`)
        .toString();

      const url =
        "https://map2.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName=metadata:public_metadata&outputFormat=json&cql_filter=layer_name IN (" +
        cqlValues +
        ")";

      fetch(url, {
        method: "get"
      })
        .then(response => response.json())
        .then(data => this.addMetadata(data, mapTitle, mapSummary, aboutTitle, showTitleInMetadataBoxOnMobile));
      } else if (about) {
        about = `<div tabindex="0" class="metadata__feature"><p class="lbh-body-xs">${about}</p></div>`;
        if(this.isFullScreen){
        control = createTitleFullscreen(this.map, mapTitle, mapSummary, about, aboutTitle, showTitleInMetadataBoxOnMobile);
        if (control) {
          control.addTo(this.map);
        }
        // if (!L.Browser.mobile){
        //   L.control.zoom({ position: "topright" }).addTo(this.map);
        // }
      } else {
        control = createTitle(this.map, mapTitle, mapSummary, about, aboutTitle, showTitleInMetadataBoxOnMobile);
        if (control) {
          control.addTo(this.map);
        }
      }
      } else if (mapTitle) {
      if(this.isFullScreen){
        control = createTitleFullscreen(this.map, mapTitle, mapSummary, null, null, showTitleInMetadataBoxOnMobile);
        if (control) {
          control.addTo(this.map);
        }
        // if (!L.Browser.mobile){
        //   L.control.zoom({ position: "topright" }).addTo(this.map);
        // }
      } else{
        control = createTitle(this.map, mapTitle, mapSummary, null, null, showTitleInMetadataBoxOnMobile);
        if (control) {
          control.addTo(this.map);
        }

      }
     
    }
  }
}

export default Metadata;
export { createTitle };
