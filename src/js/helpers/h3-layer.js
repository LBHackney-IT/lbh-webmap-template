import geojson2h3 from 'geojson2h3';
import { latLngToCell,gridDisk,gridDiskDistances,edgeLength,UNITS} from "h3-js";





function normalizeLayer(layer, zeroBaseline = false) {
    const hexagons = Object.keys(layer);
    // Pass one, get max (and min if needed)
    const max = hexagons.reduce((max, hex) => Math.max(max, layer[hex]), -Infinity);
    const min = zeroBaseline ? 0 :
            hexagons.reduce((min, hex) => Math.min(min, layer[hex]), Infinity);
    // Pass two, normalize
    hexagons.forEach(hex => {
        layer[hex] = (layer[hex] - min) / (max - min); 
    });
    return layer;
}
function bufferPoints(geojson, radius) {
    const layer = {};
    geojson.features.forEach(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const stationIndex = latLngToCell(lat, lng, h3Resolution);
        const ring = gridDisk(stationIndex, radius);
        ring.forEach(h3Index => {
        layer[h3Index] = (layer[h3Index] || 0) + 1;
        });
    });
    // return normalizeLayer(layer, true);
    return layer
}
function bufferPointsLinear(geojson, radius) {
    const layer = {};
    geojson.features.forEach(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const stationIndex = latLngToCell(lat, lng, h3Resolution);
        // add surrounding multiple surrounding rings, with less weight in each
        const rings = gridDiskDistances(stationIndex, kmToRadius(radius,stationIndex));
        const step = 1 / (radius + 1);
        rings.forEach((ring, distance) => {
        ring.forEach(h3Index => {
            layer[h3Index] = (layer[h3Index] || 0) + 1 - distance * step;
        })
        });
    });
    // return normalizeLayer(layer);
    return layer;
}
// Transform a kilometer measurement to a k-ring radius
function kmToRadius(km,index) {
return Math.floor(km / edgeLength(index, UNITS.km));
}
function countPoints(geojson,property,h3Resolution) {
    const layer = {};
    geojson.features.forEach(feature => {
        if(feature?.geometry?.type==="Point"){

            const [lng, lat] = feature.geometry.coordinates;
            const h3Index = latLngToCell(lat, lng, h3Resolution);

            if(property){
                const obj2 = {
                    [feature.properties[property]]:(layer[h3Index]?.[property] || 0) + 1
                }
                layer[h3Index] = {...layer[h3Index],...Object.keys(obj2).reduce((acc, key) => {
                    acc[key] = (layer[h3Index]?.[key] || 0) + obj2[key];
                    return acc;
                }, {})};
            }
            layer[h3Index] = {...layer[h3Index],...{count:(layer[h3Index]?.count || 0) + 1}}
         }
        });
    // console.log('Layer',layer)
    return layer
}

const createH3Geojson =(data,property,h3Resolution=9) =>{

    const hexagons = countPoints(data,property,h3Resolution||9)
    let h3geojson=  geojson2h3.h3SetToFeatureCollection(
        Object.keys(hexagons),
        hex => ({...hexagons[hex],...{h3_index:hex}})
      );
    // console.log(h3geojson)
    return h3geojson
  
}


export default createH3Geojson;