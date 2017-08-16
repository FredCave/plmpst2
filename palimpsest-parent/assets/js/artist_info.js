var ArtistInfo = {

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
			self.nextWorkMouseOverOne();
		});

		$("#artist_info_next").on("mouseout", function(){
			self.nextWorkMouseOutOne();			
		});

		$("#artist_info_next").on("mousemove", function(e){	
			if ( $(e.target).hasClass("next_highlight") ) {
				self.nextWorkMouseOverTwo();
			} else {
				self.nextWorkMouseOverOne();
			}		
		});

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

	}, 

	artistInfoPrep: function ( works ) {

		console.log("Info.artistInfoPrep");

		console.log( 265, works );

		var siteId = $("#wrapper").attr("data-id");
		// GET INFO FROM ARRAY OF WORKS
		var index = 0,
			nextIndex;
		_.each( works, function( work ) {
			if ( siteId === work.work_id ) {
				console.log( 270, work );
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
		console.log( 300, nextIndex, works.length );
		if ( nextIndex >= works.length ) {
			nextIndex = 0;
		}
		var nextWork = works[nextIndex];

		$("#artist_info_next .artist_info_next_title").html( nextWork.work_title );
		$("#artist_info_next .artist_info_next_artist").html( nextWork.work_artist );
		this.nextUrl = nextWork.work_url;

		console.log( 282, nextWork );

	},

	showArtistInfo: function () {

		console.log("Info.showArtistInfo");

		this.infoVisible = true;
		console.log( 344, "infoVisible true" );

		var self = this;

		// HIDE TITLE + SHOW X
		$("#artist_info_show").fadeOut( 2000 );
		// BLOCK TOP ANIMATION
		clearInterval( this.timer );
		console.log( 337, "Interval cleared" );

		$("#info_right").fadeOut( 2000 );
		$("#artist_info_hide").fadeIn( 2000 ).css({"display":"block"});

		$("#artist_info").stop().fadeIn( 2000 );	

		$("#hover_area").hide();

		$("#wrapper").css({"pointer-events":"none"});

		if ( !this.nextIframeLoaded ) {
			_.defer(function(){
				$("#wrapper").before("<iframe class='next_work' src="+ self.nextUrl + "?background=true" +"></iframe>");
				self.nextIframeLoaded = true;				
			});
		}

	},

	hideArtistInfo: function () {

		console.log("Info.hideArtistInfo");

		this.infoVisible = false;
		console.log( 377, "infoVisible false" );

		// SHOW TITLE + HIDE X
		$("#artist_info_show").add("#info_right").fadeIn( 2000 );
		// RESTART TOP ANIMATION
		this.timer = setTimeout( function(){
			Info.hideInfo();
		}, 4000 );			

		$("#artist_info_hide").fadeOut( 2000 );

		$("#artist_info").stop().fadeOut( 2000 );	

		$("#hover_area").show();

		$("#wrapper").css({"pointer-events":""});

	},

	nextWorkMouseOverOne: function () {

		console.log("Info.nextWorkMouseOverOne");

		$("#wrapper").stop().animate({
			opacity: 0.66
		}, 2000 );

		$("iframe.next_work").css({
			opacity: 1
		});
		
		$("#artist_info_next").css({
			opacity: 0.66
		});

		$("#artist_info").add("#artist_info_share").add("#artist_info_hide").stop().animate({
			opacity: 1
		}, 2000 );

	},

	nextWorkMouseOutOne: function () {

		console.log("Info.nextWorkMouseOutOne");

		$("#wrapper").stop().animate({
			opacity: 1
		}, 2000 );

		$("iframe.next_work").css({
			opacity: ""
		});

		$("#artist_info_next").css({
			opacity: ""
		});

	},

	nextWorkMouseOverTwo: function () {

		console.log("Info.nextWorkMouseOverTwo");

		$("#artist_info_next").css({
			opacity: 1
		});

		$("#wrapper").stop().animate({
			opacity: 0.33
		}, 2000 );

		$("iframe.next_work").stop().animate({
			opacity: 1
		}, 2000 );

		$("#artist_info").add("#artist_info_share").add("#artist_info_hide").stop().animate({
			opacity: 0.33
		}, 2000 );

		// TO DO: SOUND ON IN IFRAME

	},

	navToNextWork: function () {

		console.log("Info.navToNextWork");

		console.log( 399, this.nextUrl );
		window.location.href = this.nextUrl;

	},

	showShareIcons: function () {

		console.log("Info.showShareIcons");

		$("#artist_info_share a").fadeIn(2000);

	}, 

	hideShareIcons: function () {

		console.log("Info.hideShareIcons");

		_.delay( function(){
			$("#artist_info_share a").fadeOut(2000);			
		}, 4000 );

	}, 	

}