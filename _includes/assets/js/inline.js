////////////////////////////////////////////////////
//              LOAD CSV + GEOJSON                //
////////////////////////////////////////////////////

let csvData = [];

Promise.all([
  fetch('data/districts.csv').then(res => res.text()),
  fetch('data/districts.geojson').then(res => res.json())
]).then(([csvText, geojson]) => {

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  csvData = parsed.data;

  const joinedGeoJSON = joinData(geojson, csvData);

  buildMap(joinedGeoJSON);

}).catch(err => {
  console.error("Error loading data:", err);
});

////////////////////////////////////////////////////
//                 DATA JOIN                      //
////////////////////////////////////////////////////

function joinData(geojson, csv) {

  geojson.features.forEach(feature => {
    const geoID = feature.properties.id;

    const match = csv.find(row => row.id == geoID);

    if (match) {
      feature.properties = {
        ...feature.properties,
        ...match
      };
    }
  });

  return geojson;
}

////////////////////////////////////////////////////
//              BUILD THE MAP                     //
////////////////////////////////////////////////////

function buildMap(geojsonData) {

  // Create map
  const map = L.map('map').setView([46.8, -110.0], 6);

  // Add basemap (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let geoLayer;

  function style(feature) {
    return {
      color: feature.properties.color || "#3388ff",
      weight: 2,
      fillOpacity: 0.5
    };
  }

  function onEachFeature(feature, layer) {

    layer.on({
      click: function () {
        featureGlobal = layer;

        if (layer._path) {
          layer._path.classList.add("selected");
        }

        const bounds = layer.getBounds();
        map.fitBounds(bounds);
      }
    });

    // Optional popup
    if (feature.properties.name) {
      layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
    }
  }

  geoLayer = L.geoJSON(geojsonData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  // store globally if needed
  window.globalLayerState = {
    districts: {
      activeLayer: geoLayer
    }
  };

}

////////////////////////////////////////////////////
//             MAPPING FUNCTIONS                  //
////////////////////////////////////////////////////

var currentPageID = null;
var featureGlobal = {};

function pageMapHandler(updatePageID, targetMapLayer) {

  if (!targetMapLayer || !window.globalLayerState) return;

  currentPageID = updatePageID || null;

  if (!currentPageID) return;

  globalLayerState[targetMapLayer].activeLayer.eachLayer(function(layer) {

    if (layer.feature.properties.id == currentPageID) {

      featureGlobal = layer;

      const bounds = layer.getBounds();
      layer._map.fitBounds(bounds);

      if (layer._path) {
        layer._path.classList.add("selected");
      }

    }
  });
}

////////////////////////////////////////////////////
//          OPTIONAL CSS OVERRIDES                //
////////////////////////////////////////////////////

let root = document.documentElement;

const primaryColor = "#2c7a7b";
const secondaryColor = "#68d391";

root.style.setProperty('--bs-primary', primaryColor);
root.style.setProperty('--bs-heading-color', primaryColor);
root.style.setProperty('--bs-body-color', primaryColor);

root.style.setProperty('--secondary', secondaryColor);
root.style.setProperty('--bs-secondary', secondaryColor);
root.style.setProperty('--bs-link-color', secondaryColor);
root.style.setProperty('--bs-link-hover-color', secondaryColor);
