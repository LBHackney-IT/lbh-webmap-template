import {
  CONTROLS_OPEN_CLASS,
  CONTROLS_SHOW_LEGEND_TEXT,
  CONTROLS_HIDE_LEGEND_TEXT,
  CONTROLS_CLEAR_MAP_TEXT
} from "./consts.js";
import { isMobile } from "../helpers/isMobile.js";
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
    // this.allowLegendTabbing()
    this.createMarkup();
    
    //TODO: test if fullscreen mode and use the different markup createMarkupFullScreen()

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
    this.showHiddenSkipMapContentBtn(false)

  }

 
  createMarkup() {
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
          <div class="legend">
            <div id="legend" class="legend"></div>
            <a href="#custom-zoom-control-in" class="govuk-skip-link lbh-skip-link">Skip Map Content</a>
          </div>
        </sidebar>
        <sidebar class="controls_hidden_skip" id="controls_hidden_skip">
            <a href="#custom-zoom-control-in" class="govuk-skip-link lbh-skip-link">Skip Map Content</a>
        </sidebar>
      </div>
    `;
    this.mapClass.addMarkupToTop(html, "controls", "controls");
  
  }

  createMarkupFullScreen() {
    //TODO: adapt this markup for full screen mode. For the moment, only the default markup is used.
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
          <a href="#custom-zoom-control-in" class="govuk-skip-link lbh-skip-link">Skip Map Content</a>
          <div id="controls-toggle" class="legend_toggle_hamburger_button">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </sidebar>
        <sidebar class="controls_hidden_skip" id="controls_hidden_skip">
            <a href="#custom-zoom-control-in" class="govuk-skip-link lbh-skip-link">Skip Map Content</a>
        </sidebar>
      </div>    
    `;
    this.mapClass.addMarkupToTop(html, "controls", "controls");
  }


  toggleClearButton() {
    this.map.on("layeradd", () => {
      if (! this.mapConfig.blockInteractiveLegend){
        this.showClearButton()
        }
      }
    );
    
    this.map.on("layerremove", () => {
      let count = 0;
      this.map.eachLayer(() => (count += 1));
      if (count == 2) {
        this.hideClearButton()
      }
    });
  }

  showClearButton() {
    this.clear.style.display = "block";
  }

  hideClearButton() {
    this.clear.style.display = "none";
  }

  toggleControls() {
    if (this.controls.classList.contains(CONTROLS_OPEN_CLASS)) {
      this.closeControls();
      this.allowLegendTabbing()
    } else {
      this.allowLegendTabbing()
      setTimeout(()=>this.openControls(),50)
      // this.openControls();
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
  allowLegendTabbing(){
    
    // let legend = document.getElementById('legend')
    const sidebar = document.querySelectorAll('.controls__sidebar')[0];
    // console.log('SIDEBAR',sidebar)
    const attribute = 'style'
    if(sidebar.hasAttribute(attribute)){
      sidebar.removeAttribute(attribute)
      this.showHiddenSkipMapContentBtn(false)
      // document.getElementById("controls_hidden_skip").setAttribute(attribute,"display:none")
    }else{
      setTimeout(()=>sidebar.setAttribute(attribute,"display:none"),300)
      this.showHiddenSkipMapContentBtn(true)
    }
  }

  showHiddenSkipMapContentBtn(isShowing){
    document.getElementById("controls_hidden_skip").setAttribute('style',`display:${isShowing?'block':'none'}`)
  }
}

export default Controls;
