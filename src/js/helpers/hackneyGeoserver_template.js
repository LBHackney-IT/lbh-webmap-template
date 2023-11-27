const getWFSurl = () => {
    //We have two Geoserver instances - for internal and external use so we have two WFS URLs. This can be simplified to only one URL if needed
    if (window.location.hostname == 'YOUR-INTERNAL-HOSTNAME-GOES-HERE'){
        return "YOUR-INTERNAL-WFS-URL-GOES-HERE";
    }
    else {
        return "YOUR-EXTERNAL-WFS-URL-GOES-HERE";


    }
}


const getWMSurl = () => {
    //We have two Geoserver instances - for internal and external use so we have two WMS URLs. This can be simplified to only one URL if needed
    if (window.location.hostname == 'YOUR-INTERNAl-HOSTNAME-GOES-HERE'){
        return "YOUR-INTERNAL-WMS-URL-GOES-HERE";
    }
    else {
        return "YOUR-EXTERNAL-WMS-URL-GOES-HERE";
    }
}


export {getWFSurl, getWMSurl};
