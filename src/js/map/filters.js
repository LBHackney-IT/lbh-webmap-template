import { FILTER_INPUT_CLASS } from "./consts";
import "../helpers/forEachPolyfill";
import "classlist-polyfill";

class Filters {
  constructor(map, layersData) {
    this.mapClass = map;
    this.checkboxStates = {};
    this.mapConfig = map.mapConfig;
    this.layersData = layersData;
    this.container = map.container;
    this.filters = null;
    this.clearButton = null;
  }

  init() {
    this.filters = this.mapConfig.filters;
    this.createMarkup();
    this.updateCheckboxStates();
    this.setFilterInputAction();
    this.bindClearButton();
  }

  bindClearButton() {
    this.clearButton.addEventListener("click", () => {
      this.clearFilters();
    });
  }

  createMarkup() {
    let html = `<details class="govuk-details lbh-details" data-module="govuk-details">
    <summary class="govuk-details__summary">
      <span class="govuk-details__summary-text">`
      + this.filters.tags.filtersSectionTitle
        +`</span>
    </summary>
    <div class="govuk-details__text"><div class="govuk-form-group lbh-form-group filters__form-group">`;
    for (const [key, filter] of Object.entries(this.filters)) {
      html += `<fieldset class="govuk-fieldset filters__fieldset" aria-describedby="nationality-hint">
        <legend class="govuk-fieldset__legend">
          ${filter.heading}
        </legend>
        <div class="govuk-checkboxes govuk-checkboxes--small lbh-checkboxes">`;
      for (let i = 0; i < filter.options.length; i++) {
        html += `
              <div class="govuk-checkboxes__item">
                <input class="govuk-checkboxes__input ${FILTER_INPUT_CLASS}" id="${
          i === 0 ? key : key + "-" + i
        }" name="${key}" type="checkbox" value="${filter.options[i]}">
                <label class="govuk-label govuk-checkboxes__label" for="${
                  i === 0 ? key : key + "-" + i
                }">
              ${filter.options[i]}
            </label>
              </div>`;
      }
      html += `</div>
      </fieldset>`;
    }
    html += `</div></div></details><button id="filters-clear" class="govuk-button lbh-button filters__clear">Clear filters</button></section>`;
    this.mapClass.addMarkupToMap(html, "filters", "filters");
    this.clearButton = document.getElementById("filters-clear");
  }

  //utility to empty and reload layers, using the cached data (not calling wfs again)
  reload() {
    this.updateCheckboxStates();
    for (const layerData of this.layersData) {
      layerData.layer.options.filter = feature => {
        let isShown = true;
        for (let [key, values] of Object.entries(this.checkboxStates)) {
          if (values.length > 0) {
            if (
              !feature.properties[key] ||
              !feature.properties[key].split(",").some(i => values.includes(i))
            ) {
              isShown = false;
            }
          }
        }
        return isShown;
      };
      layerData.layer.clearLayers();
      layerData.layer.addData(layerData.data);
      const layerName = layerData.layer.getLayerId(layerData.layer);
      document.getElementById(`map-layer-count-${layerName}`).innerText = `${
        layerData.layer.getLayers().length
      } items shown`;
    }
  }

  setFilterInputAction() {
    for (const input of document.querySelectorAll(`.${FILTER_INPUT_CLASS}`)) {
      input.onchange = () => this.reload();
    }
  }

  updateCheckboxStates() {
    let isFiltered = false;
    const filterNames = Object.keys(this.filters);
    for (const filter of filterNames) {
      this.checkboxStates[filter] = [];
    }
    for (let input of document.querySelectorAll(`.${FILTER_INPUT_CLASS}`)) {
      if (input.checked) {
        this.checkboxStates[input.name].push(input.value);
        isFiltered = true;
      }
    }

    //change text of control-count in the legend and of clear filter button
    if (isFiltered) {
      this.clearButton.classList.remove(
        "govuk-button--disabled",
        "lbh-button--disabled"
      );
    } else {
      //   $(".control-count").text("All items shown");
      this.clearButton.classList.add(
        "govuk-button--disabled",
        "lbh-button--disabled"
      );
    }

    return isFiltered;
  }

  clearFilters() {
    document
      .querySelectorAll(`.${FILTER_INPUT_CLASS}:checked`)
      .forEach(input => (input.checked = false));
    this.reload();
    // $(".control-count").text("All items shown");
  }
}

export default Filters;
