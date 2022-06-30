
//////////////////////////////////////////////
//             MAPPING FUNCTIONS            //
//////////////////////////////////////////////

var featureGlobal = {} //empty object populated by clicking features on the map


// MAP CENTER & ACTIVE AREA
function centerMap(selectedFeature, w) {
	console.log("------- CENTERING MAP -------")

  if (selectedFeature == true) {
    var centerCoordinates = featureGlobal.getBounds().getCenter();
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
    
  var activeAreaWidth = window.innerWidth - overlayWidth;
  console.log('setting active area width to: '+ activeAreaWidth + 'px')

  defineViewport("0px", "0px", activeAreaWidth.toString() + "px", "100vh");

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
	centerMap(); // center map with reset center coords and activeArea
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
				centerMap(true, featureGlobal.feature.properties.style.width);
	  	} else {
				centerMap(false, '0px');
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

	

//////////////////////////////////////////////
//                  UI                      //
//////////////////////////////////////////////

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

// var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//   return new bootstrap.Tooltip(tooltipTriggerEl, {
// 		customClass: "overlay-tootip",
// 		trigger: "manual",
// 		title: "<p>Copied</p>",
// 		container: "body",
// 		delay: { "show": "100", "hide": "1000" }
//   })
// })
