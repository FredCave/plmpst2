var Page = {

	// filenames : ["pillbox","separation_wall","palestinian_village","settlers_house"], 

	filenames : ["pillbox","separation_wall","palestinian_village","settlers_house","gate","checkpoint","mezuzah","menorah","keychain","chocolate_mould","pendant","earring",], 

	geometries : [],

	currentNoCards : 9, 

	init: function () {

		console.log("Page.init");

		Info.init();

		var self = this;

		this.imagesSize();

		if ( Info.detectMobile() ) {
			// this.mobileInit();
		} else {
			this.scrollInit();
			this.s = skrollr.init({forceHeight: false});			
		}

		this.bindEvents();

		// ONLY LOAD GEOMETRIES IF NOT BACKGROUND MODE
		if ( $("#wrapper").attr("data-bg") !== "true" ) {
			this.geometryLoader();
		}

		_.delay( function(){
			// self.imageHeightCheck();
			self.wrapperHeightCheck();
		}, 2000 );
		
	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$(window).on("resize", _.throttle( function(){

			self.imagesSize();
			Objects.canvasSize();

			// self.imageHeightCheck();
			self.wrapperHeightCheck();

		}, 1000 ));


		// $(window).on("scroll", _.throttle( function(){

			

		// }, 500 ));

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
				"data-top-bottom"   : "top:    0%",
				"data-bottom-top" 	: "top:-11.2%"
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
						
						NewObjects.run();
						// Objects.init();
						self.captionsLoader();

					}, 500);
				}
			});

		});

	},

	captionsLoader: function () {

		console.log("Page.captionsLoader");

		var self = this;

		$("#wallmart_content .list-item").each( function(i){
			console.log( 165 );
			var captionHtml = "<div class='caption'>";
				captionHtml += "<img src='" + TEMPLATE + "/assets/img/caption_" + self.filenames[i] + ".svg' />";
				captionHtml += "</div>";
			$(this).append( captionHtml );
			$(this).find(".caption").fadeIn(1000);
		});

	},

	// imageHeightCheck: function () {

	// 	console.log("Page.imageHeightCheck");

	// 	// IF STILL TWO COLUMNS: RETURN
	// 	// if ( $(window).width() > 1024 ) {
	// 	// 	return;
	// 	// }

	// 	// GET OBJECT_WRAPPER HEIGHT + POSTCARD_WRAPPER HEIGHT
	// 	var winH = $(window).height(), 
	// 		objectsH = winH + $("#objects_wrapper").height(),
	// 		postcardsH = $("#postcards").height() + parseInt( $("#postcards").css("margin-top") );
	// 	console.log( 172, objectsH, postcardsH );

	// 	// ADD POSTCARDS
	// 	if ( objectsH > postcardsH && !this.heightFixed ) {
	// 		// NEED TO APPEND SOME POSTCARDS
	// 			// FIX BODY HEIGHT
	// 		this.heightFixed = true;
	// 		$("body").css({
	// 			"height" 	: objectsH + 20, 
	// 			"overflow" 	: "hidden"
	// 		});
	// 		// GET DIFF
	// 		var diff = objectsH - postcardsH,
	// 			toAdd = Math.ceil( diff / winH );

	// 		console.log( 188, diff, objectsH, postcardsH );

	// 		// CLONE POSTCARDS FROM BEGINNING
	// 		for ( var i = 0; i < toAdd; i++ ) {
	// 			$("#postcards li").eq(i).clone().appendTo( $("#postcards") );
	// 		}

	// 		this.heightFixed = false;

	// 	// REMOVE POSTCARDS
	// 	} else {

	// 		// // FIX BODY HEIGHT
	// 		// this.beingFixed = true;
	// 		// $("body").css({
	// 		// 	"height" 	: objectsH + 20, 
	// 		// 	"overflow" 	: "hidden"
	// 		// });
	// 		// // GET DIFF
	// 		// var diff = objectsH - postcardsH,
	// 		// 	toRemove = Math.ceil( diff / winH );

	// 		// console.log( 211, toRemove );

	// 	}

	// }, 

	wrapperHeightCheck: function () {

		console.log("Page.wrapperHeightCheck");

		// GET OBJECT_WRAPPER HEIGHT + POSTCARD_WRAPPER HEIGHT
		var winH = $(window).height(), 
			objectsH = ( winH * 1.5 ) + $("#wallmart_content").height(),
			wrapperH = $("#wrapper").height();
			// postcardsH = $("#postcards").height() + parseInt( $("#postcards").css("margin-top") );
		console.log( 172, objectsH, wrapperH );

		// GET DIFF
		var diff = objectsH - wrapperH,
			diffNoCards = Math.ceil( diff / winH ),
			newHeight = this.currentNoCards + diffNoCards;

			console.log( 253, this.currentNoCards, newHeight );

		if ( this.currentNoCards !== newHeight ) {

			$("#wrapper").css( "height", ( newHeight * 100 ) + "vh" );
			this.currentNoCards = newHeight;

		}

	}


}


$(document).on("ready", function(){

	Page.init();

});