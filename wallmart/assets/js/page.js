var Page = {

	init: function () {

		console.log("Page.init");

		Info.init();

		this.scrollInit();

		this.s = skrollr.init({forceHeight: false});

		this.bindEvents();

		Objects.init();
		Objects.animate();

	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		// $(window).on( "scroll", _.throttle( function(){

		// 	self.scrollManager( $(window).scrollTop() );

		// }, 250 ));

	},

	scrollInit: function ( scrollTop ) {

		console.log("Page.scrollInit");

		// GET WINDOW HEIGHT
		var winH = $(window).height();
		console.log( 35, winH );

		// ASSIGN HEIGHT MARKERS TO ELEMS
		$("#postcards li").each( function(i){

			$(this).find(".postcard_image").attr({
				"data-top-bottom"   : "top:0px",
				"data-bottom-top" 	: "top:-10%"
			});
			
			console.log( 39, i );
		});


	}

}


$(document).on("ready", function(){

	Page.init();

});