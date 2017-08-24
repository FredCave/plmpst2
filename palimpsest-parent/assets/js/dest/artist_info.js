var ArtistInfo = {

	artistInfoVisible: false, 

	shareIconsVisible: false, 

	init: function () {

		console.log("ArtistInfo.init");

		this.bindEvents();

	},

	bindEvents: function () {

		console.log("ArtistInfo.bindEvents");

		var self = this;

		$("#artist_info_show").on( "click", function(e) {
			e.preventDefault();
			self.showArtistInfo();
		});

		$("#artist_info_hide").on( "click", function(e) {
			e.preventDefault();
			self.hideArtistInfo();
		});

		$("#artist_info_next").on("mouseover", function(){
			// self.nextWorkHoverLarge();
			self.nextWorkHover();
		});


		$("#artist_info_next").on("mouseout", function(){
			// self.nextWorkHoverLarge();
			self.nextWorkOut();
		});

		// $("#artist_info_next").on("mouseover", function(){
		// 	self.nextWorkOutLarge();
		// });

		// $(window).on("mousemove", _.throttle( function(e){
		// 	if ( self.artistInfoVisible ) {
		// 		if ( e.clientX > $(window).width() * 0.67 ) {
		// 			console.log( 38 );
		// 			self.nextWorkHoverLarge();
		// 		} else {
		// 			self.nextWorkOutLarge();
		// 		}
		// 	}
		// }, 250 ));


		// $("#artist_info_next").on("mousemove", function(e){	
		// 	if ( $(e.target).hasClass("next_highlight") ) {
		// 		self.nextWorkHoverSmall();
		// 	} else {
		// 		self.nextWorkOutLarge();
		// 	}		
		// });

		$("#artist_info_next .next_info").on( "click", function(e) {
			e.preventDefault();
			self.navToNextWork();		
		});

		$("#artist_info_share").on( "mouseover", function(e) {
			self.showShareIcons();	
		});

		$("#artist_info_share").on( "mouseout", function(e) {
			self.hideShareIcons();				
		});

		// FOR MOBILE: TOGGLE
		$("#artist_info_share").on( "click", function(e) {
			// console.log( 79, "Share click" );
			if ( !self.shareIconsVisible ) {
				self.showShareIcons();	
			} else {
				// HIDE IMMEDIATELY
				$("#artist_info_share a").fadeOut(1000);
				self.shareIconsVisible = false;	
			}
		});

		$("#artist_info_share a").on( "click", function(e) {
			self.hideShareIcons();		
		});

	}, 

	artistInfoPrep: function ( works ) {

		console.log("Info.artistInfoPrep");

		// console.log( 265, works );

		var siteId = $("#wrapper").attr("data-id");
		// GET INFO FROM ARRAY OF WORKS
		var index = 0,
			nextIndex;
		_.each( works, function( work ) {
			if ( siteId === work.work_id ) {
				// console.log( 270, work );
				$("#artist_info .artist_info_title").html( work.work_title );
				$("#artist_info .artist_info_artist").html( work.work_artist );
				$("#artist_info .artist_info_description").html( work.work_description );
				$("#artist_info .artist_info_caption").html( work.work_text );
				nextIndex = index + 1; 
				return;
			}
			index++;
		});

		// GET NEXT WORK INFO
		// console.log( 300, nextIndex, works.length );
		if ( nextIndex >= works.length ) {
			nextIndex = 0;
		}
		var nextWork = works[nextIndex];

		$("#artist_info_next .artist_info_next_title").html( nextWork.work_title );
		$("#artist_info_next .artist_info_next_artist").html( nextWork.work_artist );
		this.nextUrl = nextWork.work_url;

		// APPEND TO WRAPPER
		$("#artist_info").appendTo( $("#wrapper") );

	},

	showArtistInfo: function () {

		console.log("Info.showArtistInfo");

		Info.infoVisible = true;
		this.artistInfoVisible = true;
		// console.log( 344, "infoVisible true" );

		var self = this;

		this.artistInfoHeightCheck();

		// HIDE TITLE + SHOW X
		$("#artist_info_show").fadeOut( 1000 );
		// BLOCK TOP ANIMATION
		clearInterval( this.timer );
		// console.log( 337, "Interval cleared" );

		$("#info_right").fadeOut( 1000 );
		$("#artist_info_hide").fadeIn( 1000 ).css({"display":"block"});

		$("#artist_info_text_wrapper").css({
			"color" 		: "transparent", 
			"text-shadow" 	: "none"
		}).find("img").css("opacity","0");
		$(".artist_info_title").css("border-bottom","3px solid transparent");
		$("#artist_info").stop().fadeIn( 500, function(){
			_.delay( function(){
				$("#artist_info_text_wrapper").css({
					"color" 		: "", 
					"text-shadow" 	: ""
				}).find("img").css("opacity","");
				$(".artist_info_title").css("border-bottom","");
			}, 500 );
		});

		$("#artist_info_next").fadeIn(500);
	
		$("#hover_area").hide();

		$("#wrapper").css({"pointer-events":"none"});

		// TOHAR HACK
		$("#arrows").css("z-index","-9");
		$("#video_sources .video").css("z-index","-9");
		// WALLMART
		$("#wallmart_canvas").css("z-index","-9");
		$("#wallmart_content").css("z-index","-9");

		if ( !this.nextIframeLoaded ) {
			
			var next_url = this.nextUrl;

			console.log( 186, "Iframe", next_url );

			if( this.nextUrl.indexOf("atmosphericelectricity") > -1 ) {
				// SWITCH TO HTTPS://
				var href = this.nextUrl.replace( "http://", "https://" );
				next_url = href; 
			} 

			_.defer(function(){
				$("#wrapper").before("<iframe class='next_work' src="+ next_url + "?background=true" +"></iframe>");
				self.nextIframeLoaded = true;				
			});
		}

	},

	hideArtistInfo: function () {

		console.log("Info.hideArtistInfo");

		Info.infoVisible = false;
		this.artistInfoVisible = false;
		console.log( 377, "infoVisible false" );

		// SHOW TITLE + HIDE X
		$("#artist_info_show").add("#info_right").fadeIn( 1000 );
		// RESTART TOP ANIMATION
		this.timer = setTimeout( function(){
			Info.hideInfoBar();
		}, 4000 );			

		$("#artist_info_hide").fadeOut( 1000 );

		$("#artist_info_text_wrapper").css({
			"color" 		: "transparent", 
			"text-shadow" 	: "none"
		}).find("img").css("opacity","0");
		$(".artist_info_title").css("border-bottom","3px solid transparent");
		$("#artist_info").stop().fadeOut( 500, function(){
			_.delay( function(){
				$("#artist_info_text_wrapper").css({
					"color" 		: "", 
					"text-shadow" 	: ""
				}).find("img").css("opacity","");
				$(".artist_info_title").css("border-bottom","");
			}, 500 );
		});

		$("#artist_info_next").fadeOut(500);

		$("#hover_area").show();

		$("#wrapper").css({"pointer-events":""});

		// TOHAR HACK
		$("#arrows").css("z-index","");
		$("#video_sources .video").css("z-index","");
		// WALLMART
		$("#wallmart_canvas").css("z-index","");
		$("#wallmart_content").css("z-index","");

	
	},

	// nextWorkHoverLarge: function () {

	// 	console.log("Info.nextWorkHoverLarge");

	// 	$("#artist_info_text_wrapper").css({
	// 		"background-color" : "rgba(0,0,0,.3)", 
	// 	});

	// 	$("#wrapper").children().not(".info").stop().animate({
	// 		opacity: 0.66
	// 	}, 1000 );

	// 	$("iframe.next_work").css({
	// 		opacity: 1
	// 	});
		
	// 	$("#artist_info_next").css({
	// 		opacity: 0.66
	// 	});

	// 	$("#artist_info").add("#artist_info_share").add("#artist_info_hide").stop().animate({
	// 		opacity: 1
	// 	}, 1000 );

	// },

	// nextWorkOutLarge: function () {

	// 	console.log("Info.nextWorkOutLarge");

	// 	$("#artist_info_text_wrapper").css({
	// 		"background-color" : "", 
	// 	});

	// 	$("#wrapper").children().not(".info").stop().animate({
	// 		opacity: 1
	// 	}, 2000 );

	// 	$("iframe.next_work").css({
	// 		opacity: ""
	// 	});

	// 	$("#artist_info_next").css({
	// 		opacity: ""
	// 	});

	// },

	// nextWorkHoverSmall: function () {

	// 	console.log("Info.nextWorkHoverSmall");

	// 	$("#artist_info_next").css({
	// 		opacity: 1
	// 	});

	// 	$("#wrapper").children().not(".info").stop().animate({
	// 		opacity: 0.33
	// 	}, 1000 );

	// 	$("iframe.next_work").stop().animate({
	// 		opacity: 1
	// 	}, 500 );

	// 	$("#artist_info").add("#artist_info_share").add("#artist_info_hide").stop().animate({
	// 		opacity: 0.33
	// 	}, 1000 );

	// 	// TO DO: SOUND ON IN IFRAME

	// },

	nextWorkHover: function () {

		console.log("Info.nextWorkHover");

		$("#artist_info_next").css({
			"opacity" : "1"
		});

		$("#wrapper").stop().animate({
			"opacity" : "0.65"
		}, 1000 );

		$("iframe.next_work").css({
			"opacity" : "1"
		});

	},

	nextWorkOut: function () {

		console.log("Info.nextWorkHover");

		$("#artist_info_next").css({
			"opacity" : ""
		});

		$("#wrapper").stop().animate({
			"opacity" : "1"
		}, 1000 );

		$("iframe.next_work").css({
			"opacity" : ""
		});

	},

	navToNextWork: function () {

		console.log("Info.navToNextWork");

		console.log( 399, this.nextUrl );
		window.location.href = this.nextUrl;

	},

	showShareIcons: function () {

		console.log("Info.showShareIcons");

		$("#artist_info_share a").fadeIn(500);
		this.shareIconsVisible = true;

	}, 

	hideShareIcons: function () {

		console.log("Info.hideShareIcons");

		_.delay( function(){
			$("#artist_info_share a").fadeOut(1000);
			this.shareIconsVisible = false;			
		}, 3000 );

	}, 	

	artistInfoHeightCheck: function () {

		console.log("Info.artistInfoHeightCheck");

		// var contentH = $("#artist_info_inner_wrapper").height() + ( $(window).height() * 0.185 );
		// var sharePos = $("#artist_info_share_wrapper").position().top;
		
		// console.log( 264, contentH, sharePos - 44 );

		// if ( contentH > sharePos - 44 ) {
				
		// 	console.log( 266, "Relative" );

		// 	// FIX TO ARTIST_INFO_SHARE_WRAPPER POSITION
		// 	$("#artist_info_proxy").css({
		// 		"position" 		: "relative",
		// 		"bottom" 		: "inherit",
		// 		"left" 			: "0",
		// 		"margin-bottom" : "96px"
		// 	});
		// } else {

		// 	console.log( 277, "Fixed" );

		// 	// ABSOLUTE
		// 	$("#artist_info_share").css()
		// 	$("#artist_info_proxy").css({
		// 		"position" 		: "",
		// 		"bottom" 		: "",
		// 		"left" 			: "",
		// 		"margin-bottom" : ""	
		// 	});
		// }

		// console.log( 260, contentH, sharePos, $("#artist_info_share").position().top );

	}

}