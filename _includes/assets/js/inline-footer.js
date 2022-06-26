//////////////////////////////////////////////
//             MAPPING FUNCTIONS            //
//////////////////////////////////////////////

var featureGlobal = {} //empty object populated by clicking features on the map


// MAP CENTER & ACTIVE AREA
function centerMap(selectedFeature, w) {

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
  	debug: true,
	transitions: [{
	  sync: true,
	  name: 'opacity-transition',
	  leave(data) {

	  	if (featureGlobal.feature){
			centerMap(true, featureGlobal.feature.properties.overlay.width);
	  	} else {
			centerMap(false, '0px');
	  	}

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

	
