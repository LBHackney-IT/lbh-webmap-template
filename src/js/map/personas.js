import { scrollTo } from "../helpers/scrollTo";

class Personas {
  constructor(map, layers, layerGroups, layerControl, overlayMaps) {
    this.container = map.container;
    this.layerGroups = layerGroups;
    this.layers = layers;
    this.controls = map.controls;
    this.map = map.map;
    this.layerControl = layerControl;
    this.overlayMaps = overlayMaps;
    this.isEmbed = map.isEmbed;
  }

  init() {
    const mapPersonas = document.createElement("div");
    mapPersonas.setAttribute("id", "map-personas");
    mapPersonas.classList.add("map-personas");
    this.container.insertBefore(mapPersonas, this.container.firstChild);
    for (let i = 0; i < this.layerGroups.length; i++) {
      this.createEasyButtons(this.layerGroups[i], i, true);
    }
  }

  createEasyButtons(layerGroup, i, keepAllInLayerControl) {
    let button = document.createElement("button");
    button.classList.add("map-persona__button");
    button.setAttribute("id", "persona-button-" + i);

    button.innerHTML = `<span class="map-persona__icon-wrapper"><img class="map-persona__icon map-persona__icon--base" height = 80px src="${layerGroup.groupIcon}" alt="${layerGroup.alt}"/><img class="map-persona__icon map-persona__icon--active" height = 80px src="${layerGroup.groupIconActive}" alt="${layerGroup.alt}"/></span><span class="button-text">${layerGroup.groupText}</span>`;
    const mapPersonas = document.getElementById("map-personas");
    mapPersonas.appendChild(button);

    button = document.getElementById(`persona-button-${i}`);
    button.addEventListener("click", e => {
      e.stopPropagation();
      if (button.parentNode.childNodes.classList) {
        button.parentNode.childNodes.classList.remove("persona-button--active");
      }
      button.classList.add("persona-button--active");
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
