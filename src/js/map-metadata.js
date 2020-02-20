import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet.markercluster";
import "leaflet-control-window";
import "leaflet-control-custom";
import { isMobile } from "./helpers/isMobile";

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
    position: "left",
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

export { pointToLayer, createTitle };
