import { LEGEND_OPEN_CLASS } from "./map-consts";
import { isMobile } from "./helpers/isMobile";

const LEGEND_MARKUP = `
  <button id="map-toggle" class="map-controls__sidebar-toggle">
      <i class="fal fa-sliders-h map-controls__sidebar-toggle-icon"></i>
      <span class="map-controls__sidebar-toggle-text map-controls__sidebar-toggle-text--hide">Hide list</span>
      <span class="map-controls__sidebar-toggle-text map-controls__sidebar-toggle-text--show">Show list</span>
  </button>
  <button id="map-clear" class="map-controls__clear" style="display:none">
      <i class="fal fa-times map-controls__clear-icon"></i>
      <span class="map-controls__clear-text">Clear map</span>
  </button>
  <div class="container container__mask">
      <sidebar class="map-controls__sidebar">
          <div id="map-legend" class="map-legend"></div>
      </sidebar>
  </div>
`;

class Legend {
  constructor(mapClass) {
    this.mapClass = mapClass;
    this.map = mapClass.map;
    this.container = mapClass.container;
    this.controls = null;
    this.toggle = null;
    this.clear = null;
  }

  init() {
    this.addControls();
    this.controls = document.getElementById("map-controls");
    this.toggle = document.getElementById("map-toggle");
    this.clear = document.getElementById("map-clear");
    this.toggle.addEventListener("click", this.toggleControls.bind(this));

    if (!isMobile()) {
      this.openControls();
    }

    this.map.addEventListener("click", this.closeIfMobile.bind(this));
    this.clear.addEventListener("click", () => {
      this.closeIfMobile();
      this.mapClass.clear();
    });
  }

  addControls() {
    const controls = document.createElement("section");
    controls.setAttribute("id", "map-controls");
    controls.classList.add("map-controls");
    controls.innerHTML = LEGEND_MARKUP;
    this.container.insertBefore(controls, this.container.firstChild);
  }

  toggleControls() {
    if (this.controls.classList.contains(LEGEND_OPEN_CLASS)) {
      this.closeControls();
    } else {
      this.openControls();
    }
  }

  closeControls() {
    this.controls.classList.remove(LEGEND_OPEN_CLASS);
  }

  openControls() {
    this.controls.classList.add(LEGEND_OPEN_CLASS);
  }

  closeIfMobile() {
    if (isMobile()) {
      this.closeControls();
    }
  }
}

export default Legend;
