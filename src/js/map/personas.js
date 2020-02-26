import { scrollTo } from "../helpers/scrollTo";
import { PERSONA_ACTIVE_CLASS } from "./consts";

class Personas {
  constructor(map, layers, layerGroups, layerControl, overlayMaps, filters) {
    this.container = map.container;
    this.layerGroups = layerGroups;
    this.layers = layers;
    this.controls = map.controls;
    this.map = map.map;
    this.layerControl = layerControl;
    this.overlayMaps = overlayMaps;
    this.isEmbed = map.isEmbed;
    this.personas = null;
    this.filters = filters;
  }

  init() {
    const mapPersonas = document.createElement("div");
    mapPersonas.setAttribute("id", "map-personas");
    mapPersonas.classList.add("map-personas");
    this.container.insertBefore(mapPersonas, this.container.firstChild);
    this.personas = document.getElementById("map-personas");
    for (let i = 0; i < this.layerGroups.length; i++) {
      this.createEasyButtons(this.layerGroups[i], i, true);
    }
  }

  createEasyButtons(layerGroup, i, keepAllInLayerControl) {
    let buttonWrapper = document.createElement("span");
    buttonWrapper.classList.add("map-persona__button-wrapper");

    buttonWrapper.innerHTML = `<button id="persona-button-${i}" class="map-persona__button"><span class="map-persona__icon-wrapper"><img class="map-persona__icon map-persona__icon--base" height = 80px src="${layerGroup.groupIcon}" alt="${layerGroup.alt}"/><img class="map-persona__icon map-persona__icon--active" height = 80px src="${layerGroup.groupIconActive}" alt="${layerGroup.alt}"/></span><span class="button-text">${layerGroup.groupText}</span></button>`;

    const mapPersonas = document.getElementById("map-personas");
    mapPersonas.appendChild(buttonWrapper);

    const button = document.getElementById(`persona-button-${i}`);
    button.addEventListener("click", e => {
      e.stopPropagation();
      this.removeActiveClass();
      button.classList.add(PERSONA_ACTIVE_CLASS);
      this.controls.showClearButton();

      this.switchGroup(layerGroup, keepAllInLayerControl);

      //bit of code that switches the group

      if (this.isEmbed) {
        this.focusAfterPersona();
      } else {
        scrollTo("#map-toggle", 500, () => this.focusAfterPersona());
      }
    });
  }

  removeActiveClass() {
    for (const personaWrapper of this.personas.childNodes) {
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
      const target = document.getElementById("map-toggle");
      target.focus();
    }
  }

  switchGroup(layerGroup, keepAllInLayerControl) {
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
    for (const layer of layerGroup.layersInGroup) {
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
