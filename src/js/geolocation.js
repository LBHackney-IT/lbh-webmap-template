import L from "leaflet";
import { HACKNEY_BOUNDS_1, HACKNEY_BOUNDS_2 } from "./map-consts";

class Geolocation {
  constructor(map, errorNoLocation, errorOutsideHackney) {
    this.map = map;
    this.errorNoLocation = errorNoLocation;
    this.errorOutsideHackney = errorOutsideHackney;
  }

  init() {
    L.easyButton(
      "fa-location",
      () => {
        this.map.on("locationfound", this.onLocationFound.bind(this));

        this.map.locate({
          setView: false,
          timeout: 5000,
          maximumAge: 0,
          maxZoom: 16
        });
      },
      "Show me where I am",
      { position: "topright" }
    ).addTo(this.map);

    this.map.on("locationerror", () => {
      alert(this.errorNoLocation);
    });
  }

  onLocationFound(e) {
    if (this.locateCircle != null) {
      this.map.removeLayer(this.locateCircle);
    }

    this.locateCircle = L.circleMarker(e.latlng).addTo(this.map);

    const hackneyBounds = L.bounds(HACKNEY_BOUNDS_1, HACKNEY_BOUNDS_2);
    if (hackneyBounds.contains([e.latlng.lat, e.latlng.lng])) {
      this.map.setView([e.latlng.lat, e.latlng.lng], 16);
    } else {
      alert(this.errorOutsideHackney);
      this.map.setZoom();
    }
    //stop listening
    this.map.off("locationfound", this.onLocationFound.bind(this));
  }
}

export default Geolocation;
