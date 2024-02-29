import "@babel/polyfill";
import Map from "./map/map.js";
// import '../scss/all.scss'


const mapDiv = document.getElementById("map");
const map = new Map(mapDiv);
map.init();
