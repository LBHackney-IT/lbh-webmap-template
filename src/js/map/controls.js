import {
  CONTROLS_OPEN_CLASS,
  CONTROLS_SHOW_LEGEND_TEXT,
  CONTROLS_HIDE_LEGEND_TEXT,
  CONTROLS_CLEAR_MAP_TEXT
} from "./consts";
import { isMobile } from "../helpers/isMobile";
import "classlist-polyfill";

class Controls {
  constructor(mapClass) {
    this.mapClass = mapClass;
    this.map = mapClass.map;
    this.controls = null;
    this.toggle = null;
    this.clear = null;
    this.mapConfig = this.mapClass.mapConfig;
    this.isOpen = false;
  }

  init() {
    if (this.mapClass.isFullScreen){
      this.createMarkup();
    }
    else{
      this.createMarkup();
    }

    this.controls = document.getElementById("controls");
    this.toggle = document.getElementById("controls-toggle");
    this.clear = document.getElementById("map-clear");
    this.toggle.addEventListener("click", this.toggleControls.bind(this));  

    if (!isMobile()) {
      this.openControls();
    }

    this.map.addEventListener("click", this.closeIfMobile.bind(this));
    if (this.clear){
      this.clear.addEventListener("click", () => {
        this.closeIfMobile();
        this.mapClass.clear();
      });
      this.toggleClearButton();
    }
  }

  createMarkup() {
    //check if we are in fullscreen mode. Different mark up is used
    const html = `
      <button id="controls-toggle" class="controls__sidebar-toggle">
        <i class="fa-regular fa-sliders controls__sidebar-toggle-icon"></i>
        <span class="controls__sidebar-toggle-text controls__sidebar-toggle-text--hide">${(this
          .mapConfig.controlsText &&
          this.mapConfig.controlsText.hideLegendText) ||
          CONTROLS_HIDE_LEGEND_TEXT}</span>
        <span class="controls__sidebar-toggle-text controls__sidebar-toggle-text--show">${(this
          .mapConfig.controlsText &&
          this.mapConfig.controlsText.showLegendText) ||
          CONTROLS_SHOW_LEGEND_TEXT}</span>
      </button>
      <button id="map-clear" class="controls__clear" style="display:none">
        <i class="fa-regular fa-xmark controls__clear-icon"></i>
        <span class="controls__clear-text">${(this.mapConfig.controlsText &&
          this.mapConfig.controlsText.clearMapText) ||
          CONTROLS_CLEAR_MAP_TEXT}</span>
      </button>
      <div class="container container__mask"> 
        <sidebar class="controls__sidebar">
          <div id="legend" class="legend"></div>
        </sidebar>
      </div>
    `;
    this.mapClass.addMarkupToMap(html, "controls", "controls");
  }

  createMarkupFullScreen() {
    //check if we are in fullscreen mode. Different mark up is used
    const html = `
    <button id="controls-toggle" class="controls__sidebar-toggle">
    <i class="fal fa-sliders-h controls__sidebar-toggle-icon"></i>
    <span class="controls__sidebar-toggle-text controls__sidebar-toggle-text--hide">${(this
      .mapConfig.controlsText &&
      this.mapConfig.controlsText.hideLegendText) ||
      CONTROLS_HIDE_LEGEND_TEXT}</span>
    <span class="controls__sidebar-toggle-text controls__sidebar-toggle-text--show">${(this
      .mapConfig.controlsText &&
      this.mapConfig.controlsText.showLegendText) ||
      CONTROLS_SHOW_LEGEND_TEXT}</span>
  </button>
  <button id="map-clear" class="controls__clear" style="display:none">
    <i class="fal fa-times controls__clear-icon"></i>
    <span class="controls__clear-text">${(this.mapConfig.controlsText &&
      this.mapConfig.controlsText.clearMapText) ||
      CONTROLS_CLEAR_MAP_TEXT}</span>
  </button>  
    <div class="container container__mask">  
        <sidebar class="controls__sidebar">
          <div id="legend" class="legend"></div>
          <div id="controls-toggle" class="legend_toggle_hamburger_button">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </sidebar>
      </div>    
    `;
    this.mapClass.addMarkupToMap(html, "controls", "controls");
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
