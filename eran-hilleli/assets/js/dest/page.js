var Page = {

	winW: $(window).width(),

	winH: $(window).height(),

	init: function () {

		console.log("Page.init");

		Info.init();

		this.bindEvents();

		this.imagesCalc();
		this.imagesInit();

		this.audioInit();

	}, 

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		var lethargy = new Lethargy();

		$(window).on("mousewheel DOMMouseScroll wheel", _.throttle( function(e) {

		    e.preventDefault()
		    // e.stopPropagation();
		    // if ( lethargy.check(e) !== false ) {
				self.scrollManager(e.originalEvent);		
		    // } else {
		    // 	console.log( 37 );
		    // }

		}, 100 ));

		$(window).on("resize", _.throttle( function(){

			self.winW = $(window).width();
			self.winH = $(window).height();
			self.imagesCalc();

		}, 1000 ));

	}, 

	imagesInit: function () {

		console.log("Page.imageInit");

		$("#wrapper .scroll_image").first().addClass("visible");

	},

	imagesCalc: function () {

		console.log("Page.imagesCalc");

		var winRatio = this.winW / this.winH,
			self = this;

		$("#wrapper .scroll_image").each( function(){

			// GET REAL IMAGE WIDTH
			var imgRatio = parseFloat( $(this).attr("data-ratio") ),
				imgW, imgSrc;
			if ( winRatio > imgRatio ) {
				// IMAGE WIDTH === WINDOW WIDTH
				imgW = self.winW;
			} else {
				// IMAGE WIDTH === WIN HEIGHT * IMG RATIO
				imgW = self.winH * imgRatio;
			}

			if ( imgW <= 400 ) {
				imgSrc = $(this).attr("data-tmb");
			} else if ( imgW > 400 && imgW <= 600 ) {
				imgSrc = $(this).attr("data-med");
			} else if ( imgW > 600 && imgW <= 768 ) {
				imgSrc = $(this).attr("data-mlg");
			} else if ( imgW > 768 && imgW <= 900 ) {
				imgSrc = $(this).attr("data-lrg");
			} else if ( imgW > 900 && imgW <= 1200 ) {
				imgSrc = $(this).attr("data-xlg");
			} else {
				imgSrc = $(this).attr("data-ulg");
			}

			var currentSrc = $(this).attr("style").split("('")[1];
			if ( currentSrc ) { // THIS AVOIDS ERRORS WHEN NO SOURCE SET YET
				currentSrc = currentSrc.split("')")[0];
			}
			if ( imgSrc !== currentSrc ) {
				console.log("Source changed.");
				$(this).attr("style","background-image:url('" + imgSrc + "')");
			}

		});

	}, 

	audioInit: function () {

		console.log("Page.audioInit");

	},

	scrollManager: function ( oe ) {

		console.log("Page.scrollManager");

		console.log( 100, oe );

		if ( oe.wheelDelta ) {
	        delta = -oe.wheelDelta;
	    }
	    if ( oe.detail ) {
	        delta = oe.detail * 40;
	    }
	    if ( delta > 10 ) {
	    	// this.imageNext();
	     	this.imagePrev();
	    } else if ( delta < -10 ) {
	    	// this.imagePrev();	
	    	this.imageNext();
	    }

	}, 

	imageNext: function () {

		console.log("Info.imageNext");

		if ( $(".visible").next().length ) {
			$(".visible").removeClass("visible").next().addClass("visible");
		} else {
			// BACK TO START
			$(".visible").removeClass("visible");
			$(".scroll_image").first().addClass("visible");
		}

	}, 

	imagePrev: function () {

		console.log("Info.imagePrev");

		if ( $(".visible").prev().length ) {
			console.log(144);
			$(".visible").removeClass("visible").prev().addClass("visible");
		} else {
			console.log(147);
			// BACK TO START
			$(".visible").removeClass("visible");
			$(".scroll_image").last().addClass("visible");
		}


	}, 

}


$(document).on("ready", function(){

	Page.init();

});