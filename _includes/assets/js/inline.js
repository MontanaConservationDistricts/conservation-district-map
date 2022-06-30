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

var mapSettings = {{ settingsMap | dump | safe }};
    mapSettings.center = JSON.parse(mapSettings.center);
var generalSettings = {{ settings | dump | safe }};
var settings = { mapSettings, generalSettings };

console.log( settings );


//////////////////////////////////////
//    UPDATE CSS VARIABLE STYLES    //
//////////////////////////////////////

if (generalSettings.primaryColorOverride) { root.style.setProperty('--bs-primary', settings.generalSettings.primaryColorOverride)};
if (generalSettings.secondaryColorOverride) { root.style.setProperty('--bs-secondary', settings.generalSettings.secondaryColorOverride)};