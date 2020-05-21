# GitHub Repository Template

## About

This is our Webmap template, which should be used to create webmaps for Hackney.

## Prerequisites

You will need to have
[git installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
You will also need [node and npm installed](https://nodejs.org/en/download/).

## Setting Up

Open terminal / bash and run the following:

```bash
git clone `https://github.com/LBHackney-IT/lbh-webmap-template.git`
```

You will need to create a file called `mapbox.js` in `src/js/helpers`, and a
file called `.npmrc` in the root of the project. Sandrine Balley
(sandrine.balley@hackney.gov.uk) or Marta Villalobos
(marta.villalobos@hackney.gov.uk) can give you the file contents for both files.

[Create your data file](#data-files), name it `map-definition.json` and add it
to `data/YOUR_MAP_NAME_GOES_HERE/`.

Go back to terminal and run the following commands:

```bash
cd lbh-webmap-template
npm install
npm start
```

When you see the text "Listening on port 9000..." (this could take a minute or
so), open your web browser and go to
`http://localhost:9000/YOUR_MAP_NAME_GOES_HERE/index.html` for the whole page
version (with header), or
`http://localhost:9000/YOUR_MAP_NAME_GOES_HERE/embed.html` for the embed
version.

## Data file options

The options for the data file are as follows:

| Option    | Type   | Required | Description                                                                                                                                                                                                |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title` | String | optional | Title of the map that displays in the title box and the metadata box |
| `summary` | String | optional | Summary of the map. If title and summary are present, an information icon will appear next to the title and the text added in `summary` will appear as a tooltip when you hover on the icon (desktop only) |
| `showGeoServerMetadata` | Boolean | optional | If `true` the code will try to read the metadata (from `metadata.public_metadata`) via geoserver and add it to the infoBox that appears when you click on "About the data of this map" on desktop or on the information icon on mobile. This is a view on Earthlight metadata. This includes the name of the layer, the abstract, source and last update date of each layer of the map. |
| `aboutTheData` | Boolean | optional | If `showGeoServerMetadata` is set to false, `aboutTheData` can be used to populate the text in the infoBox described above. |
| `baseStyle` | String | optional | Mapbox style to use for the base map. Possible values:<br>`streets`: the closest style to Google. Amended to remove commercial points of interest at small scale.<br>`light`: light grey style we used for the regeneration map.<br>`dark`: black style<br>any other value, empty or omitted: the classical beige style we used for the initial leaflet maps |
| `zoomToMasterMap` | Boolean | optional | If `true` the top 3 levels of zoom show Ordnance Survey masterMap outdoor style. |
| `showLocateButton` | Boolean | optional | If `true` a button with geolocation function will be added to the map. |
| `showResetZoomButton` | Boolean | optional | If `true` a button resetting the zoom to show the full extent of Hackney will be added to the map. (Non mobile devices only) | 
| `showHackneyMask` | Boolean | optional | If `true` a semi-opaque white mask will be added to all areas that fall outside of Hackney. |
| `showHackneyBoundary` | Boolean | optional | If `true` the Hackney boundary will be added to the map |
| `showLegend` | Boolean | optional | If `true` a legend will show on the map. |
| `controlsText` | Object | optional | If `showLegend` is `true`, you can optionally set custom values for the text that will get displayed to show and hide the legend and to clear the map, otherwise defaults will display. Options:<br>`showLegendText`: Default is "Show list"<br>`hideLegendText`: Default is "Hide list"<br>`clearMapText`: Default is "Clear map" |
| `personas` | Array | optional | An array of objects that defines any "personas" to be added to the map. Each object will produce a button at the top of the map, which when clicked will turn on a group of layers. [Persona options defined below](#persona-options) |
| `filters` | Object | optional | An object with one or more keys, where the key is the name of the property in the GeoServer database, and the value is an object with a `heading` (the heading text that will appear at the top of the filter), and `options` (an array of possible values for that filter). |
| `search` | Object | optional | A collapsible search bar to be displayed at the top of the map. The search bar will search every layer that is set as 'searchable' and has a specific attribute. For instance, you can search within differents layers showing different types of touristic places. These layers can have different structures, but all must have an attribute called 'place_name' that will be used for the search. If several places have exactly the same name, they are all highlighted (not just the first one). [Search options defined below](#search-options)|
| `list` | Object | optional | An accordion panel dispalyed under the map. Each accordion section lists all features of one layer. To be in the panel, ths layer must have a 'listView' configured (see layer options). Options: `sectionHeader` is the label shown on top of the accordion (e.g. 'List of all organisations'). If `showIcons` is set to true, every accordion section will display the legend icon of the layer after the layer title. |
| `layers` | Array | required | An array of layers to be added to the map. [Layer options defined below](#layer-options). |

### Persona Options

Object properties:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | String | required | Id of the persona, used as a key in layers to specify whether a layer belongs to the persona. |
| `icon` | String | required | Relative url of the default icon for the persona button. |
| `iconActive` | String | required | Relative url of the active state icon for the persona button. |
| `text` | String | required | (User-friendly) text for the persona button. |

### Search Options

Object properties:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `searchSectionTitle` | String | required | Label of the search tool. Clicking on the label expands the search bar. |
| `searchField` | String | required | Name of the data attribute that will be searched against. All searchable layers must have this comon attribute. |
| `searchPlaceholderText` | String | required | Hint text displayed in grey inside the search bar. Example: 'type postcode or block name'. |
| `notFoundText` | String | required | Message appearing under the search box if no result is found. |
| `clearMapAfterSearch` | Boolean | required | If true, the map is cleared before displaying the retrieved object(s), so only the result is shown. If false, the result is highlighted but all other objects will remain on the map. |


### Layer Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | String | required | Title of the layer. This is how it will be shown on the legend (if there is a legend on the map). It may also be used as a header in popups depending on how the popups are configured. |
| `geoserverLayerName` | String | required | Name (not title) of the layer in geoserver which usually follows the following structure `[Schema_name]:[table_name]` (e.g. `planning:conversation_area`). The geoserver name does not need to be the same as the table name in the database, but will be by default. |
| `personas` | Array | optional | An array of persona `id`s for the personas that should turn this layer on. |
| `sortOrder` | Number | optional | This value is used to order layers in the legend (if there is a legend).  If empty, the legend will be sorted alphabetically. |
| `highlightFeatureOnHover` | Boolean | optional | If true, polygon features will be highlighted on mouse hover. |
| `zoomToFeatureOnClick` | Boolean | optional | If true, clicking on a polygon features will zoom to its extent. |
| `followLinkOnClick` | String | optional | Set to the name of the field containing a hyperlink. If set, clicking on a feature will follow the link. Links starting with http open in a blank tab, others are just moving to different sections of the page.|
| `pointStyle` | Object | optional | Configures marker style in point layers. Leave empty if the layer is not a point layer. [See Point Style Options for details](#point-style-options) |
| `linePolygonStyle` | Object | optional | Used to configure style for lines or polygons. Leave empty if the layer is a point layer. [See Line Polygon Options for details](#line-polygon-options) |
| `popup` | Object | optional | Used to configure the popups for the layer. [See Popup Options for details](#popup-options) |
| `tooltip` | Object | optional | Used to configure the tooltips for the layer. [See Tooltip Options for details](#tooltip-options) |
| `searchable` | Boolean | optional | If true, and if there is `search` defined for this map, the layer will be included in the search. The layer must have the attribute with the name specified in `searchField` at the map level. |
| `listView` | Object | optional | If listView is configured, and if there is a `list` defined for this map, the features of this layer will be listed in an accordion below the map. This object describe which fields are displayed in the list entry. [See ListView Options for details](#listView-options) |

### Point Style Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `markerType` | String | optional |  Possible values: <br>`"AwesomeMarker"`: uses font awesome and the icon element below,<br>`"CircleMarker"`: 6m circle with semi-transparent fill,<br>Empty or anything else: the default Leaflet blue marker.| 	
| `icon` | String | optional | FontAwesome icon name of the marker when `markerType` is set to `"AwesomeMarker"`. |
| `markerColor` | String | optional | Colour of the marker when `markerType` is set to `"AwesomeMarker"` or `"CircleMarker"`. See variable `MARKER_COLORS` in `src/js/map/consts.js` to get the list of colours. |
| `cluster` | Boolean | optional | If `true`, Leaflet will use the ClusterMarker plugin up to zoom 17. Beyond zoom 17 the individual markers will be used as defined above. We use a purple cluster style with a level of transparency depending on the size of the cluster. |

### Line Polygon Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `styleName` | String | Required | The styleName will be used to identify the style of the layer. The following options are available:<br>`"default"` - The default style can be used with lines and polygons. In this style, you choose the colour and properties of the fill and stroke (see other style properties for more details).<br>`"random polygons"` - This option can be chosen for lines and polygons which need to be styled with one colour per object. We do not need to specify the fillcolor since this is done by the function. |
| `stroke` | Boolean | Required | Indicates whether polygons have borders. 
| `strokeColor` | Text | Required | Color of the stroke. See variable `MARKER_COLORS` in `src/js/map/consts.js` to get the list of colours, or enter a hex code string. |
| `opacity` | Number | Required | A number between 0 and 1 defining the layer opacity. | 
| `fillColor` | String | Required | Fill color for polygons. `MARKER_COLORS` in `src/js/map/consts.js` to get the list of colours. |
| `fillOpacity` | Number | Required | Opacity of the fill between 0 and 1. |
| `weight` | Number | Required | Weight of the stroke in pixels. |

### Popup Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | String | optional | The name of the field to use as the title of the popup window for each record on the map. If omitted the name of the layer will be added (e.g. Parking zones). To remove all titles enter "notitle". |
| `afterTitle` | String | optional | An optional string to appear beneath the title in the popup. |
| `fields` | Array | optional | A list of field objects to show in the popup with the following properties:<br>`label` (String): a label shown in bold before the field value<br>`name` (String): geoserver field name (matches the table column name) |
| `afterFields` | String | optional | Text to display after the final field. |

### Tooltip Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `orientation` | String | optional | Position of the tooltip. See details in Leaflet documentation. Recommendation: for areas, set to 'center'. For point markers, set to 'top'. Default is 'auto'. |
| `offset` | Point | optional | Offset of the anchor of the tooltip. Default is [0,0]. Recommendation: for standard point markers, set to [0,-40].|
| `title` | String | optional | The name of the field to use as the title of the tooltip window for each record on the map. If omitted the name of the layer will be added (e.g. Parking zones). To remove all titles enter "notitle". |
| `afterTitle` | String | optional | An optional string to appear beneath the title in the tooltip. |
| `fields` | Array | optional | A list of field objects to show in the tooltip with the following properties:<br>`label` (String): a label shown in bold before the field value<br>`name` (String): geoserver field name (matches the table column name) |
| `afterFields` | String | optional | Text to display after the final field. |


### ListView Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | String | required | The name of the field to use as the title of the list entry. |
| `fields` | Array | optional | A list of field objects to show in the list entry with the following properties:<br>`label` (String): a label shown in bold before the field value<br>`name` (String): geoserver field name (matches the table column name) |


## Troubleshooting

If you have a javascript error and you require more information than what is
available in the console, you should set `isDist = false` in
`tasks/gulp/compile-assets.js` (line 34) and then stop (CTRL+C) and re-run
`npm start`. Please remember to set this back to `true` when you are ready to
build and deploy to production.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
