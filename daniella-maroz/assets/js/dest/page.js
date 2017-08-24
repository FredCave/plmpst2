var Page = {

    winH: $(window).height(), 

    winW: $(window).width(), 

    videoVisible: false,

	init: function () {

		console.log("Page.init");

		Info.init();

		this.bindEvents();

		this.videoInit();

	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$("#restart_button a").on("click", function(e){

			e.preventDefault();
			self.restartVideo();

		});

		$(window).on("resize", _.throttle( function(){

            self.winH = $(window).height();
            self.winW = $(window).width();

            self.videosResize();

        }, 250 ));

	}, 

	videoInit: function () {

		console.log("Page.videoInit");

		var self = this;

		if ( Info.detectMobile() ) {
			console.log( 62, "Mobile" );
			// CHANGE SRCs OF VIDEOS
			$(".video").each( function(){
				var thisSrc = $(this).attr("data-src"),
					newSrc = thisSrc.replace( "?background=1", "?autoplay=0" );
				console.log( 67, newSrc );
				$(this).attr("data-src", newSrc);
			});

			this.mobileInit();

		} else {

			$("#video").attr( "src", $("#video").attr("data-src") );
			console.log( 66, $("#video").attr( "src") );
			this.videoPlayer = new Vimeo.Player("video");

			// RESIZE VIDEO
			this.videosResize();

			$("#restart_button").show();

			// CALCULATE START TIME 
				// CURRENT TIME FROM THE LAST HOUR
			var d = new Date(), 
				currentMinutes = d.getMinutes(), 
				currentSeconds = d.getSeconds(),
				currentTimeinSeconds = currentMinutes * 60 + currentSeconds,
				timeSinceStart;
			
			// DEFINE VIDEO START TIMES AS ARRAY AS SECONDS
			var startTimes = [],
				seconds = 0;
			while ( seconds < 3600 ) {
				// 7.1833 MINUTES = 431 SECONDS
				var newTime = seconds;
				startTimes.push( newTime );
				seconds += 431;
			}
			// LOOP BACKWARDS(!) THROUGH START TIMES
			for ( var i = startTimes.length - 1; i >= 0; --i ) {
				// IF START TIME BEFORE CURRENT TIME: CALC DIFFERENCE + BREAK
				if ( currentTimeinSeconds > startTimes[i] ) {
					timeSinceStart = currentTimeinSeconds - startTimes[i];
					break;
				}
			}

			_.defer( function(){
				self.videoPlayer.setCurrentTime(timeSinceStart).then( function(seconds) {
					self.videoPlayer.play();
					console.log( 77, "Video started at " + seconds + " seconds" );
				});
			});

			this.timeSinceLaunch();

	        // WORKAROUND TO DETECT END OF VIDEO
	        this.videoPlayer.on( "timeupdate", _.throttle( function(data){
	            
	        	// IF VIDEO NOT FADED IN YET
	        	if ( !self.videoVisible ) {
	        		$("#video_wrapper").fadeIn( 1000 );
	        	}
	            // console.log( 93, "Time update", data.percent );
	            // if ( data.percent >= 0.99 ) {
	            // 	console.log( 92, "Video ended." );
	            // }

	        }, 1000 ));

	    }

	},

	videosResize: function () {

		console.log("Page.videosResize");

        var self = this;

		$("iframe").each( function(){

            var winR = self.winH / self.winW, // WINDOW RATIO
                video = $(this),
                vidR = parseInt( video.attr("height") ) / parseInt( video.attr("width") ); // VIDEO RATIO

            console.log( 104, winR, video.attr("height"), video.attr("width") );

            if ( winR > vidR ) {
                
                // FULL HEIGHT
                console.log("Full height");

                var newW = ( self.winH / vidR ) / self.winW * 100;

                video.css({
                    "width": newW + "%",
                    "margin-left": 0 - ( ( newW - 100 ) / 2 ) + "%",
                    "margin-top": "",
                    "height": "100%"
                });

            } else {    
           
                // FULL WIDTH
                console.log("Full width");

                var newH = ( self.winW * vidR ) / self.winH * 100;

                video.css({
                    "width": "100%",
                    "margin-left": "",
                    "margin-top": 0 - ( self.winW * vidR - self.winH ),
                    "height": newH + "%"
                });  

            }

        });		

	},

	timeSinceLaunch: function () {

		console.log("Page.timeSinceLaunch");

		setInterval( function(){

			var now = moment( new Date() ), 
				then = moment([2017, 07, 23]);

			var duration = moment.duration(now.diff(then)).as('seconds'), 
				hours = duration / 60 / 60,
				minutes = ( hours - Math.floor( hours ) ) * 60,
				seconds = ( minutes - Math.floor( minutes ) ) * 60;

			var durationStr = Math.floor(hours) + "&#186;" + Math.floor(minutes) +  "\'" + Math.floor(seconds) + "\"";

			$("#timer").html( durationStr );

		}, 1000 );

	},

	restartVideo: function () {

		console.log("Page.restartVideo");

		var self = this;

		// FADE TO BLACK
		$("#video_wrapper").hide();

		// RESTART VIDEO
		this.videoPlayer.setCurrentTime(0).then( function(seconds) {
			self.videoPlayer.play();
			console.log( 178, "Video started at " + seconds + " seconds" );
			_.defer( function(){
				$("#video_wrapper").fadeIn();				
			});
		});

		// HIDE RESTART BUTTON
		$("#restart_button").fadeOut();

	},

	mobileInit: function () {

		console.log("Page.mobileInit");

		// !!! REPEATED CODE
		$("#video").attr( "src", $("#video").attr("data-src") ).css({"pointer-events":"auto"});
		this.videoPlayer = new Vimeo.Player("video");

		$("#video_wrapper").fadeIn( 1000 );

	}, 

}

$(document).on("ready", function(){

	Page.init();

});