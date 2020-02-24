import MAPBOX_ACCESS_KEY from "./helpers/mapbox";

const MAX_ZOOM = 19;
const MIN_ZOOM = 12;
const CENTER_DESKTOP = [51.549, -0.077928];
const CENTER_MOBILE = [51.549, -0.059928];
const DEFAULT_ZOOM_DESKTOP = 13;
const DEFAULT_ZOOM_MOBILE = 11;
const MAP_BOUNDS = [
  [51.491112, -0.275464],
  [51.607351, 0.096129]
];
const HACKNEY_BOUNDS_1 = [51.517787, -0.097059];
const HACKNEY_BOUNDS_2 = [51.580648, -0.00909];
const HACKNEY_GEOSERVER = "https://map.hackney.gov.uk/geoserver/wms";
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

const MARKER_COLOURS = {
  red: "#d43e2a",
  orange: "#F69730",
  green: "#70ad26",
  blue: "#38aadd",
  purple: "#D252BA",
  darkred: "#a23336",
  darkblue: "#0e67a3",
  darkgreen: "#728224",
  darkpurple: "#5b396b",
  cadetblue: "#436978",
  lightred: "#fc8e7f",
  beige: "#ffcb92",
  lightgreen: "#bbf970",
  lightblue: "#8adaff",
  pink: "#ff91ea",
  lightgray: "#a3a3a3",
  gray: "#575757",
  black: "#3b3b3b"
};

const PERSONA_ACTIVE_CLASS = "persona-button--active";
const CONTROLS_OPEN_CLASS = "map-controls--open";
const CONTROLS_SHOW_LEGEND_TEXT = "Show list";
const CONTROLS_HIDE_LEGEND_TEXT = "Hide list";
const CONTROLS_CLEAR_MAP_TEXT = "Clear map";

export {
  MAX_ZOOM,
  MIN_ZOOM,
  CENTER_DESKTOP,
  CENTER_MOBILE,
  DEFAULT_ZOOM_DESKTOP,
  DEFAULT_ZOOM_MOBILE,
  MAP_BOUNDS,
  HACKNEY_BOUNDS_1,
  HACKNEY_BOUNDS_2,
  HACKNEY_GEOSERVER,
  MAPBOX_TILES_URL,
  GENERIC_GEOLOCATION_ERROR,
  GENERIC_OUTSIDE_HACKNEY_ERROR,
  TILE_LAYER_OPTIONS,
  MARKER_COLOURS,
  PERSONA_ACTIVE_CLASS,
  CONTROLS_OPEN_CLASS,
  CONTROLS_SHOW_LEGEND_TEXT,
  CONTROLS_HIDE_LEGEND_TEXT,
  CONTROLS_CLEAR_MAP_TEXT
};
