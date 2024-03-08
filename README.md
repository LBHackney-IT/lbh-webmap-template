# GitHub Repository Template

## About

This is our Webmap template, which should be used to create webmaps for Hackney. Please contact Sandrine Balley
(sandrine.balley@hackney.gov.uk) or Marta Villalobos
(marta.villalobos@hackney.gov.uk) if you have any questions or suggestions. 

## Prerequisites

* Have 
[GIT installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

* Have [Node and NPM installed](https://nodejs.org/en/download/).

* Have a [Web Feature Service setup](https://www.ogc.org/standards/wfs) that can send data as GeoJson [GeoJson](https://www.ogc.org/standards/eo-geojson)

* Have a [Web Map Service setup](https://www.ogc.org/standards/wms) is not required but recommended. With the current webmap template, some layers such as the borough boundary and the mask are served via WMS. If you prefer not to serve these as WMS, you would need to change the existing functions. 
 
## Setting Up

Open terminal / bash and run the following:

```bash
git clone `https://github.com/LBHackney-IT/lbh-webmap-template.git`
```

You need a few helpers: 

* A file called `osdata.js` in `src/js/helpers`. This file contains the Ordnance Survey API key for the  OS basemaps. For more information, visit the [Ordnance Survey Data Hub](https://osdatahub.os.uk/).
* A file called `mapbox.js` in `src/js/helpers`. This file contains the Mapbox key for the Mapbox basemaps. For more information, visit the [Mapbox website](https://www.mapbox.com/maps).
* A file called `addressesProxy.js` in `src/js/helpers`. This file contains the proxy URL for the Hackney addresses API. 
* A file called `hackneyGeoserver.js` in `src/js/helpers`. This file contains the WFS/WMS URLs for the internal/external services. For more information, please see the prerequisites and the `hackneyGeoserver_template.js` file. 
* A file called `.npmrc` in the root of the project. This will give you access to the Font Awesome Pro packages. For more information, see [the Installing the Pro version of Font Awesome instructions](https://fontawesome.com/v5.15/how-to-use/on-the-web/setup/using-package-managers).



You can find the templates in the helpers folder. Do not forget to remove the "_template" from the file names after updating them. After renaming the files, these will be ignored by git. You can change this by updating the `.gitignore` file. 

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
version, or `http://localhost:9000/YOUR_MAP_NAME_GOES_HERE/fullscreen.html` for the fullscreen
version.

## Data file options

The options for the data file are as follows:

| Option    | Type   | Required | Description                                                                                                                                                                                                |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layers` | Array | required | An array of layers to be added to the map. [Layer options defined below](#layer-options). |
| `baseStyle` | String | required | style to use for the base map. Possible values:<br>`OSlight`: OS Light style. <br>`OSoutdoor`: OS Outdoor style. <br>`OSroad`: OS Road style.<br>We removed the MapBox option in Sept 2021.<br> CRS: EPSG:27700 - British National Grid by default. EPSG3857 - WGS 84 when we use vector tile layers|
| `title` | String | optional | Title of the map that displays in the title box and the metadata box |
| `showTitleInMetadataBoxOnMobile` | Boolean | optional | If `true`, the title will be added on the info box on mobile. |
| `summary` | String | optional | Summary of the map. If title and summary are present, an information icon will appear next to the title and the text added in `summary` will appear as a tooltip when you hover on the icon (desktop only) |
| `showGeoServerMetadata` | Boolean | optional | If `true` the code will try to read the metadata (from `metadata.public_metadata`) via geoserver and add it to the infoBox that appears when you click on "About the data of this map" on desktop or on the information icon on mobile. This is a view on Earthlight metadata. This includes the name of the layer, the abstract, source and last update date of each layer of the map. |
| `about` | String | optional | If `showGeoServerMetadata` is set to false, `about` can be used to populate the text in the infoBox described above. |
| `aboutTitle` | String | optional | `aboutTitle` can be used to populate the title of the infoBox described above (e.g: About the data/About the map) |
| `showMask` | Boolean | optional | If `true` a semi-opaque Hackney white mask will be added to all areas that fall outside of Hackney. Hackney mask is the default mask. If `true` and a maskGeoserverName is added, the mask displayed will be the custom one instead.|
| `maskGeoserverName` | String | optional | If the maskGeoserverName is not empty and showMask is `true`, the semi-opaque white mask will be the custom one instead of Hackney mask.|
| `showBoundary` | Boolean | optional | If `true` the Hackney boundary will be added to the map. The Hackney boundary is the default boundary. If `true` and a boundaryGeoserverName is added, the boundary displayed will be the custom one instead.| 
| `boundaryGeoserverName` | String | optional | If the boundaryGeoserverName is not empty and showBoundary is `true`, the custom boundary will be added instead.|
| `showLegend` | Boolean | optional | If `true` a legend will show on the map. |
| `showLayersOnLoad` | Boolean | optional | If `true` all the layers will appear on the map. If  `false` or omitted, no layer will appear. Default is `false`|
| `showFirstLayerOnLoad` | Boolean | optional | If `true` the layer with `sortOrder = 1` will appear on the map, and only this one. If `false` or omitted, the behaviour reverts to `showLayersOnLoad`. Default is `false`|
| `controlsText` | Object | optional | If `showLegend` is `true`, you can optionally set custom values for the text that will get displayed to show and hide the legend and to clear the map, otherwise defaults will display. [Control options defined below](#controls-options)||
| `hideNumberOfItems` | Boolean | optional | If `true` The number of items is hidden on the legend. If `false`, the number of items is shown on the layer. This is valid for all layers of the map. A similar property can be set a layer level. The default value is `false`. |
| `zoomToMasterMap` | Boolean | optional | If `true` the map will allow to zoom to the detailed view (OS MasterMap).|
| `zoomToMasterMapBW` | Boolean | optional | If `true` the map will allow to zoom to the black and white detailed view (OS MasterMap BW).|
| `blockZoomToMasterMap` | Boolean | optional | If `true` the map will block the zoom to the detailed view (OS MasterMap).|
| `minMapZoom` | Number | optional | It allows you to specify what is the min map zoom level.The map will block the zoom when zooming out beyond that level.|
| `blockInteractiveLegend` | Boolean | optional | If `true` the legend of the map won't be clickeable|
| `showLocateButton` | Boolean | optional | If `true` a button with geolocation function will be added to the map. |
| `showFullScreenButton` | Boolean | optional | If `true` a button with fullscreen function will be added to the map. |
| `showResetZoomButton` | Boolean | optional | If `true` a button resetting the zoom to show the full extent of Hackney will be added to the map. (Non mobile devices only) | 
| `showPickCoordinatesButton` | Boolean | optional | If `true` a button to pick coordinates (latitude and longitude) and copy them into clipboard will be added to the map.| 
| `performDrillDown` | Boolean | optional | If `true` a combined/drill down popUp window will be switched on. If `false`, the single default popUp window will be used instead. The default value is `false`. |
| `personas` | Array | optional | An array of objects that defines any "personas" to be added to the map. Each object will produce a button at the top of the map, which when clicked will turn on a group of layers. [Persona options defined below](#persona-options) |
| `showAddressSearch` | Object | optional | A collapsible search bar to be displayed at the top of the map to navigate to an address. Uses Hackney addresses API though a proxy. Can search for postcodes and free-text address elements (e.g. Maurice bishop, 210 Mare Street, E8 1HH.) You can set this to `true` to use the defaults. [Address search options defined below](#address-search-options)|
| `filtersSection` | Object | optional | An object with a filters object with one or more keys, where the key is the name of the property in the GeoServer database, and the value is an object with a `heading` (the heading text that will appear at the top of the filter), and `options` (an array of possible values for that filter). Note that if a layer doesn't contain the property named 'key', it is unaffected by the filter. A `filtersSectionTitle` can be added to customise the filter section heading. By default, it is Filter. An option `filtersSectionState` can be added and set to open or closed. The default is 'closed'|
| `search` | Object | optional | A collapsible search bar to be displayed at the top of the map. The search bar will search every layer that is set as 'searchable' and has a specific attribute. For instance, you can search within differents layers showing different types of touristic places. These layers can have different structures, but all must have an attribute called 'place_name' that will be used for the search. If several places have exactly the same name, they are all highlighted (not just the first one). [Search options defined below](#search-options)|
| `list` | Object | optional | An accordion panel dispalyed under the map. Each accordion section lists all features of one layer. To be in the panel, ths layer must have a 'listView' configured (see layer options). Options: `sectionHeader` is the label shown on top of the accordion (e.g. 'List of all organisations'). If `showIcons` is set to `true`, every accordion section will display the legend icon of the layer after the layer title. If `expandAll` is set to `true`, all accordion sections are expanded when the page loads. [List view options defined below](#listview-options)|

### Persona Options

Object properties:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | String | required | Id of the persona, used as a key in layers to specify whether a layer belongs to the persona. |
| `icon` | String | required | Relative url of the default icon for the persona button. |
| `iconActive` | String | required | Relative url of the active state icon for the persona button. |
| `text` | String | required | (User-friendly) text for the persona button. |

### Controls Options

Object properties:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `showLegendText` | String | optional | Text shown on the legend control. Default is "Show list" |
| `hideLegendText` | String | optional | Text shown on the legend control. Default is "Hide list" |
| `clearMapText` | String | optional | Text shown on the clear map control. Default is "Clear map" |


### Search Options

Object properties:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `searchSectionTitle` | String | required | Label of the search tool. Clicking on the label expands the search bar. |
| `searchField` | String | required | Name of the data attribute that will be searched against. All searchable layers must have this comon attribute. |
| `searchPlaceholderText` | String | required | Hint text displayed in grey inside the search bar. Example: 'type postcode or block name'. |
| `notFoundText` | String | required | Message appearing under the search box if no result is found. |
| `clearMapAfterSearch` | Boolean | required | If `true`, the map is cleared before displaying the retrieved object(s), so only the result is shown. If false, the result is highlighted but all other objects will remain on the map. |
| `searchSectionState`| String | optional | The search can be set to be expanded or collapsed by default. The values are open or closed. The default is 'closed'|




### Address search Options

Object properties:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `addressSearchLabel` | String | optional |  The text above the search bar. Default is "Go to an address" |
| `addressSearchClue` | String | optional |  The greyed text clue inside search bar. Default is "Enter a Hackney postcode or address" |
| `addressSearchState` | String | optional | The address search can be set to be expanded or collapsed by default. The values are open or closed. The default is 'closed'|
| `openPopUpWindow` | Boolean | optional |  If `true`, the popUp window of the selected address is open by default.| 
| `addressSearchIcon` | String | optional | FontAwesome icon name of the address search marker. If it is not specified, the default icon is displayed.|

### Layer Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | String | required | Title of the layer. This is how it will be shown on the legend (if there is a legend on the map). It may also be used as a header in popups depending on how the popups are configured. |
| `geoserverLayerName` | String | required | Name (not title) of the layer in geoserver which usually follows the following structure `[Schema_name]:[table_name]` (e.g. `planning:conversation_area`). The geoserver name does not need to be the same as the table name in the database, but will be by default. |
| `personas` | Array | optional | An array of persona `id`s for the personas that should turn this layer on. |
| `sortOrder` | Number | optional | This value is used to order layers in the legend (if there is a legend).  If empty, the legend will be sorted alphabetically. |
| `excludeFromLegend` | Boolean | optional | If `true`, the layer will be excluded from the legend. |
| `hideNumberOfItems` | Boolean | optional | If `true` The number of items is hidden on the legend, even if the layer is on. If `false`, the number of items is shown. This is valid for this layer only. The default value is `false`. |
| `countLabel` | String | optional | By default, a count line is shown under the layer name in the legend when the layer is on (e.g. "45 items shown"). Use this property to replace the default term "items" with another custom term, for instance "locations". |
| `excludeFromFilter` | Boolean | optional | If `true`, the layer will be ignored from the filter, if there are filters configured for this map. |
| `displayScaleRange` | Object | optional | This range is used to control the visibility of the layers. By default, the layers are displayed at all the zoom levels. If the range is added, the layers will be displayed from `minScale` to `maxScale`. If one of the values is not specified, the min map scale or the max map scale will be used instead|
| `loadToBack` | Boolean | optional | If `true` and the layer is added on load, it is sent to the background. If more than one layer has this option, you cannot control which one will be at the back. This only affects the initial load.|
| `highlightFeatureOnHoverOrSelect` | Boolean | optional | If `true`, polygon and polyline features will be highlighted on mouse hover and on popup opening. Used in conjonction with the search, this option enables to highlight features retrieved by a search (if they have a popup).|
| `zoomToFeatureOnClick` | Boolean | optional | If `true`, clicking on a polygon features will zoom to its extent. |
| `followLinkOnClick` | String | optional | Set to the name of the field containing a hyperlink. If set, clicking on a feature will follow the link. Links starting with http open in a blank tab, others are just moving to different sections of the page.|
| `openPopupClosestToMapCentre` | Boolean | optional | If `true`, the feature closest to the map center will have its popup open on load. Use if you're planning to use coordinates in the URL. If the closest feature is in a markerCluster, its popup won't open.|
| `pointStyle` | Object | required | Configures marker style in point layers. Leave empty if the layer is not a point layer. [See Point Style Options for details](#point-style-options) |
| `linePolygonStyle` | Object | optional | Used to configure style for lines or polygons. Leave empty if the layer is a point layer. [See Line Polygon Options for details](#line-polygon-options) |
| `popup` | Object | optional | Used to configure the popups for the layer. [See Popup Options for details](#popup-options) |
| `tooltip` | Object | optional | Used to configure the tooltips for the layer. [See Tooltip Options for details](#tooltip-options) |
| `searchable` | Boolean | optional | If `true`, and if there is a `search` object defined for this map, the layer will be included in the search. The layer must have an attribute with the name specified in `searchField` in the `search` object. |
| `listView` | Object | optional | If listView is configured, and if there is a `list` defined for this map, the features of this layer will be listed in an accordion below the map. This object describe which fields are displayed in the list entry. [See ListView Options for details](#listview-options) |
|`spatialEnrichments`|Array| optional | This layer's features will be enriched with extra attributes using spatial joins (point on area only) as defined in the objects in this list. Where :<br>`geographyLayer` = Source of new attribute, must be the title of a layer in the Layers' Array<br>`sourceAttribute` = Attribute to be copied from enriching layer <br>`targetAttribute` = Attribute name being added as enrichment to this layer<br>`placeholder` = Attribute **value** to be added to layer when there's no spatial match while enriching each feature.|

```json
    [
       {
              "geographyLayer": "enriching_layer_title",
              "sourceAttribute": "enriching_layer_target_attribute",
              "targetAttribute": "attribute_name_to_add_to_this_layer",
              "placeholder":"attribute_value when no spatial match found"
        }
    ]
```
> Only available for enriching a points layer only


### Point Style Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `markerType` | String | optional |  Possible values: <br>`"AwesomeMarker"`: uses font awesome and the icon element below,<br>`"CircleMarker"`: 6m circle with semi-transparent fill,<br>Empty or anything else: the default Leaflet blue marker.|
| `circleMarkerRadius` | Integer | optional |  This is only used if the markerType is `"CircleMarker"`. If not defined in this parameter, the radius is automatically set to 6.| 	
| `icon` | String | optional | FontAwesome icon name of the marker when `markerType` is set to `"AwesomeMarker"`. |
| `icon2` | String | optional | A second FontAwesome icon can be used when an advanced style is required (e.g: an outline and a filled colour with different colours). Both icons will be stacked using the FontAwesome data-fa transformations.|
| `markerColor` | String | optional | Colour of the marker when `markerType` is set to `"AwesomeMarker"` or `"CircleMarker"`. See variable `MARKER_COLORS` in `src/js/map/consts.js` to get the list of colours. |
| `markerIcon2` | String | optional | Colour of the second marker when there is a second icon `icon2` is required. See variable `MARKER_COLORS` in `src/js/map/consts.js` to get the list of colours. |
| `cluster` | Boolean | optional | If `true`, Leaflet will use the ClusterMarker plugin up to zoom 12 (default), or up to the value specified in the next option. Beyond this zoom threshold, the individual markers will be used as defined above. The clusters are styled using the markerColor option.|
| `disableClusteringAtZoom` | Number | optional | This value is the zoom level at which the clustering will be disabled. It can only be used if the cluster is `true`. If the cluster is `true` and the zoom is empty, the clustering will be disabled at the zoom level 12.|
| `enableSpiderfy` | Boolean | optional |  If `true`, Leaflet will use the spiderfyOnMaxZoom option, which means that a cluster might get spiderfied (all markers individual shown) when clicked on. The spiderfy only occurs if all items within the cluster are still clustered at the maximum zoom level or at the zoom level specified by disableClusteringAtZoom option.|

### Line Polygon Options

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `styleName` | String | Required | The styleName will be used to identify the style of the layer. The following options are available:<br>`"default"` - The default style can be used with lines and polygons. In this style, you choose the colour and properties of the fill and stroke (see other style properties for more details).<br>`"random polygons"` - This option can be chosen for lines and polygons which need to be styled with one colour per object. We do not need to specify the fillcolor since this is done by the function. |
| `stroke` | Boolean | Required | Indicates whether polygons have borders. 
| `strokeColor` | Text | Required | Color of the stroke. See variable `MARKER_COLORS` in `src/js/map/consts.js` to get the list of colours, or enter a hex code string. |
| `opacity` | Number | Required | A number between 0 and 1 defining the layer opacity. | 
| `fillColor` | String | Required | Fill color for polygons. `MARKER_COLORS` in `src/js/map/consts.js` to get the list of colours. |
| `fillOpacity` | Number | Required | Opacity of the fill between 0 and 1. |
| `layerLineDash` | Number | Optional | The line dash style.|
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

### Statistics Options

| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `sectionHeader` | String | optional | The name of the field to use as the title of the Tables section. | `"Tables"` |
| `accordionStatus` | String | Optional | If string "allExplanded" is entered, this will expand all Statistic Accordions on load. | `false`|
| `statisticsTables` | Array | required | A list of Statistic tables to be shown |  |

### Statistics Table Options

* To avoid errors, please ommit **any** options **NOT** being used in your Tables.

<details>

> These option can be written in any order however they will be proccessed in the following order when creating a **table**:
1.  `filters`
2.  `dtypes`
3.  `groupBy` + `aggregations` | **OR** | `functions`
4.  `labels`
4.  `fillNa`
5.  `round`
6.  `sortBy`
7.  `replacers`

</details>
<br>

| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `tableTitle` | String | required | The String to use as the **Title** of the Statistic Table. | |
| `scope` | Array | required | A list of map layers' titles from the layers for whose data should be referenced in **this** table creation. **Note** These layers must all have the same data schema for the fields beings referenced |
| `filters` | Array | optional | A list of object data filters to be applied to all the data in the **scope** for this table.| `false` |
```json
    [
        { 
            "attribute": "Name of attribute/column  | String",
            "operator": "condition to check e.g '==='  | String",             
            "value": "value to compare with i.e. check against | String / Number"
        }
    ]
```
>`operator` options:
>-  "==="&emsp;&emsp;&emsp;&ensp;--> Equals to value and type (String/Number/Boolean), 
>-  ">"&emsp;&emsp;&emsp;&emsp;&emsp;--> Greater than value,
>-  "<"&emsp;&emsp;&emsp;&emsp;&emsp;--> Less than value,
>-  "!=="&emsp;&emsp;&emsp;&emsp;--> Not equal to value and type (String/Number/Boolean),
>-  ">="&emsp;&emsp;&emsp;&emsp; --> Greater or equal to value,
>-  "<="&emsp;&emsp;&emsp;&emsp; --> Less than or equal to value,
>-  "contains"&emsp;&emsp;--> If attribute contains the value substring 


| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `dtypes` | Object | required | An object with `"int32","float32"` Number data types as **keys**  and array of **attributes** to be cast into each corresponding data type key as **values**. Any column/attribute that needs an arithmetic operation performed on it will need to be of `Number` type.| `false` |
```json
    {
     "int32":["attribute_name_1"],
     "float32":["attribute_name_2","attribute_name_3"]
    }
```
| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `groupBy` | Array | optional | A list of attribute/columns to group the data. The **order** of the attributes is important to the output. | `false` |
| `aggregations` | Object | conditional | **Required** with a **groupBy** clause!<br> An Object with the attribute/column names as the **keys** and an Array of  arithmetic operations as the **values**.  | |
```json
    {
            "attribute_name_1":["count","mean"],
            "attribute_name_2":["count"]    
    } 
```
| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `functions` | Object | conditional | **Cannot** be used in conjuction with **groupBy** and **aggregations**.<br>An object where the name of an operation is the **key** and an array of attributes as **values**. Useful for when you need to perform the same operation on different attributes and or perform different operations on different attributes but displayed on the same table.|`false`|

```json
    {
        "sum": ["A"],
        "count": ["B"]
    } 
```
>`functions` ***key*** options: 
> - `"sum"`, `"count"`, `"median"` ,` "mean"`, `"mode"`, `"max"`, 
> - `"var"` --> variance , `"std"` --> standard deviation 
>
>`functions`; flag if used will always result into a table like below:
<div style="display:flex; width:100%; justify-content:center;align-items:center;">
<table>
<tr><th>A</th><th>B</th><th></th><th></th><th>column</th><th>value</th></tr>
<tr> <td>1</td><td>2</td><td></td><td>--------></td><td>A_sum</td><td>6</td></tr>
<tr> <td>5</td><td>9</td><td></td><td></td><td>B_count</td><td>2</td></tr>
</table>
</div>
<br>

| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `labels` | Object | conditional | Use this option to replace column headers in the resultant Table with friendly names. An object where the the default attribute/column title after aggregations or applied functions is the **key**, and the renaming String as the **value**.  | |
>If using `groupBy` and `aggregations`. 
- The **attribute/column** `name` + `_operation` become column titles (keys). These can be replaced with user friendly String values.
```json
{
    "attribute_name_1_count":"Number of A",
    "attribute_name_1_mean":"Average Number of A",
    "attribute_name_2_count":"Number of B"              
}
```

>If using `functions`
```json 
{ "value":" " }
```                   

- The table columns default to two labels: column & value.<br> Since the first table column is always **hidden** by Default the empty string will replace the "value" column title. However this could be replaced with any non empty `String` (trying to overwrite the default with the empty string will generate an error).

> ***Note*** This option affects the table header. The table content will need to be replaced by `replacers` (**see below**) <br>.


| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `replacers` | Array | optional | Use this option to change/replace entries (left most element of a line) in the resultant Table with friendly names. Mostly useful when using functions. This option is formatted as a list of replacement operations. Each object entry will need an **attribute**, a **value**, and a **replacerValue**.| `false` |
```json
    [
        { 
            "attribute"    : "attribute/column name from resulting table | String", 
            "value"        : "target value_to_replace |  String / Number", 
            "replacerValue": "Value to replace with   |  String"
        }
    ]
```
> ***Notes*** 
Table attribute/column names from using functions will default to column and value<br>
This option is used to replace values in the resultant Table. To replace null values in the source table, use `fillNa` (**see below**).<br>



| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `sortBy` | Object | Optional | An object of resulting Table's attribute/column names as keys and sort order as values. Sorting will be handled in the order of the given keys and sort direction. Defaults to **false**. | `false` |
```json
    {
        "column_A":"ascending",
        "column_B":"descending"
    }
```

- The final Table will result in data sorted by first column_A ascending, then by column_B descending.

> ***Note*** If any columns have been **renamed/replaced**, please use the new names.
<br>
<br>

| Option | Type | Required | Description | Default |
| --- | -- | --- | ---- | -- |
| `round` | Object | optional | An object of resulting Table's attribute/column names as keys and the Number of decimal places to round the column data to:<br>e.g. ```{"column_A":2}``` will round column_A to **2** decimal places.|`false` |
| `fillNa` | Object | optional | An object of resulting Table's attribute/column names as keys and the value to fill the data with as value:<br> e.g. ```{"column_A":0}``` will fill the resulting table with 0 in column_A where the values are **NaN**.| `false` |


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
