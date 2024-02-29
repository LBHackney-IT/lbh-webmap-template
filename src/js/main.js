import '../scss/all.scss'
import "@babel/polyfill";
import Map from "./map/map.js";


const mapDiv = document.getElementById("map");
const map = new Map(mapDiv);
map.init();
