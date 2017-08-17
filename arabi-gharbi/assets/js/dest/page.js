var Page = {

	winW: $(window).width(),

	winH: $(window).height(),

	init: function () {

		console.log("Page.init");

		// Info.init();

		Webcam.init();

		this.bindEvents();

		this.contentSize();

		this.slideshowsLoad();

	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$(".group_one").on( "mouseover", function() {
			$(".group_one").css({
				"filter" : "grayscale(0%)"
			});
		});
		
		$(".group_one").on( "mouseout", function() {
			$(".group_one").css({
				"filter" : ""
			});
		});

		$(".group_two").on( "mouseover", function() {
			$(".group_two").css({
				"filter" : "grayscale(0%)"
			});
		});
		
		$(".group_two").on( "mouseout", function() {
			$(".group_two").css({
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

	},

	slideshowsLoad: function () {

		console.log("Page.slideshowsLoad");

		var self = this;

		// GET POST INFO
		$.ajax({
		    // url: ROOT + "/wp-json/wp/v2/posts/14",
		    url: ROOT + "/wp-json/wp/v2/posts/22", // 22 ON SERVER
		    success: function(data) {

				self.slideshowData = data.acf;
				self.loadWebcamArchive();

				// ELEMENTS FOR WEBCAM
				Webcam.imagesFrames = data.acf.webcam_frames;
				Webcam.imagesDraggable = data.acf.webcam_draggable;
				Webcam.imagesTracking = data.acf.webcam_tracking;

				Webcam.initialState( data.acf.webcam_archive_images );

		    },
		    error: function(errorThrown){
		        console.log(errorThrown);
		    }
		}); 

	}, 

	loadWebcamArchive: function () {

		console.log("Page.loadWebcamArchive");

		var self = this;

		$.ajax({
			type: "GET",
			url: ROOT + "/_tmp_dir/get_server_files.php",
			dataType: "json"
		}).done( function(data) {
		
			self.webcamImages = data;
			self.slideshowsInit();

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

		// CREATE ARRAY OF IMAGES + MOVIES
		this.slideshowContent = this.slideshowData.images.concat( this.slideshowData.movies ).concat( this.webcamImages );

		// SHUFFLE ARRAY
		this.shuffle( this.slideshowContent );

		var currentVert = [], 
			currentHoriz = [], 
			self = this;

		// SEND CONTENT TO FRAMES
		function sendToFrames ( init ) {
			console.log("Page.slideshowsInit.sendToFrames");

			// GET 2 HORIZONTAL + 2 VERTICAL (MOVIES ARE HORIZONTAL)
			// PUSH TO currentVert + currentHoriz
			for ( var i = self.slideshowContent.length - 1; i >= 0; i-- ) {
				var elem = self.slideshowContent[i];
				// IF WEBCAM IMAGE
				if ( typeof elem === 'string' && elem.indexOf("images/img_") > -1 ) {
					if ( currentVert.length < 2 ) {
						currentVert.push( self.slideshowContent.splice(i,1) );
					}
				// ELSE IF IMAGE: SORT INTO VERT AND HORIZ
				} else if ( 'image' in elem ) {
					if ( elem['image']['height'] > elem['image']['width'] ) {
						if ( currentVert.length < 2 ) {
							currentVert.push( self.slideshowContent.splice(i,1) );
						}
					} else {
						if ( currentHoriz.length < 2 ) {
							currentHoriz.push( self.slideshowContent.splice(i,1) );
						}
					}
				} else { // ELSE MOVIES
					if ( currentHoriz.length < 2 ) {
						currentHoriz.push( self.slideshowContent.splice(i,1) );	
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
				imgSrc = MAIN_ROOT + "_tmp_dir/" + image;
			} else {

				// GET TARGET WIDTH
				var imgSizes = image[0]["image"].sizes; 
					
				// VERT TARGETS
				if ( target === "#slideshow_1" || target === "#slideshow_4" ) {
					targetW = targetH;
				}
				
				if ( targetW <= 400 ) {
					imgSrc = imgSizes.mediuam;
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

			$(target).css("background-image","url('" + imgSrc + "')");

		} else {

			// MOVIE
			$(target).append("<video id='video' muted autoplay><source src='" + image[0]['movie'].url + "' type='video/mp4'></video>");
			$("#video").on( "ended", function(){
			
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

	}

}


$(document).on("ready", function(){

	Page.init();

});