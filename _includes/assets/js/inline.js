if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}



//////////////////////////////////////////////
//             MAPPING FUNCTIONS            //
//////////////////////////////////////////////


var currentPageID  // global variable to hold the most up-to date page/post id
var featureGlobal = {} //empty object populated by clicking features on the map


function pageMapHandler(updatePageID, targetMapLayer) { // FUNCTION CALLED WHEN DISTRICTS ARE LOADED AND VIA BARBA DATA-ENTER HOOK

  if (updatePageID === 'auto') { // if current PageID is set to auto, use the id property of the page/post
      var currentPageID = ( '{{ id }}' ); 
  } else {
      var currentPageID = updatePageID;
  }

  console.log("running pageMapHandler with custom currentPageID: " + currentPageID);

  if (featureGlobal && Object.keys(featureGlobal).length === 0) { //

    var match = globalLayerState[targetMapLayer].activeLayer.eachLayer(function(layer) {
      if (layer.feature.properties.id == currentPageID) {
        console.log( "featureGlobal was not set. Setting to matching layer: " + layer.feature.properties.slug + "." ) 
        featureGlobal = layer;
        centerMap(true, featureGlobal.feature.properties.style.width, mapVerticalCenter);
        featureGlobal._path.classList.add("selected"); 
      }
    })
  } else {
    console.log( "featureGlobal is set" );
    centerMap(true, featureGlobal.feature.properties.style.width, mapVerticalCenter);
    featureGlobal._path.classList.add("selected"); 
  }
}




/////////////////////////////////////////////
//      FETCH SITE SETTINGS FOR JS USE     //
/////////////////////////////////////////////  

console.log( {{ settingsMap | dump | safe }} );

var mapSettings = {{ settingsMap | dump | safe }};
    mapSettings.center = JSON.parse(mapSettings.center);
var generalSettings = {{ settings | dump | safe }};
var settings = { mapSettings, generalSettings };

console.log( settings );


//////////////////////////////////////
//    UPDATE CSS VARIABLE STYLES    //
//////////////////////////////////////

let root = document.documentElement;

if (generalSettings.siteStyling.primaryColorOverride) { 
  var updatedPrimaryColor = generalSettings.siteStyling.primaryColorOverride;
  root.style.setProperty('--bs-primary', updatedPrimaryColor);
  root.style.setProperty('--bs-primary', updatedPrimaryColor);
  root.style.setProperty('--bs-heading-color', updatedPrimaryColor);
  root.style.setProperty('--bs-body-color', updatedPrimaryColor);
};

if (generalSettings.siteStyling.secondaryColorOverride) { 
  var updatedSecondaryColor = generalSettings.siteStyling.secondaryColorOverride;
  root.style.setProperty('--secondary', updatedSecondaryColor);
  root.style.setProperty('--bs-secondary', updatedSecondaryColor);
  root.style.setProperty('--bs-link-color', updatedSecondaryColor);
  root.style.setProperty('--bs-link-hover-color', updatedSecondaryColor);
}