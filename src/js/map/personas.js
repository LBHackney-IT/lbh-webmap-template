import { scrollTo } from "../helpers/scrollTo";
import { PERSONA_ACTIVE_CLASS } from "./consts";
import "classlist-polyfill";

class Personas {
  constructor(map, layers, personas, layerControl, overlayMaps, filters) {
    this.container = map.container;
    this.personas = personas;
    this.layers = layers;
    this.controls = map.controls;
    this.map = map.map;
    this.layerControl = layerControl;
    this.overlayMaps = overlayMaps;
    this.isEmbed = map.isEmbed;
    this.personasContainer = null;
    this.filters = filters;
  }

  init() {
    const mapPersonas = document.createElement("div");
    mapPersonas.setAttribute("id", "personas");
    mapPersonas.classList.add("personas");
    this.container.insertBefore(mapPersonas, this.container.firstChild);
    this.personasContainer = document.getElementById("personas");
    for (let i = 0; i < this.personas.length; i++) {
      this.createEasyButtons(this.personas[i], i, true);
    }
  }

  createEasyButtons(persona, i, keepAllInLayerControl) {
    let buttonWrapper = document.createElement("span");
    buttonWrapper.classList.add("personas__button-wrapper");

    buttonWrapper.innerHTML = `<button id="persona-button-${i}" class="personas__button"><span class="personas__icon-wrapper"><img class="personas__icon personas__icon--base" height = 80px src="${persona.icon}" alt="${persona.text}"/><img class="personas__icon personas__icon--active" height = 80px src="${persona.iconActive}" alt="${persona.text}"/></span><span class="button-text">${persona.text}</span></button>`;

    const mapPersonas = document.getElementById("personas");
    mapPersonas.appendChild(buttonWrapper);

    const button = document.getElementById(`persona-button-${i}`);
    button.addEventListener("click", e => {
      e.stopPropagation();
      this.removeActiveClass();
      button.classList.add(PERSONA_ACTIVE_CLASS);
      this.controls.showClearButton();

      this.switchGroup(persona, keepAllInLayerControl);

      //bit of code that switches the group

      if (this.isEmbed) {
        this.focusAfterPersona();
      } else {
        scrollTo("#controls-toggle", 500, () => this.focusAfterPersona());
      }
    });
  }

  removeActiveClass() {
    for (const personaWrapper of this.personasContainer.childNodes) {
      const persona = personaWrapper.firstChild;
      if (persona.classList) {
        persona.classList.remove(PERSONA_ACTIVE_CLASS);
      }
    }
  }

  focusAfterPersona() {
    if (this.controls.isOpen) {
      const onLayers = document.querySelectorAll(
        ".leaflet-control-layers-selector:checked"
      );
      onLayers[0].focus();
    } else {
      const target = document.getElementById("controls-toggle");
      target.focus();
    }
  }

  switchGroup(persona, keepAllInLayerControl) {
    //remove all layers
    for (const layer of this.layers) {
      this.map.removeLayer(layer);
      //if the keep option is set to false, remove the corresponding entry in the layer control
      if (!keepAllInLayerControl) {
        this.layerControl.removeLayer(layer);
      }
    }

    if (this.filters) {
      this.filters.clearFilters();
    }

    //add layers from that group
    for (const layer of persona.layers) {
      this.map.addLayer(layer);
      // if the keep option is set to false, we now need to re-add the layers to the control
      if (!keepAllInLayerControl) {
        for (const key in this.overlayMaps) {
          if (this.overlayMaps[key] == layer) {
            this.layerControl.addOverlay(this.overlayMaps[key], key);
          }
        }
      }
    }
  }
}

export default Personas;
