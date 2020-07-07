import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet.markercluster";
import "leaflet-control-window";
import "leaflet-control-custom";
import { isMobile } from "../helpers/isMobile";
import "whatwg-fetch";

const pointToLayer = (
  latlng,
  markerType,
  markerIcon,
  markerColor,
  layerName
) => {
  if (markerType === "AwesomeMarker") {
    return L.marker(latlng, {
      icon: L.AwesomeMarkers.icon({
        icon: markerIcon,
        prefix: "fa",
        markerColor: markerColor,
        spin: false
      }),
      alt: layerName
    });
  } else if (markerType === "CircleMarker") {
    return L.circleMarker(latlng, {
      fillColor: markerColor,
      radius: 6,
      stroke: true,
      weight: 1,
      color: markerColor,
      fillOpacity: 0.6
    });
  } else {
    return L.marker(latlng);
  }
};

const createTitle = (map, mapTitle, mapSummary, aboutTheData) => {
  let titleBoxContent = null;
  let tooltip = "";
  let dataTooltip = "";
  let title = mapTitle && `<span class='metadata__name'>${mapTitle}</span>`;
  if (aboutTheData) {
    title += "About the data on this map:";
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

  if (aboutTheData) {
    dataTooltip =
      '<button class="lbh-link metadata__link">About the data</button>';
  }

  if (mapTitle) {
    if (mapSummary) {
      tooltip = `<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">${mapSummary}</div></span>`;
    }
    titleBoxContent = `<h2 class="lbh-heading-h6 metadata__title">${mapTitle}</h2>${tooltip}<br>${dataTooltip}`;
  } else if (aboutTheData) {
    titleBoxContent = dataTooltip;
  }

  //Add box for title and metadata (if the box content is not empty)
  if (titleBoxContent) {
    metadataWindow.content(aboutTheData);
    return L.control.custom({
      id: "title",
      position: "bottomright",
      collapsed: false,
      content: `<span class="metadata__title-box--mobile"><i class="fas fa-info-circle fa-2x"></i></span><span class="metadata__title-box--desktop">${titleBoxContent}</span>`,
      classes: "leaflet-control-layers metadata__title-box",
      events: {
        click: () => {
          if (isMobile() || aboutTheData) {
            return metadataWindow.show();
          }
        }
      }
    }); 
  } 
};

const createTitleFullscreen = (map, mapTitle, mapSummary, aboutTheData) => {
  let titleBoxContent = null;
  let tooltip = "";
  let dataTooltip = "";
  let title = mapTitle && `<span class='metadata__name'>${mapTitle}</span>`;
  if (aboutTheData) {
    title += "About the data on this map:";
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

  if (aboutTheData) {
    dataTooltip =
      '<button class="lbh-link metadata__link">About the data</button>';
  }

  if (mapTitle) {
    if (mapSummary) {
      tooltip = `<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">${mapSummary}</div></span>`;
    }
    titleBoxContent = `<h2 class="lbh-heading-h6 metadata__title">${mapTitle}</h2>${tooltip}<br>${dataTooltip}`;
  } else if (aboutTheData) {
    titleBoxContent = dataTooltip;
  }

  //Add box for title and metadata (if the box content is not empty)
  if (titleBoxContent) {
    metadataWindow.content(aboutTheData);
    return L.control.custom({
      id: "title",
      position: "topright",
      collapsed: false,
      content: `<span class="metadata__title-box--mobile"><i class="fas fa-info-circle fa-2x"></i></span><span class="metadata__title-box--desktop">${titleBoxContent}</span>`,
      classes: "leaflet-control-layers metadata__title-box",
      events: {
        click: () => {
          if (isMobile() || aboutTheData) {
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

  addMetadata(data, mapTitle, mapSummary) {
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

    const control = createTitle(this.map, mapTitle, mapSummary, metadataText);
    control.addTo(this.map);
    if(this.isFullScreen){
      L.control.zoom({ position: "topright" }).addTo(this.map);
    } 
  }

  loadMetadata() {
    const mapTitle = this.mapConfig.title;
    const mapSummary = this.mapConfig.summary;
    let aboutTheData = this.mapConfig.aboutTheData;
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
        "https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName=metadata:public_metadata&outputFormat=json&cql_filter=layer_name IN (" +
        cqlValues +
        ")";

      fetch(url, {
        method: "get"
      })
        .then(response => response.json())
        .then(data => this.addMetadata(data, mapTitle, mapSummary));
    } else if (aboutTheData) {
      aboutTheData = `<div class="metadata__feature"><p class="lbh-body-xs">${aboutTheData}</p></div>`;
      if(this.isFullScreen){
        control = createTitleFullscreen(this.map, mapTitle, mapSummary, null);
        if (control) {
          control.addTo(this.map);
        }
        L.control.zoom({ position: "topright" }).addTo(this.map);
      } else{
      control = createTitle(this.map, mapTitle, mapSummary, aboutTheData);
      if (control) {
        control.addTo(this.map);
      }
      }
    } else if (mapTitle) {
      if(this.isFullScreen){
        control = createTitleFullscreen(this.map, mapTitle, mapSummary, null);
        if (control) {
          control.addTo(this.map);
        }
        L.control.zoom({ position: "topright" }).addTo(this.map);
      } else{
        control = createTitle(this.map, mapTitle, mapSummary, null);
        if (control) {
          control.addTo(this.map);
        }

      }
     
    }
  }
}

export default Metadata;
export { pointToLayer, createTitle };
