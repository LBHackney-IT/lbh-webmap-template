import MAPBOX_ACCESS_KEY from "../helpers/mapbox";

const MAX_ZOOM = 19;
const MIN_ZOOM = 12;
const CENTER_DESKTOP_LEGEND_FULLSCREEN = [51.534, -0.083];
const CENTER_DESKTOP_LEGEND = [51.548, -0.083];
const CENTER_DESKTOP_NO_LEGEND_FULLSCREEN = [51.534, -0.06];
const CENTER_DESKTOP_NO_LEGEND = [51.548, -0.06];
const CENTER_MOBILE_FULLSCREEN = [51.538, -0.059928];
const CENTER_MOBILE = [51.549, -0.059928];
const DEFAULT_ZOOM_DESKTOP = 13;
const DEFAULT_ZOOM_MOBILE = 11;
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

const HACKNEY_GEOSERVER_WFS = "https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&outputFormat=json&SrsName=EPSG:4326&typeName=";
const HACKNEY_GEOSERVER_WMS = "https://map.hackney.gov.uk/geoserver/wms";
const MAPBOX_TILES_URL =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";
const GENERIC_GEOLOCATION_ERROR =
  "We cannot find your location. Please enable Location Services for your browser in Settings or try again outside of your office as your network may block geolocation.";
const GENERIC_OUTSIDE_HACKNEY_ERROR = "This map only covers Hackney";

const TILE_LAYER_OPTIONS = {
  fadeAnimation: false,
  opacity: 1,
  attribution:
    'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
  maxZoom: 19,
  accessToken: MAPBOX_ACCESS_KEY
};

const MARKER_COLORS = {
  red: "#d43e2a",
  orange: "#F69730",
  green: "#70ad26",
  blue: "#38aadd",
  purple: "#D252BA",
  darkred: "#a23336",
  darkblue: "#0e67a3",
  darkgreen: "#728224",
  darkolivegreen: "#566e4b",
  darkpurple: "#5b396b",
  cadetblue: "#436978",
  lightred: "#fc8e7f",
  beige: "#ffcb92",
  lightgreen: "#bbf970",
  lightblue: "#8adaff",
  pink: "#ff91ea",
  lightgray: "#a3a3a3",
  gray: "#575757",
  black: "#3b3b3b",
  khaki: "#ffda6f",
  yellow: "#ffff01",
  mediumslateblue:"#7966fe",
  thistle: "#dbb7ff",
  goldenrod: "#c7c704"
};

const PERSONA_ACTIVE_CLASS = "personas__button--active";
const CONTROLS_OPEN_CLASS = "controls--open";
const CONTROLS_SHOW_LEGEND_TEXT = "Show list of categories";
const CONTROLS_HIDE_LEGEND_TEXT = "Hide list of categories";
const CONTROLS_CLEAR_MAP_TEXT = "Clear map";
const FILTER_INPUT_CLASS = "filters__input";

export {
  MAX_ZOOM,
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
  HACKNEY_GEOSERVER_WMS,
  HACKNEY_GEOSERVER_WFS,
  MAPBOX_TILES_URL,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS,
  MARKER_COLORS,
  PERSONA_ACTIVE_CLASS,
  CONTROLS_OPEN_CLASS,
  CONTROLS_SHOW_LEGEND_TEXT,
  CONTROLS_HIDE_LEGEND_TEXT,
  CONTROLS_CLEAR_MAP_TEXT,
  FILTER_INPUT_CLASS
};
