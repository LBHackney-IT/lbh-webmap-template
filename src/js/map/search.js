class Search {
    constructor(mapClass) {
        this.mapClass = mapClass;
        this.map = mapClass.map;
        this.mapConfig = mapClass.mapConfig;
        this.search = null;
        this.searchLayer = null;
    }
    
    init() {
        this.search = this.mapConfig.search;
        //this.createMarkup();
        this.searchLayer = new L.LayerGroup([]);
    }

    createMarkup(){
        let html = `<details class="govuk-details lbh-details" data-module="govuk-details">
    <summary class="govuk-details__summary">
      <span class="govuk-details__summary-text">
        Map search
      </span>
    </summary>

  <div id="searchdiv"></div>
  </details>
    </section>`;

    this.mapClass.addMarkupToMap(html, "search", "search");
        
        const controlSearch = new L.Control.Search({
            //position:'topleft',		
            container: 'searchdiv',
            layer: this.searchLayer,
            propertyName: this.search.searchField,
            textPlaceholder: this.search.searchBoxText,
            collapsed: false,
            initial: false,
            //zoom: 18,
            marker: false
            //class: 'govuk-input  lbh-input'
        });
        controlSearch.on('search:locationfound', function(e) {           
            if(e.layer._popup)
              e.layer.openPopup();       
        });
        this.map.addControl(controlSearch);
    }

}

export default Search;