//////////////////////////////////////////////
//             MAPPING FUNCTIONS            //
//////////////////////////////////////////////

var featureGlobal = {} //empty object populated by clicking features on the map


// MAP CENTER & ACTIVE AREA
function centerMap(selectedFeature, w, h) {
	console.log("------- CENTERING MAP -------")

  if (selectedFeature == true) {
  	console.log(featureGlobal);
  	if (featureGlobal.feature.geometry.type == "Point"){
  		var centerCoordinates = {"lat" : featureGlobal.feature.geometry.coordinates[1], "lng" : featureGlobal.feature.geometry.coordinates[0]};
  	} else {
  		var centerCoordinates = featureGlobal.getBounds().getCenter();
  	}
    console.log('selectedFeature center: {lat:' + centerCoordinates.lat + ', lng:' + centerCoordinates.lng + '}');
  } else {
    var centerCoordinates = {}
    centerCoordinates.lat = openingView[0];
    centerCoordinates.lng = openingView[1];
    console.log('opening view center: {lat:' + centerCoordinates.lat + ', lng:' + centerCoordinates.lng + '}');
  }

  if(selectedFeature == true) {
    var overlayWidth = document.querySelector('.overlay-inner').offsetWidth;
    //var overlayWidth = w; // w doesn't work, needs to be a number, right now is a "600px" string
    console.log('selectedFeature overlay exists, width is: ' + overlayWidth + 'px');
  } else {
    var overlayWidth = 0;
    console.log('no selectedFeature overlay, width is: ' + overlayWidth + 'px' );
  }

  var activeAreaHeight = window.innerHeight - h;
  var activeAreaWidth = window.innerWidth - overlayWidth;
  console.log('setting active area width to: '+ activeAreaWidth + activeAreaHeight)

  defineViewport("0px", "0px", activeAreaWidth.toString() + "px", activeAreaHeight.toString() + "px");

  map.setView(new L.LatLng(centerCoordinates.lat, centerCoordinates.lng), map.getZoom() );

	console.log("------- CENTERED -------")
}

function resetMap() {
	console.log("------- RESETTING MAP ----")

	if (document.querySelector('.selected')){ // removes any css .selected styling rules
		document.querySelector('.selected').classList.remove('selected');
	} 

	featureGlobal = {}; //empty selected feature
	barba.go("/"); // barba transition to home
	centerMap(false, '0px', mapVerticalCenter); // center map with reset center coords and activeArea
	console.log("------- RESET -----------");
}


// GSAP NON-BARBA ANIMATIONS
// return gsap.from(data.next.container, {
//   opacity: 0
// });




////////////////////////////
//     BARBA HOOKS        //
////////////////////////////


// do something before the transition starts
barba.hooks.before(() => {
    document.querySelector('html').classList.add('is-transitioning'); // TURNS OFF DOUBLE CLICK ON HTML DOM ELEMENT
});
// do something after the transition finishes
barba.hooks.after(() => {
    document.querySelector('html').classList.remove('is-transitioning'); // TURNS OFF DOUBLE CLICK ON HTML DOM ELEMENT
});




//init barba with a simple opacity transition 
barba.init({
  prevent: ({ el }) => el.classList && el.classList.contains('barba-prevent'),
	debug: true,
	transitions: [{
	  sync: true,
	  name: 'opacity-transition',
	  leave(data) {
	  	console.log("------- ON DATA LEAVE -------");
	  	if (featureGlobal.feature){
				centerMap(true, featureGlobal.feature.properties.style.width, mapVerticalCenter);
	  	} else {
				centerMap(false, '0px', mapVerticalCenter);
	  	}
			console.log("------- DATA LEFT -------");
	    return gsap.to(data.current.container, {
	      opacity: 0
	    });
	  },
	  enter(data) {

	    return gsap.from(data.next.container, {
	      opacity: 0
	    });

	  },
	  after(data) {

	  }
	}],

	views: [{

		namespace: 'overlay',
	    enter(data) {
	      	// overlay view functions
	    }

	}]
});


function toggleLayer(setLayerHandlerName, toggleMenuItem){


		// remove all active layers, add all dissabled layers, if layer handler name is a match, add active layer
		for (var i = 0; i < globalLayerState.length; i++) {
			if (globalLayerState[i].layerHandlerName !== setLayerHandlerName) {
				map.removeLayer(globalLayerState[i].activeLayer);
				map.addLayer(globalLayerState[i].disabledLayer);
				globalLayerState[i].active = false;
			} if (globalLayerState[i].layerHandlerName == setLayerHandlerName) {
				map.removeLayer(globalLayerState[i].disabledLayer);
				map.addLayer(globalLayerState[i].activeLayer);
				globalLayerState[i].active = true;
			}
		}

		// get all features
		var mapHandlerNavItems = document.querySelectorAll('.map-handler-nav .nav-link');
		console.log(mapHandlerNavItems);
		for (i=0; i < mapHandlerNavItems.length; i++){
  		mapHandlerNavItems[i].classList.remove('active');
  	}
  	toggleMenuItem.classList.add('active');

		console.log(globalLayerState);

	}

	

//////////////////////////////////////////////
//                  UI                      //
//////////////////////////////////////////////

// iniialize all tooltips
const tooltipTriggerList = document.querySelectorAll('.basic-tooltip[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


function copy(elem, messageClicked){
  navigator.clipboard.writeText(elem.textContent);
  console.log(elem.textContent);
	var tooltip = bootstrap.Tooltip.getOrCreateInstance(elem, {
		customClass: "overlay-tootip",
		trigger: "hover focus",
		html: true,
		title: "<span id='update-on-click'>📋</span>",
		container: "body",
		delay: {"show": 0, "hide": 300}
	}); // Returns a Bootstrap tooltip instance
	// console.log(tooltip);
	tooltip.show();

	elem.onclick = function(elem) {
			tooltipContent = document.querySelector('.tooltip #update-on-click');
			tooltipContent.innerHTML="Copied!"
	}
	elem.onmouseout = function(elem) {
			setTimeout(() => {
		  	tooltip.hide();
			}, "300");
	}
}
