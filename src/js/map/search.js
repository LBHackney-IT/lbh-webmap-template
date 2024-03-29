class Search {
    constructor(mapClass) {
        this.mapClass = mapClass;
        this.map = mapClass.map;
        this.mapConfig = mapClass.mapConfig;
        this.search = null;
        this.searchLayer = null;
    }
    
    init() {
      console.log('init layer search');
      this.search = this.mapConfig.search;
      this.searchSectionState = this.search.searchSectionState || 'closed';

      //this.createMarkup();
      this.searchLayer = new L.LayerGroup([]); 
    }

    createMarkup(){
        let html = `<details class="govuk-details lbh-details" data-module="govuk-details" ${this.searchSectionState}>
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
    
    this.mapClass.addMarkupToTop(html, "search", "search");
        
      //extension of search plugin that does NOT add the searched layer to the map
      const HackneyLeafletSearch = L.Control.Search.extend({
        setLayer: function(layer) {	//set search layer at runtime
          //this.options.layer = layer; //setting this, run only this._recordsFromLayer()
          this._layer = layer;
          //this._layer.addTo(this._map);
          return this;
        },
      }); 
    
      const controlSearch = new HackneyLeafletSearch({
            //position:'topleft',		
            container: 'searchdiv',
            layer: this.searchLayer,
            propertyName: this.search.searchField,
            textPlaceholder: this.search.searchPlaceholderText,
            collapsed: false,
            initial: false,
            //zoom: 16,
            marker: false,
            textErr: this.search.notFoundText,
            autoCollapseTime: 4000
        });

        controlSearch.on('search:locationfound', (e) => {  
          console.log(e);      
             
          //Zoom to the record
          //If it is a polygon or line...
          if (e.layer instanceof L.Polygon || e.layer instanceof L.Polyline) {
            this.map.fitBounds(e.layer.getBounds());    
          } else {
            //If it is a point
            this.mapClass.map.fitBounds(L.latLng(e.latlng).toBounds(200), {
                animate: false,
                paddingTopLeft: [270, 0]
            });
          }

          
          if(this.search.clearMapAfterSearch){
            this.mapClass.clear();  
            //the search engine only retrieves the first match. Here we search for other features matching the search term
            this.searchLayer.eachLayer(lay => {
              lay.eachLayer(feat => {
                if (feat.feature.properties[this.search.searchField] == e.layer.feature.properties[this.search.searchField]){
                  feat.addTo(this.map);
                }
              });             
            });
          }
          
          if(e.layer._popup){
            e.layer.openPopup();    
          }           
        });
        this.map.addControl(controlSearch);
    }


}

export default Search;