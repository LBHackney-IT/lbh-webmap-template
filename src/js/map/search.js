class Search {
    constructor(mapClass) {
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
        const controlSearch = new L.Control.Search({
            position:'topleft',		
            layer: this.searchLayer,
            propertyName: this.search.searchField,
            textPlaceholder: this.search.searchBoxText,
            collapsed: false,
            initial: false,
            //zoom: 18,
            marker: false
        });
        controlSearch.on('search:locationfound', function(e) {           
            if(e.layer._popup)
              e.layer.openPopup();       
        });
        this.map.addControl(controlSearch);
    }

}

export default Search;