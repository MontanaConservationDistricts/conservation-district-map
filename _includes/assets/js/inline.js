if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
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