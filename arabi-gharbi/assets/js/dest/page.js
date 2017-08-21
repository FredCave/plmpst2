var Page = {

	winW: $(window).width(),

	winH: $(window).height(),

	init: function () {

		console.log("Page.init");

		Info.init();

		Webcam.init();

		this.bindEvents();

		this.contentSize();

		this.slideshowsLoad();

		Twitter.init();

	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$(".group_one").on( "mouseover", function() {
			$(".group_one").not(".no_filter").css({
				"filter" : "grayscale(0%)"
			});
		});
		
		$(".group_one").on( "mouseout", function() {
			$(".group_one").not(".no_filter").css({
				"filter" : ""
			});
		});

		$(".group_two").on( "mouseover", function() {
			$(".group_two").not(".no_filter").css({
				"filter" : "grayscale(0%)"
			});
		});
		
		$(".group_two").on( "mouseout", function() {
			$(".group_two").not(".no_filter").css({
				"filter" : ""
			});
		});

		$(window).on("resize", _.throttle( function(){

			self.winW = $(window).width();
			self.winH = $(window).height();
			self.contentSize();

		}, 50 ));

	},

	contentSize: function () {

		console.log("Page.contentSize");

		// RESIZE #CONTENT_FRAME TO SAME SIZE AS #FRAME

		// GET REAL FRAME SIZE
		var winRatio = this.winW / this.winH, 
			frameRatio = 1.6,
			frameW, 
			frameLeft = 0, 
			self = this;

		if ( winRatio > frameRatio ) {
			// IMAGE WIDTH === WINDOW WIDTH
			frameW = self.winW;
			frameLeft = 0;
			frameTop = 0 - ( ( frameW / 1.6 ) - self.winH ) / 2;;
		} else {
			// IMAGE WIDTH === WIN HEIGHT * IMG RATIO
			frameW = self.winH * frameRatio;
			frameLeft = 0 - ( frameW - self.winW ) / 2;
			frameTop = 0;
		}

		$("#content_frame").css({
			"width"  : frameW,
			"height" : frameW / 1.6,
			"left"	 : frameLeft,
			"top"	 : frameTop
		});

		// RESIZE YOUTUBE PLAYER
		var ytRect = document.getElementById("youtube_playlist").getBoundingClientRect();
		var ytHeight = this.winH - ytRect.top,
			ytWidth = ytRect.right;

		$("#youtube_playlist iframe").css({
			"width" : ytWidth,
			"height" : ytHeight
		});
		
		// RESIZE TWITTER WRAPPER
		var twRect = document.getElementById("twitter_wrapper").getBoundingClientRect();
		var twHeight = twRect.bottom,
			twWidth = twRect.right - twRect.left;

		$("#twitter_wrapper ul").css({
			"width" : twWidth,
			"height" : twHeight
		});


	},

	slideshowsLoad: function () {

		console.log("Page.slideshowsLoad");

		var self = this;

		// HACK TO GET CORRECT POST ID ON BOTH LOCALHOST AND SERVER
		var postId = 22;
		if ( ROOT.indexOf("localhost") > -1 ) {
			postId = 14;
		}

		// GET POST INFO
		$.ajax({
		    url: ROOT + "/wp-json/wp/v2/posts/" + postId,
		    success: function(data) {

				self.slideshowData = data.acf;

				// ELEMENTS FOR WEBCAM
				Webcam.imagesFrames = data.acf.webcam_frames;
				Webcam.imagesDraggable = data.acf.webcam_draggable;
				Webcam.imagesTracking = data.acf.webcam_tracking;

				// Webcam.initialState( data.acf.webcam_archive_images );

				self.slideshowsInit();

		    },
		    error: function(errorThrown){
		        console.log(errorThrown);
		    }
		}); 

	}, 

	shuffle: function ( a ) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    },

	slideshowsInit: function () {

		console.log("Page.slideshowsInit");

		// IF MOBILE: REMOVE CSS GRAYSCALE FILTER
		if ( Info.detectMobile() ) {
			$(".slideshow_wrapper").css("filter","none").addClass("no_filter");
		}

		// CREATE ARRAY OF IMAGES + MOVIES
		this.slideshowContent = this.slideshowData.images.concat( this.slideshowData.movies );

		// SHUFFLE ARRAY
		this.shuffle( this.slideshowContent );

		var currentVert = [], 
			currentHoriz = [], 
			self = this;

		// SEND CONTENT TO FRAMES
		function sendToFrames ( init ) {
			console.log("Page.slideshowsInit.sendToFrames");

			// ROLL A DICE TO KNOW IF VIDEOS SHOULD BE INCLUDED OR NOT
			var dice = Math.random();
			self.movieQuota = 0;
			if ( dice > 0.5 ) {
				self.movieQuota = 1;
			} 
			// console.log( 200, "Movie quota is ", self.movieQuota );

			// GET 2 HORIZONTAL + 2 VERTICAL (MOVIES ARE HORIZONTAL)
			// PUSH TO currentVert + currentHoriz
			for ( var i = self.slideshowContent.length - 1; i >= 0; i-- ) {
				
				var elem = self.slideshowContent[i];
				
				if ( 'movie' in elem ) {
					// console.log( 195, "Webcam running: ", Webcam.running );
					if ( !Webcam.running && currentHoriz.length < 2 ) {
						currentHoriz.push( self.slideshowContent.splice(i,1) );	
						self.movieQuota = 0;
					}	
				// ELSE IF IMAGE: SORT INTO VERT AND HORIZ
				} else if ( 'image' in elem ) {
					if ( elem['image']['height'] > elem['image']['width'] ) {
						if ( currentVert.length < 2 ) {
							currentVert.push( self.slideshowContent.splice(i,1) );
						}
					} else {
						// IF MOVIE QUOTA IS 1: KEEP GOING
						if ( currentHoriz.length < 2 && self.movieQuota === 0 ) {
							currentHoriz.push( self.slideshowContent.splice(i,1) );
						}
					}
				}

			}
			
			var delay_2 = 4000,
				delay_3 = 8000,
				delay_4 = 15000; 

			// IF FIRST TIME
			if ( init ) {
				delay_2 = 0;
				delay_3 = 0;
				delay_4 = 0; 
			}

			self.injectImage( "#slideshow_1", currentVert[0] );
			_.delay( function(){
				self.injectImage( "#slideshow_2", currentHoriz[0] );				
			}, delay_2 );
			_.delay( function(){
				self.injectImage( "#slideshow_3", currentHoriz[1] );				
			}, delay_3 );
			_.delay( function(){
				self.injectImage( "#slideshow_4", currentVert[1] );		
				currentVert.length = 0;
				currentHoriz.length = 0;		
			}, delay_4 );

		}
		sendToFrames( true ); // CALL WITH NO DELAY ON IMAGES
		setInterval( function () {
			sendToFrames();
		}, 20000 );

	},

	injectImage: function ( target, image ) {

		console.log("Page.injectImage");

		// IF NOT WEBCAM
		if ( target !== "#webcam_initial_image" ) {
			// PUT IMAGE BACK TO FRONT OF ARRAY
			this.slideshowContent.unshift( image[0] );
		}

		var targetW = $(target).width(),
			targetH = $(target).height(),
			self = this;

		// IMG CALC ONLY IF IMAGE
		// FIRST OPTION IS FOR WEBCAM IMAGES FROM SERVER
		if ( typeof image[0] === 'string' || 'image' in image[0] ) {

			var imgSrc;

			// IF WEBCAM IMAGE STRING
			if ( typeof image[0] === 'string') {
				imgSrc = image;
			} else {

				var imgSizes = image[0]["image"].sizes; 
					
				// VERT TARGETS
				if ( target === "#slideshow_1" || target === "#slideshow_4" ) {
					targetW = targetH;
				}
				// GET TARGET WIDTH
				if ( targetW <= 400 ) {
					imgSrc = imgSizes.medium;
				} else if ( targetW > 400 && targetW <= 600 ) {
					imgSrc = imgSizes.medium_large;
				} else if ( targetW > 600 && targetW <= 768 ) {
					imgSrc = imgSizes.large;
				} else if ( targetW > 768 && targetW <= 900 ) {
					imgSrc = imgSizes.extralarge;
				} else {
					imgSrc = imgSizes.ultralarge;
				}

			}

			// PRELOAD IMAGE AND THEN INJECT INTO WRAPPER
			var img = img = new Image();
			$(img).attr("src", imgSrc ).on("load", function(){
				_.defer( function(){
					$(target).empty().css("background-image","url('" + imgSrc + "')");					
				});
			});

		} else {

			var movieClass = "";
			if ( image[0].movie.width <= image[0].movie.height ) {  
				movieClass = "full_width";
			}

			// MOVIE
			$(target).empty().append("<video id='video' class='" + movieClass + "' muted autoplay playsinline><source src='" + image[0]['movie'].url + "' type='video/mp4'></video>");
			$("#video").on( "ended", function(){
				// console.log( 313, "Video ended." );
				// INJECT NEW IMAGE
				for ( var i = self.slideshowContent.length - 1; i >= 0; i-- ) {
					var elem = self.slideshowContent[i];
					// GET ONLY ONE HORIZONTAL IMAGES
					if ( 'image' in elem ) {
						if ( elem['image']['height'] < elem['image']['width'] ) {
							var image = self.slideshowContent.splice(i,1);
							self.injectImage( target, image );
							break;
						} 
					} 
				}
				// REMOVE VIDEO PLAYER
				$(this).remove();

			});

		}

	},

	removeVideos: function () {

		console.log("Page.removeVideos");

		var self = this;

		// CALLED FROM WEBCAM OBJECT TO AVOID ANY CONFLICTS BETWEEN IT AND THE VIDEOS
		$(".slideshow_wrapper").each( function(){

			var wrapper = $(this);

			if ( $(this).find("video").length ) {
				// console.log( 318, "Video needs removing." );
				_.delay( function(){
					// INJECT NEW IMAGE
					for ( var i = self.slideshowContent.length - 1; i >= 0; i-- ) {
						var elem = self.slideshowContent[i];
						// GET ONLY ONE HORIZONTAL IMAGES
						if ( 'image' in elem ) {
							if ( elem['image']['height'] < elem['image']['width'] ) {
								var image = self.slideshowContent.splice(i,1);
								self.injectImage( "#" + wrapper.attr("id"), image );
								break;
							} 
						} 
					}
					wrapper.empty();
				}, 2000 );
			}

		});

	}

}


$(document).on("ready", function(){

	Page.init();

});