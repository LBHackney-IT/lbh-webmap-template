import MAPBOX_ACCESS_KEY from "../helpers/mapbox";
import OS_RASTER_API_KEY from "../helpers/osdata";

const MIN_ZOOM = 4;
const CENTER_DESKTOP_LEGEND_FULLSCREEN = [51.534, -0.083];
const CENTER_DESKTOP_LEGEND = [51.548, -0.083];
const CENTER_DESKTOP_NO_LEGEND_FULLSCREEN = [51.534, -0.06];
const CENTER_DESKTOP_NO_LEGEND = [51.548, -0.06];
const CENTER_MOBILE_FULLSCREEN = [51.538, -0.059928];
const CENTER_MOBILE = [51.549, -0.059928];
const DEFAULT_ZOOM_DESKTOP = 6;
const DEFAULT_ZOOM_MOBILE = 5;
// const MAP_BOUNDS = [
//   [51.491112, -0.275464],
//   [51.607351, 0.096129]
// ];
const MAP_BOUNDS = [
  [51.281112, -0.5],
  [51.793054, 0.45]
];
const HACKNEY_BOUNDS_1 = [51.517787, -0.097059];
const HACKNEY_BOUNDS_2 = [51.580648, -0.00909];

const MAPBOX_TILES_URL =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";
const GENERIC_GEOLOCATION_ERROR =
  "We cannot find your location. Please enable Location Services for your browser in Settings or try again outside of your office as your network may block geolocation.";
const GENERIC_OUTSIDE_HACKNEY_ERROR = "This map only covers Hackney";

const TILE_LAYER_OPTIONS_MAPBOX = {
  fadeAnimation: false,
  opacity: 1,
  attribution:
    'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
  maxZoom: 19,
  accessToken: MAPBOX_ACCESS_KEY
};

const TILE_LAYER_OPTIONS_OS = {
  fadeAnimation: false,
  opacity: 1,
  attribution:
    'Map data &copy; Crown copyright and database rights 2021 <a href="https://www.ordnancesurvey.co.uk/">Ordnance Survey</a> 100019635.' ,
  maxZoom: 12,
  accessToken: OS_RASTER_API_KEY
};

const MARKER_COLORS = {
  //the colours below have a marker
  red: "#d43e2a",
  orange: "#F69730",
  green: "#70ad26",
  greenpantone:"#00b33c",
  blue: "#38aadd",
  purple: "#D252BA",
  darkred: "#a23336",
  darkblue: "#0e67a3",
  darkgreen: "#728224",
  darkolivegreen: "#566e4b",
  darkpurple: "#5b396b",
  cadetblue: "#436978",
  congopink: "#ff8e7f",
  beige: "#ffcb92",
  lightgreen: "#bbf970",
  lightblue: "#8adaff",
  pink: "#ff91ea",
  lightred: "#eb7d7f",
  lightgray: "#a3a3a3",
  gray: "#575757",
  black: "#3b3b3b",
  newyellow:"#d4ff2a",
  //the colours below don't have a marker
  khaki: "#ffda6f",
  yellow: "#ffff00",
  mediumslateblue:"#7966fe",
  thistle: "#dbb7ff",
  goldenrod: "#ffd966",
  darksaturatedblue: "#0044ff",
  dodgerblue: "#329fff",
  puertorico: "#51c6b8",
  caribbeangreen: "#10efca",
  mediumspringgreen: "#53eb8d",
  yellowgreen:"#96d642",
  amber:"#ffbf00",
  heath:"#551617",
  jacarta:"#522b6c",
  violet:"#a36ec5",
  lemonyellow:"#f1f9a9",
  apple:"#bfe5a0",
  greenblue:"#2166ac",
  bluecrayola:"#3784bb",
  carolinablue:"#59a1ca",
  darkskyblue:"#8bc0dc",
  columbiablue:"#b4d6e8",
  aliceblue:"#d9e3e9",
  champagnepink:"#f5ddce",
  apricot:"#f9c2a8",
  lightsalmon:"#f1a07d",
  terracota:"#de735b",
  upsdellred:"#b2182b",
  riverrouge: "#EB9E98",
  salmonsalt:"#E79088",
  tangopink:"#E48077",
  childhoodcrush:"#E17066",
  barelybrown:"#DD6055",
  redwire:"#DA5044",
  dangerred: "#D74033",
  redlips:"#CC3628",
  bloodrush:"#AA2D22",
  oldbrick: "#951a1c",
  darkhumor:"#641220",
  greenrange0: "#00524c",
  greenrange1: "#267302",
  greenrange2: "#70a701", 
  greenrange3: "#97e600" , 
  greenrange4: "#d1ff73",
  yellow: "#ffff00",
  //colours added for the neighbourhood map
  lightcobaltblue: "#94A3F2", //gp 
  jordyblue: "#94BDF2",
  tangerine: "#F28705",
  hippiegreen: "#5C8C57",
  poloblue: "#7DA0CD",
  purpleportage:"#7d89cd",
  texasrose:"#f1a447",
  fern:"#69a95d",
  honey:"#e2f17c",
  danube:"#5284c5",
  keylimepie:"#C7D93B",
  trinidad:"#f25517",
  balticsea:"#20222c",
  desertstorm:"#f7f7f5",
  corn:"#f1c205",
  mountainmist:"#929291",
  buff:"#f5e08c"
};

const PERSONA_ACTIVE_CLASS = "personas__button--active";
const CONTROLS_OPEN_CLASS = "controls--open";
const CONTROLS_SHOW_LEGEND_TEXT = "Show list of categories";
const CONTROLS_HIDE_LEGEND_TEXT = "Hide list of categories";
const CONTROLS_CLEAR_MAP_TEXT = "Clear map";
const FILTER_INPUT_CLASS = "filters__input";

export {
  MIN_ZOOM,
  CENTER_DESKTOP_LEGEND_FULLSCREEN,
  CENTER_DESKTOP_LEGEND,
  CENTER_DESKTOP_NO_LEGEND_FULLSCREEN,
  CENTER_DESKTOP_NO_LEGEND,
  CENTER_MOBILE_FULLSCREEN,
  CENTER_MOBILE,
  DEFAULT_ZOOM_DESKTOP,
  DEFAULT_ZOOM_MOBILE,
  MAP_BOUNDS,
  HACKNEY_BOUNDS_1,
  HACKNEY_BOUNDS_2,
  MAPBOX_TILES_URL,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS_MAPBOX,
  TILE_LAYER_OPTIONS_OS,
  MARKER_COLORS,
  PERSONA_ACTIVE_CLASS,
  CONTROLS_OPEN_CLASS,
  CONTROLS_SHOW_LEGEND_TEXT,
  CONTROLS_HIDE_LEGEND_TEXT,
  CONTROLS_CLEAR_MAP_TEXT,
  FILTER_INPUT_CLASS
};

