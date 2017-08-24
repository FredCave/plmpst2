var Page = {

    winH: $(window).height(), 

    winW: $(window).width(), 

    videoVisible: false,

    enPlayer: false, 

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

		$("#lang_buttons a").on("click", function(e){

			e.preventDefault();
			var lang = $(this).attr("data-lang");
			if ( Info.detectMobile() ) {
				self.mobileLangNav(lang);
			} else {
				self.restartVideo(lang);				
			}

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
				$(this).attr("data-src", newSrc).css({
					"pointer-events" : "auto"
				});
			});

			this.mobileInit();

		} else {
			console.log( 78, "Mobile" );
			$("#video_he").attr( "src", $("#video_he").attr("data-src") );
			this.videoPlayerHe = new Vimeo.Player("video_he");

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
				console.log( 104, "Initial play attempt.", timeSinceStart );
				self.videoPlayerHe.setCurrentTime(timeSinceStart).then( function(seconds) {
					self.videoPlayerHe.play();
				}).catch(function(error) {
					console.log( 112, error );
				});
			});

			this.timeSinceLaunch();

	        // WORKAROUND TO DETECT END OF VIDEO
	        this.videoPlayerHe.on( "timeupdate", _.throttle( function(data){
	            
	        	// IF VIDEO NOT FADED IN YET
	        	if ( !self.videoVisible ) {
	        		$("#video_wrapper").fadeIn( 1000 );
	        	}
	            console.log( 93, "Time update HE", data.percent );
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

            // console.log( 104, winR, video.attr("height"), video.attr("width") );

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

	restartVideo: function ( lang ) {

		console.log("Page.restartVideo", lang);

		var self = this;

		if ( lang === undefined ) {
			lang = "he";
		}	

		// FADE TO BLACK
		$("#video_wrapper").hide();

		// IF EN && NOT CREATED YET
		if ( lang === "en" && !this.enPlayer ) {
			$("#video_en").attr("src", $("#video_en").attr("data-src") );
			this.videoPlayerEn = new Vimeo.Player("video_en");
			this.enPlayer = true;
			// this.videoPlayerEn.play();
			// this.videoPlayerEn.pause();

	        this.videoPlayerEn.on( "timeupdate", _.throttle( function(data){
	            
	            console.log( 230, "Time update EN", data.percent );

	        }, 1000 ));

		} 

		if ( lang === "en" ) {

			this.videoPlayerHe.pause();

			console.log( 203, "Play en" );
			$("#video_he").hide();
			// PLAY EN
			this.videoPlayerEn.setCurrentTime(0);
			
			this.videoPlayerEn.play();
			_.delay( function(){
				$("#video_en").show();
				$("#video_wrapper").fadeIn();				
			}, 500 );
				// RESET SIBLING TIME
			this.videoPlayerHe.setCurrentTime(0);

			// HIGHLIGHT BUTTON
			$("#lang_en").addClass("selected").siblings().removeClass("selected");

		} else if ( lang === "he" ) {
			
			if ( this.videoPlayerEn !== undefined ) {
				this.videoPlayerEn.pause();
			}

			console.log( 203, "Play he");
			$("#video_en").hide();

			// PLAY HE
			this.videoPlayerHe.setCurrentTime(0);
			this.videoPlayerHe.play();
			_.delay( function(){
				$("#video_he").show();
				$("#video_wrapper").fadeIn();				
			}, 500 );

			// HIGHLIGHT BUTTON
			$("#lang_he").addClass("selected").siblings().removeClass("selected");

		}

		// HIDE RESTART BUTTON
		$("#restart_button").fadeOut();

		// SHOW LANG BUTTONS
		$("#lang_buttons").fadeIn(1000);

	},

	mobileInit: function () {

		console.log("Page.mobileInit");

		// !!! REPEATED CODE
		$("#video_he").attr( "src", $("#video_he").attr("data-src") );
		this.videoPlayerHe = new Vimeo.Player("video_he");

		// SHOW LANG BUTTONS
		$("#lang_buttons").show();

		$("#video_wrapper").fadeIn( 1000 );

	}, 

	mobileLangNav: function ( lang ) {

		console.log("Page.mobileLangNav");

		var self = this;

		$("#video_wrapper").hide();

		if ( lang === "en" ) {

			console.log( 302, "mobile en" );
			// PAUSE AND RESET TIME
			this.videoPlayerHe.pause();
			this.videoPlayerHe.setCurrentTime(0);

			_.defer( function(){
				// IF NO PLAYER CREATE PLAYER
				if ( !self.enPlayer ) {
					$("#video_en").attr( "src", $("#video_en").attr("data-src") );
					self.videoPlayerEn = new Vimeo.Player("video_en");
					self.enPlayer = true;
				} 
				$("#video_he").hide();
				$("#video_en").show();

				self.videoPlayerEn.play();

				// HIGHLIGHT BUTTON
				$("#lang_en").addClass("selected").siblings().removeClass("selected");
			});

		} else if ( lang === "he" ) {

			console.log( 317, "mobile he" );

			if ( this.videoPlayerEn !== undefined ) {
				// PAUSE AND RESET TIME
				this.videoPlayerEn.pause();
				this.videoPlayerEn.setCurrentTime(0);
			}

			_.defer( function(){
				$("#video_en").hide();
				$("#video_he").show();

				self.videoPlayerHe.play();

				// HIGHLIGHT BUTTON
				$("#lang_he").addClass("selected").siblings().removeClass("selected");
			});

		}

		$("#video_wrapper").fadeIn( 1000 );

	}

}

$(document).on("ready", function(){

	Page.init();

});