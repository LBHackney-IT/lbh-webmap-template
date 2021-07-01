import L from "leaflet";
import ADDRESSES_PROXY_PROD from "../helpers/addressesProxy"

class addressSearch {
    constructor(mapClass) {
        this.mapClass = mapClass;
        this.map = mapClass.map;
        this.mapConfig = mapClass.mapConfig;
        this.showAddressSearch = null;
        this.searchButton = null;
        this.postcode = null;
        this.results = null;
        this.selectedAddress = null;
        this.full_address = null;
        this.index = null;
        this.latitude = null;
        this.longitude=null;
        this.pgindex = null;
        this.pageCount = null;
        this.error - null;
        this.addresses = null;
        this.response = null;
        this.uprn =null;
        this.usage=null;
        this.ward = null;
        this.popUpText =null;
        this.selectedAddressLayer = null;
        this.selectedInfo =null;
        this.selectedInfoValue = null;
        this.selectedLat = null;
        this.selectedLong = null;
        this.selectedUprn = null;
        this.selectedWard = null;
        this.selectedUsage = null;
        this.selectedFullAddress = null;
    }
    
    init() {
      this.showAddressSearch = this.mapConfig.showAddressSearch;

      this.createMarkup();
      this.bindSearchButton();
      //this.bindKeyUp();
    }

    bindSearchButton() {
      this.searchButton.addEventListener("click", () => {
      this.error = document.getElementById("error_message");
      //Save the postcode and format it for the proxy call
      this.postcode = document.getElementById("postcode").value;
      this.postcode = this.postcode.replace(/ /g,'');
      //console.log(this.postcode);
        //If the postcode is empty, there is an error message
        if(this.postcode == undefined || this.postcode == ''){
          this.error.innerHTML = "Please enter a postcode";
        } else{
          //clear the error messages if any
          document.getElementById("error_message").innerHTML = "";
          //remove the previous marker
          if (!this.selectedAddressLayer == ''){
            this.map.removeLayer(this.selectedAddressLayer);
          }
          //Getaddresses
          this.GetAddressesViaProxy();
        }
      });
    }

    createMarkup(){
      let html = `<details class="govuk-details lbh-details" data-module="govuk-details" open>
  <summary class="govuk-details__summary">
<<<<<<< HEAD
    <span class="govuk-details__summary-text">Go to address</span>
=======
    <span class="govuk-details__summary-text">Search by address</span>
>>>>>>> 3776bcddf8d8b7656c33dfae7ead0abe8dc865f4
  </summary>
<div class="govuk-details__text">
  <div class="govuk-form-group lbh-form-group">
      <label class="govuk-label  lbh-label" for="postcode">
<<<<<<< HEAD
        Enter a postcode
=======
        Enter your postcode to search for your address
>>>>>>> 3776bcddf8d8b7656c33dfae7ead0abe8dc865f4
      </label>
      <span id="error_message" class="govuk-error-message  lbh-error-message">
      <span class="govuk-visually-hidden">Error:</span>
    </span> 
    <div>
      <input type="Search"
          class="govuk-input  lbh-input govuk-input--width-10"
        id="postcode" 
<<<<<<< HEAD
        placeholder="Enter a postcode"
=======
        placeholder="Type your postcode"
>>>>>>> 3776bcddf8d8b7656c33dfae7ead0abe8dc865f4
      />
      <button id="search-button" class="govuk-button  lbh-button" data-module="govuk-button"">
        Find address
      </button>
    </div>
  </div>
  <div class="govuk-form-group lbh-form-group">
    <p id="addresses"></p>
  </div>
</div>
</details>
  </section>`;

  this.mapClass.addMarkupToMap(html, "addressSearch", "addresSsearch"); 
  this.searchButton = document.getElementById("search-button");
}

GetAddressesViaProxy(){
  //Clear the map from the previous search if any
  this.addresses = document.getElementById("addresses");
  this.addresses.innerHTML = 'Loading addresses...'; 
  this.code = document.getElementById("code");
  //console.log(ADDRESSES_PROXY_PROD);

  fetch(ADDRESSES_PROXY_PROD +"?format=detailed&postcode="+this.postcode, {
    method: "get"
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    this.results = data.data.data.address;
    //console.log(this.results)
    this.pageCount = data.data.data.page_count;
    console.log(this.pageCount)
    if (this.results.length === 0) {
      this.error.innerHTML = "No address found at this postcode";
      console.log('empty results');
    } else {
      this.addresses.innerHTML = "<div class='govuk-form-group lbh-form-group'>"
      + "<select class='govuk-select govuk-!-width-full lbh-select' id='selectedAddress' name='selectedAddress'>";

      this.selectedAddress = document.getElementById("selectedAddress").innerHTML += "<option disabled selected value> Select your address from the list </option>";
      
      for (this.index = 0; this.index < this.results.length; ++this.index) {
        this.full_address = [this.results[this.index].line1, this.results[this.index].line2, this.results[this.index].line3, this.results[this.index].line4].filter(Boolean).join(", ");
        this.uprn = this.results[this.index].UPRN;
        this.ward = this.results[this.index].ward;
        this.usage = this.results[this.index].usagePrimary;
        this.latitude=this.results[this.index].latitude; 
        this.longitude=this.results[this.index].longitude;
        //this.popUpText = "ADDRESS: " + this.full_address + "<br>" + "UPRN: " + this.uprn +"<br>" + "PRIMARY USAGE: " + this.usage.toUpperCase() +"<br>" + "WARD: " + this.ward.toUpperCase() +"<br>" ;
        //this.selectedAddress.innerHTML += "<option value='"+ this.index +"' id='selected'>" + this.full_address + "</option>";  
        document.getElementById("selectedAddress").innerHTML += "<option value='"+ this.latitude + "," + this.longitude + "," + this.uprn + "," + this.ward + "," + this.usage + "," + this.full_address +"' id='selected'>" + this.full_address + "</option>";    
      }

      //If there is more than 1 page, we call the load Address API Page function to add the page to the proxy call
      if (this.pageCount > 1) {
        for (this.pgindex = 2 ; this.pgindex<=this.pageCount ; ++this.pgindex){
          this.loadAddressAPIPageViaProxy(this.postcode, this.pgindex);    
        }
      }
      //close list
      document.getElementById("addresses").innerHTML += "</select></div>";

      //Event that runs when there is a change on the addresses select list. 
      this.addresses.addEventListener('change', (event) => {
        console.log("inside on change");
        this.selectedInfoValue = document.getElementById("selected").value;
        //console.log(this.selectedInfoValue);
        this.selectedInfo = this.selectedInfoValue.split(',');
        //console.log(this.selectedInfo);
        this.selectedLat = this.selectedInfo[0];
        this.selectedLong = this.selectedInfo[1];
        this.selectedUprn = this.selectedInfo[2];
        this.selectedWard = this.selectedInfo[3].toUpperCase();
        this.selectedUsage = this.selectedInfo[4].toUpperCase();
        if (this.selectedInfo[8] == undefined || this.selectedInfo[8] == ''){
          this.selectedFullAddress = this.selectedInfo[5] + "," + this.selectedInfo[6] + "," + this.selectedInfo[7];
         } else {
          this.selectedFullAddress = this.selectedInfo[5] + "," + this.selectedInfo[6] + "," + this.selectedInfo[7] + "," + this.selectedInfo[8];
         }
        //console.log("selected address: " + this.selectedFullAddress);
        //Create the popUpText for the selected address
        this.popUpText = "ADDRESS: " + this.selectedFullAddress + "<br>" + "UPRN: " + this.selectedUprn +"<br>" + "PRIMARY USAGE: " + this.selectedUsage.toUpperCase() +"<br>" + "WARD: " + this.selectedWard.toUpperCase() +"<br>" ;
        //Center the map in the new location
        this.map.setView([this.selectedLat, this.selectedLong], 18);
        //Create the marker, add the pop up and add the layer to the map
        this.selectedAddressLayer =L.layerGroup([
          L.marker([this.selectedLat, this.selectedLong], {
            icon: L.AwesomeMarkers.icon({
              icon: 'fa-building',
              prefix: "fa",
              markerColor: 'red',
              spin: false
            }),
            alt: 'address'
          })
          .bindPopup(this.popUpText)
        ])
        .addTo(this.map);
      });
    }
  
  }
  )
  .catch(error => {
    console.log(error);
          alert("Something went wrong, please reload the page");
        });

 
          
  
};
   
loadAddressAPIPageViaProxy(postcode,page){
  //console.log("inside page");
  //console.log(postcode);
  //console.log(page);
  fetch(ADDRESSES_PROXY_PROD +"?format=detailed&postcode="+postcode+"&page="+page, {
    method: "get"
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data)
    this.results = data.data.data.address;
    //console.log(this.results)
    this.pageCount = data.data.data.page_count;
    //console.log(this.pageCount)
   
      //this.addresses.innerHTML = "<div class='govuk-form-group lbh-form-group'>"
      //+ "<select class='govuk-select govuk-!-width-full lbh-select' id='selectedAddress' name='selectedAddress'>";
      // this.selectedAddress = document.getElementById("selectedAddress").innerHTML += "<option disabled selected value> Select your address from the list </option>";
      
      for (this.index = 0; this.index < this.results.length; ++this.index) {
        this.full_address = [this.results[this.index].line1, this.results[this.index].line2, this.results[this.index].line3, this.results[this.index].line4].filter(Boolean).join(", ");
        this.uprn = this.results[this.index].UPRN;
        this.ward = this.results[this.index].ward;
        this.usage = this.results[this.index].usagePrimary;
        this.latitude=this.results[this.index].latitude; 
        this.longitude=this.results[this.index].longitude;
        //this.popUpText = "ADDRESS: " + this.full_address + "<br>" + "UPRN: " + this.uprn +"<br>" + "PRIMARY USAGE: " + this.usage.toUpperCase() +"<br>" + "WARD: " + this.ward.toUpperCase() +"<br>" ;
        //this.selectedAddress.innerHTML += "<option value='"+ this.index +"' id='selected'>" + this.full_address + "</option>";  
        document.getElementById("selectedAddress").innerHTML += "<option value='"+ this.latitude + "," + this.longitude + "," + this.uprn + "," + this.ward + "," + this.usage + "," + this.full_address +"' id='selected'>" + this.full_address + "</option>";    
      }
       //close list
       document.getElementById("addresses").innerHTML += "</select></div>";
      
       //Event that runs when there is a change on the addresses select list. 
       this.addresses.addEventListener('change', (event) => {
         //console.log("inside on change");
         this.selectedInfoValue = document.getElementById("selected").value;
         //console.log(this.selectedInfoValue);
         this.selectedInfo = this.selectedInfoValue.split(',');
         //console.log(this.selectedInfo);
         this.selectedLat = this.selectedInfo[0];
         this.selectedLong = this.selectedInfo[1];
         this.selectedUprn = this.selectedInfo[2];
         this.selectedWard = this.selectedInfo[3].toUpperCase();
         this.selectedUsage = this.selectedInfo[4].toUpperCase();
         if (this.selectedInfo[8] == undefined || this.selectedInfo[8] == ''){
          this.selectedFullAddress = this.selectedInfo[5] + "," + this.selectedInfo[6] + "," + this.selectedInfo[7];
         } else {
          this.selectedFullAddress = this.selectedInfo[5] + "," + this.selectedInfo[6] + "," + this.selectedInfo[7] + "," + this.selectedInfo[8];
         }
         //console.log("selected address: " + this.selectedFullAddress);
         this.popUpText = "ADDRESS: " + this.selectedFullAddress + "<br>" + "UPRN: " + this.selectedUprn +"<br>" + "PRIMARY USAGE: " + this.selectedUsage.toUpperCase() +"<br>" + "WARD: " + this.selectedWard.toUpperCase() +"<br>" ;
         this.map.setView([this.selectedLat, this.selectedLong], 18);
         this.selectedAddressLayer =L.layerGroup([
           L.marker([this.selectedLat, this.selectedLong], {
             icon: L.AwesomeMarkers.icon({
               icon: 'fa-building',
               prefix: "fa",
               markerColor: 'red',
               spin: false
             }),
             alt: 'address'
           })
           .bindPopup(this.popUpText)
         ])
         .addTo(this.map);
       });   
   }
   )
  .catch(error => {
    console.log(error);
          alert("Something went wrong, please reload the page");
        });
}
 

}

export default addressSearch;