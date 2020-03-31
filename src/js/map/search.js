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
      <span class="govuk-details__summary-text">`
      +this.search.searchSectionTitle
      +`</span>
    </summary>
  <div class="govuk-details__text">
      <div id="searchdiv"></div>
  </div>
  </details>
    </section>`;

    this.mapClass.addMarkupToMap(html, "search", "search");
        
        const controlSearch = new L.Control.Search({
            //position:'topleft',		
            container: 'searchdiv',
            layer: this.searchLayer,
            propertyName: this.search.searchField,
            textPlaceholder: this.search.searchPlaceholderText,
            collapsed: false,
            initial: false,
            //zoom: 18,
            marker: false,
            textErr: this.search.notFoundText,
            autoCollapseTime: 4000
            //class: 'govuk-input  lbh-input'
        });
        // controlSearch.on('search:locationfound', function(e) {           
        //     if(e.layer._popup)
        //       e.layer.openPopup(); 
        //       e.layer.addTo(this.map);      
        // });
        controlSearch.on('search:locationfound', (e) => {           
          if(e.layer._popup)
          this.mapClass.clear();  
          e.layer.addTo(this.map);
          e.layer.openPopup();      
      });
        this.map.addControl(controlSearch);
    }

}

export default Search;