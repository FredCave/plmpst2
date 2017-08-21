var Page = {

	// filenames : ["pillbox","separation_wall","palestinian_village","settlers_house"], 

	filenames : ["pillbox","separation_wall","palestinian_village","settlers_house","gate","checkpoint","mezuzah","menorah","keychain","chocolate_mould","pendant","earring",], 

	geometries : [],

	init: function () {

		console.log("Page.init");

		Info.init();

		this.imagesSize();

		if ( !Info.detectMobile() ) {
			// this.mobileInit();
		} else {
			this.scrollInit();
			this.s = skrollr.init({forceHeight: false});			
		}

		this.bindEvents();

		// LOAD GEOMETRIES
		this.geometryLoader();
		
	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$(window).on("resize", _.throttle( function(){

			self.imagesSize();
			Objects.canvasSize();

		}, 1000 ));


		$(window).on("scroll", _.throttle( function(){

			// console.log( 43, $("#canvas").height(), $("#objects_wrapper").height() );

		}, 500 ));

	},

	imagesSize: function () {

		console.log("Page.imagesSize");

		var winRatio = $(window).width() / $(window).height();

		$("#postcards li").find(".postcard_image").each( function(){

			// GET REAL IMAGE WIDTH
			var imgRatio = parseFloat( $(this).attr("data-ratio") ),
				imgW, imgSrc;

			if ( winRatio > imgRatio ) {
				// IMAGE WIDTH === WINDOW WIDTH
				imgW = $(window).width();
			} else {
				// IMAGE WIDTH === WIN HEIGHT * IMG RATIO
				imgW = $(window).height() * imgRatio;
			}

			if ( imgW <= 600 ) {
				imgSrc = $(this).attr("data-mlg");
			} else if ( imgW > 600 && imgW <= 768 ) {
				imgSrc = $(this).attr("data-lrg");
			} else if ( imgW > 768 && imgW <= 900 ) {
				imgSrc = $(this).attr("data-xlg");
			} else {
				imgSrc = $(this).attr("data-ulg");
			} 

			var currentSrc = $(this).attr("style").split('url("')[1];
			if ( currentSrc !== undefined ) {
				currentSrc = currentSrc.split('")')[0];
			} 
			if ( imgSrc !== currentSrc ) {
				console.log("Source changed.");
				$(this).attr("style",'background-image:url("' + imgSrc + '")');
			}

		});

	},

	scrollInit: function ( scrollTop ) {

		console.log("Page.scrollInit");

		// GET WINDOW HEIGHT
		var winH = $(window).height();

		// ASSIGN HEIGHT MARKERS TO ELEMS
		$("#postcards li").each( function(i){

			$(this).find(".postcard_image").attr({
				"data-top-bottom"   : "top:0px",
				"data-bottom-top" 	: "top:-20%"
			});
			
		});

	},

	geometryLoader : function () {
		
		console.log("Page.geometryLoader");

		var self = this;

		// LOOP THROUGH ARRAY OF FILENAMES
		_.each( this.filenames, function( filename ) {
			// LOAD FILE
			var loader = new THREE.STLLoader();
			loader.load( TEMPLATE + '/assets/objects/' + filename + "_centered.stl", function ( geometry ) {			
				// GIVE FILENAME TO GEOMETRY
				geometry.name = filename;
				self.geometries.push( geometry );
				// IF PALESTINIAN OBJECT (SHOULD BE LAST FILE...?)
				if ( filename === "palestinian_village" ) {
					_.delay( function(){
						Objects.init();
						self.captionsLoader();
					}, 500);
				}
			});

		});

	},

	captionsLoader: function () {

		console.log("Page.captionsLoader");

		var self = this;

		$("#objects_wrapper .list-item").each( function(i){
			var captionHtml = "<div class='caption'>";
				captionHtml += "<img src='" + TEMPLATE + "/assets/img/caption_" + self.filenames[i] + ".svg' />";
				captionHtml += "</div>";
			$(this).append( captionHtml );
			$(this).find(".caption").fadeIn(1000);

		});

	}

}


$(document).on("ready", function(){

	Page.init();

});