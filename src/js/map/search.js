class Search {
    constructor(map, layer) {
        this.map = map;
        this.mapConfig = map.mapConfig;
        //this.layersData = layersData;
        this.layer = layer;
        this.container = map.container;
        this.search = null;
    }
    
    init() {
        this.search = this.mapConfig.search;
        //this.createMarkup();
        L.Control.Search({layer: this.layer}).addTo(this.map);
    }

    createMarkup(){
        
    }

}

export default Search;