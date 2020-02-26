import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet.markercluster";
import "leaflet-control-window";
import "leaflet-control-custom";

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

const createTitle = (map, mapTitle, mapAbstract, aboutTheData) => {
  let titleBoxContent = "";
  let metadataBoxContent;
  let tooltip = "";
  let dataTooltip = "";

  const metadataWindow = L.control.window(map, {
    title: `<span class='metadata__name'>${mapTitle}</span>About the data on this map:`,
    content: null,
    modal: false,
    position: "topLeft",
    closeButton: true,
    maxWidth: 280,
    className: "control-window metadata__window"
  });

  //on desktop
  if (aboutTheData) {
    dataTooltip =
      '<button class="lbh-link metadata__link">About the data on this map</button>';
  }
  //with title
  if (mapTitle != "") {
    if (mapAbstract) {
      tooltip = `<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">${mapAbstract}</div></span>`;
    }
    titleBoxContent = `<h2 class="lbh-heading-h6 metadata__title">${mapTitle}</h2>${tooltip}<br>${dataTooltip}`;
  } else {
    if (aboutTheData) {
      titleBoxContent = dataTooltip;
    }
  }

  //Add box for title and metadata (if the box content is not empty)
  if (metadataBoxContent != "" || titleBoxContent !== "") {
    metadataWindow.content(aboutTheData);
    return L.control.custom({
      id: "title",
      position: "topleft",
      collapsed: false,
      content: `<span class="metadata__title-box--mobile"><i class="fas fa-info-circle fa-2x"></i></span><span class="metadata__title-box--desktop">${titleBoxContent}</span>`,
      classes: "leaflet-control-layers metadata__title-box",
      events: {
        click: () => metadataWindow.show()
      }
    });
  }
};

class Metadata {
  constructor(map) {
    this.mapConfig = map.mapConfig;
    this.map = map.map;
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
    } else if (mapTitle || aboutTheData) {
      control = createTitle(this.map, mapTitle, mapAbstract, null);
      if (control) {
        control.addTo(this.map);
      }
    }
  }
}

export default Metadata;
export { pointToLayer, createTitle };
