      
      var map = L.map('map').setView([46.85, -109.45], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
         attribution: '© OpenStreetMap'
      }).addTo(map);


      // var districtBoundaries = new L.GeoJSON.AJAX("_includes/assets/js/district-boundaries_simplified.geojson");
      // districtBoundaries.on('data:loaded', function() {

      //    map.addLayer(this);
      //    console.log(this);
      // });


        // load GeoJSON from an external file
        $.getJSON("_includes/assets/js/district-boundaries_simplified.geojson",function(data){
          // add GeoJSON layer to the map once the file is loaded
          L.geoJson(data, {
              onEachFeature: function (feature, layer) {
                  layer.on('click', showName);

                  //POPUPS
                  var popupContent = '<table>';
                  for (var p in feature.properties) {
                      popupContent += '<tr><td>' + p + '</td><td>'+ feature.properties[p] + '</td></tr>';
                  }
                  popupContent += '</table>';
                  layer.bindPopup(popupContent).openPopup();
              }
          }).addTo(map);
          console.log(data);
        });

        function showName(e) {
             console.log(e.target.feature.properties.DISTRICT_N);
             var targetDistrict = e.target.feature.properties.DISTRICT_N;
         }




module.exports = {
  data: {
    layout: "layouts/base.njk",
    section: "Home"
  },
  render(data) {
    return `<h1>${data.title}</h1><div id='map'>map</div>`;
  }

}