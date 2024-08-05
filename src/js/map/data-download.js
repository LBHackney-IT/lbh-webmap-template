import JSZip from "jszip";
import { blob as D3Blob } from "d3";

class DataDownload {
    constructor(map, layersData,initialLoad=false) {
        this.mapClass = map;
        this.mapConfig = map.mapConfig;
        this.layersData = layersData;
        this.layerDownloads = map.mapConfig.layerDownloads;
        this.initialLoad = initialLoad
        this.selectedLayers = map.mapConfig.layerDownloads;
    }

    init() {

        this.layersData.sort((a, b) => (a.layer.options.sortOrder > b.layer.options.sortOrder) ? 1 : -1);
        // If data-downloads are defined
        if (this.mapConfig.layerDownloads){
        this.createdownloadsMarkUp();
        // Activate component components from lbh-frontend
        this.initialLoad && window.LBHFrontend.initAll();
        this.bindDownloadButtons()
        this.bindLayerSelectCheckboxes()
        }
    }
    createdownloadsMarkUp(){
        console.log('Creating Downloads Markup...')

        const dataDownloads =  document.getElementById('data-downloads')
        dataDownloads && dataDownloads.remove()

        if(this.mapConfig.layerDownloads){
        
        let downloadsMarkup = `
            <details class="govuk-details lbh-details" data-module="govuk-details">
                <summary class="govuk-details__summary">
                    <span class="govuk-details__summary-text">
                    <h6>Downloads</h6>
                    </span>
                </summary>
                <div class="govuk-details__text">
                    <div class="govuk-form-group lbh-form-group filters__form-group">
                        <fieldset class="govuk-fieldset filters__fieldset" aria-label="data downloads">
                            <div class="govuk-checkboxes govuk-checkboxes--small lbh-checkboxes">
                                ${this.mapConfig.layerDownloads.map(layer =>
                                    `<div class="govuk-checkboxes__item">
                                        <input class="govuk-checkboxes__input downloads_select" id="download-${layer}" name="download" type="checkbox" value="${layer}">
                                        <label class="govuk-label govuk-checkboxes__label" for="download-${layer}">${layer}</label>
                                    </div>`
                                ).join('')}
                            </div>
                        </fieldset>
                    <div>
                <div>
                <div>
                    <button aria-label="Download CSV Map Data" value="csv" id="csv-download-btn" class="govuk-button lbh-button download-btn">Download&nbsp;CSV&nbsp;<i class="fa-solid fa-file-csv"></i></button>
                    <button aria-label="Download JSON Map Data" value="json" id="json-download-btn"class="govuk-button lbh-button download-btn">Download&nbsp;JSON&nbsp;<i class="fa-solid fa-file-code"></i></button>
                </div>
            </details>
        `
        this.mapClass.addMarkupToMapAfter(downloadsMarkup, "data-downloads", "data-downloads")
        }
    }
    handleDownloadSelection(e){
        let layerName = e.target.value
        if (e.target.checked){
            this.selectedLayers = [...this.selectedLayers,layerName]
        }else{
            this.selectedLayers = this.selectedLayers.filter(layer => layer!= layerName)
        }
        console.log(this.selectedLayers)
    }
    bindLayerSelectCheckboxes(){
        this.layerDownloads?.forEach(layer => {
            let fileDownloadCheckbox = document.getElementById(`download-${layer}`);
            fileDownloadCheckbox.checked = true
            fileDownloadCheckbox?.addEventListener("change", this.handleDownloadSelection.bind(this));
        });
    }
    bindDownloadButtons() {
        ["csv-download-btn","json-download-btn"].forEach(fileType => {
            let fileDownloadBtn = document.getElementById(fileType);
            fileDownloadBtn?.addEventListener("click", this.downloadFiles.bind(this));
        }); 
    }
    handleSingleFiles(layerObj,fileType){
        
        let layerName = layerObj.configLayer.title
        let layerData = layerObj.data
        let url = layerObj.configLayer.url
        url = url.replace("application/json","text/csv")
        if(fileType=="csv"){
            const getCSV = async () => await D3Blob(url)
            getCSV().then(blob => this.createDownloadLink(blob,`${layerName}.${fileType}`))
        }else if(fileType == "json"){
            const jsonData = JSON.stringify(layerData, null, 2); // Pretty print JSON
            // Create a Blob from the JSON string
            let blob = new Blob([jsonData], { type: 'application/json' });
            blob&&this.createDownloadLink(blob,`${layerName}.${fileType}`)
        }  
    }
    handleZipFiles(layerObjs,fileType){
        // Initialize JSZip
        const zip = new JSZip();
        // Convert each JSON object to CSV and add to the zip
        Promise.all(layerObjs.map(layerObj => {
            let layerName = layerObj.configLayer.title
            let layerData = layerObj.data
            let url = layerObj.configLayer.url
            url = url.replace("application/json","text/csv")

            if(fileType==="csv"){
                const getCSV = async () => await D3Blob(url)
                return {blob:getCSV(),fileType,layerName}
            }else if(fileType==="json"){
                const jsonData = JSON.stringify(layerData, null, 2); // Pretty print JSON
                 return {blob:jsonData,fileType,layerName}
            }
        })).then((dataBlobs) => {
            console.log(dataBlobs)
            const addLayers = dataBlobs.map(eachBlob => zip.file(`${eachBlob.layerName}.${eachBlob.fileType}`, eachBlob.blob))
            return addLayers
        }).then((data)=>{
            zip.generateAsync({ type: 'blob' }).then(blob => {
            this.createDownloadLink(blob,'hackney_map_data.zip')
            })
        })

    }
    createDownloadLink(blob,fileName){
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    downloadFiles(e){
            let fileType = e.target.value
            let selectedLayerObjs = this.layersData.filter(layerObj => this.selectedLayers.includes(layerObj.configLayer.title))
            if(this.selectedLayers?.length === 1){
                selectedLayerObjs.map(layerObj=>{
                    this.handleSingleFiles(layerObj,fileType)
                })
            }else if(this.selectedLayers?.length > 1){
                this.handleZipFiles(selectedLayerObjs,fileType)
            }

    };
}


export default DataDownload;

