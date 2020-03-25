class Search {
    constructor(map, layersData) {
        this.mapClass = map;
        this.checkboxStates = {};
        this.mapConfig = map.mapConfig;
        this.layersData = layersData;
        this.container = map.container;
        this.search = null;
    }
    
    init() {
        this.search = this.mapConfig.search;
        this.createMarkup();
    }

    createMarkup(){
        map.addControl( new L.Control.Search({layer: this.layersData[0]}));
    }

}

export default Search;