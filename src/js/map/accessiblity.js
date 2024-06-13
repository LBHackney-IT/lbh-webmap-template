class Accessibility {
  constructor(map) {
    this.map = map;
  }

  init(){
    this.addKeyEnterListenersToLayers()
  }

  
  addKeyEnterListenersToLayers(){
    // Select all label elements inside .leaflet-control-layers-overlays
    const labels = document.querySelectorAll('.leaflet-control-layers-overlays label');
    // Iterate over the selected label elements
    labels.forEach(label => {
        // Find the corresponding .legend-entry child
        if(label){
          let layer_name = null
          const legendEntry = label.querySelector('.legend-entry');
          // const checkbox = label.querySelector('.leaflet-control-layers-selector');
          if(legendEntry){
            layer_name = legendEntry.getAttribute('layer-name')
            // Give legend entries aria labels
            if(layer_name){
              label.ariaLabel = layer_name + ' layer'
            }
          }
          // Apply eventListener on label
          label.addEventListener("keydown", function(event) {
              if (event.key === "Enter") {       
                label.click();   
              }
            })
        }
       
    });
    }
    
}
export default Accessibility;
