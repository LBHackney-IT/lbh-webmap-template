import {
  CONTROLS_OPEN_CLASS,
  CONTROLS_SHOW_LEGEND_TEXT,
  CONTROLS_HIDE_LEGEND_TEXT,
  CONTROLS_CLEAR_MAP_TEXT
} from "./consts";
import { isMobile } from "../helpers/isMobile";

class Controls {
  constructor(mapClass) {
    this.mapClass = mapClass;
    this.map = mapClass.map;
    this.container = mapClass.container;
    this.controls = null;
    this.toggle = null;
    this.clear = null;
    this.controlsText = null;
    this.mapConfig = this.mapClass.mapConfig;
    this.isOpen = false;
  }

  init() {
    this.createMarkup();
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

    this.toggleClearButton();
  }

  createMarkup() {
    this.controlsText = `
      <button id="map-toggle" class="map-controls__sidebar-toggle">
          <i class="fal fa-sliders-h map-controls__sidebar-toggle-icon"></i>
          <span class="map-controls__sidebar-toggle-text map-controls__sidebar-toggle-text--hide">${(this
            .mapConfig.controlsText &&
            this.mapConfig.controlsText.hideLegendText) ||
            CONTROLS_HIDE_LEGEND_TEXT}</span>
          <span class="map-controls__sidebar-toggle-text map-controls__sidebar-toggle-text--show">${(this
            .mapConfig.controlsText &&
            this.mapConfig.controlsText.showLegendText) ||
            CONTROLS_SHOW_LEGEND_TEXT}</span>
      </button>
      <button id="map-clear" class="map-controls__clear" style="display:none">
          <i class="fal fa-times map-controls__clear-icon"></i>
          <span class="map-controls__clear-text">${(this.mapConfig
            .controlsText &&
            this.mapConfig.controlsText.clearMapText) ||
            CONTROLS_CLEAR_MAP_TEXT}</span>
      </button>
      <div class="container container__mask">
          <sidebar class="map-controls__sidebar">
              <div id="map-legend" class="map__legend"></div>
          </sidebar>
      </div>
    `;
  }

  toggleClearButton() {
    this.map.on("layeradd", () => this.showClearButton());
    this.map.on("layerremove", () => {
      let count = 0;
      this.map.eachLayer(() => (count += 1));
      if (count == 2) {
        this.clear.style.display = "none";
      }
    });
  }

  showClearButton() {
    this.clear.style.display = "block";
  }

  addControls() {
    const controls = document.createElement("section");
    controls.setAttribute("id", "map-controls");
    controls.classList.add("map-controls");
    controls.innerHTML = this.controlsText;
    this.container.insertBefore(controls, this.container.firstChild);
  }

  toggleControls() {
    if (this.controls.classList.contains(CONTROLS_OPEN_CLASS)) {
      this.closeControls();
    } else {
      this.openControls();
    }
  }

  closeControls() {
    this.controls.classList.remove(CONTROLS_OPEN_CLASS);
    this.isOpen = false;
  }

  openControls() {
    this.controls.classList.add(CONTROLS_OPEN_CLASS);
    this.isOpen = true;
  }

  closeIfMobile() {
    if (isMobile()) {
      this.closeControls();
    }
  }
}

export default Controls;
