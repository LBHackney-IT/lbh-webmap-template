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

function createTitle(mapTitle, mapAbstract, aboutTheData) {
  let titleBoxContent = "";
  let metadataBoxContent;
  let tooltip = "";
  let dataTooltip = "";

  const metadataWindow = L.control.window(map, {
    content: null,
    modal: false,
    position: "left",
    closeButton: true,
    maxWidth: 280
  });

  //on desktop
  if (!isMobile()) {
    if (aboutTheData) {
      dataTooltip =
        '<span class="datatooltip">About the data on this map</span>';
    }
    //with title
    if (mapTitle != "") {
      if (mapAbstract) {
        tooltip = `<span class="tooltip"><i class="fas fa-info-circle"></i><div class="tooltiptext">${mapAbstract}</div></span>`;
      }
      titleBoxContent = mapTitle + tooltip + "<br>" + dataTooltip;
    } else {
      if (aboutTheData) {
        titleBoxContent = dataTooltip;
      }
    }

    //Add box for title and metadata (if the box content is not empty)
    if (titleBoxContent !== "") {
      metadataWindow.content(
        `<center><b>About the data on this map:</b></center>${aboutTheData}`
      );
      return L.control.custom({
        id: "title",
        position: "topleft",
        collapsed: false,
        content: titleBoxContent,
        classes: "leaflet-control-layers map-title",
        style: {
          margin: "12px",
          padding: "12px",
          background: "white"
        },
        events: {
          click: function(data) {
            metadataWindow.show();
          }
        }
      });
    }
  } else {
    if (mapTitle) {
      metadataBoxContent = `<center><b>${mapTitle}</b><p>About the data on this map:</p></center>${aboutTheData}`;
    } else {
      metadataBoxContent = `<center><b>About the data on this map:</b></p></center>${aboutTheData}`;
    }

    //Add box for title and metadata (if the box content is not empty)
    if (metadataBoxContent != "") {
      metadataWindow.content(metadataBoxContent);
      return L.control.custom({
        id: "title",
        position: "topleft",
        collapsed: false,
        content: '<i class="fas fa-info-circle fa-2x"></i>',
        classes: "leaflet-control-layers map-title",
        style: {
          margin: "12px",
          padding: "8px",
          border: "none"
        },
        events: {
          click: function(data) {
            metadataWindow.show();
          }
        }
      });
    }
  }
}

export { pointToLayer, createTitle };
