//init barba with a simple opacity transition 

barba.init({
	transitions: [{
	  name: 'opacity-transition',
	  leave(data) {
	    return gsap.to(data.current.container, {
	      opacity: 0
	    });
	  },
	  enter(data) {

		//Move Map
		// Calculate the offset
		var offset = document.querySelector('.overlay').offsetWidth*0.4;
		console.log(offset);
		// Then move the map
		map.panBy(new L.Point(offset, 0), {animate: false});
		console.log(map);
	  	
	    return gsap.from(data.next.container, {
	      opacity: 0
	    });
	  }
	}]
});

	
