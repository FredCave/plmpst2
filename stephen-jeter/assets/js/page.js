var Page = {

    winH: $(window).height(), 

    winW: $(window).width(), 

	init: function () {

		console.log("Page.init");

		Info.init();

		this.bindEvents();

        this.portraitsInit();

		this.videoSize();

	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$(".portrait_wrapper").on("click", function(){
			self.openVideo( $(this).attr("data-link") );
		});

        $("#back_button a").on("click", function(e) {
            e.preventDefault();
            self.closeVideo( self.currentPlayer );
        });

        $(window).on("resize", _.throttle( function(){

            self.winH = $(window).height();
            self.winW = $(window).width();

            self.videoSize();

        }, 250 ));

	},

    portraitsInit: function () {

        console.log("Page.portraitsInit");

        var self = this,
            i = 0;

        $(".portrait_wrapper").each( function(){

            var video = $(this).find("video").get(0);
            if ( self.winW > 768 ) {
                // REPLACE SOURCE
                var srcStr = $(video).find("source").attr("src"), 
                    newSrc = srcStr.replace("_small", "_large");
                $(video).find("source").attr("src",newSrc);
            }

            video.oncanplay = function() {
                // FADE IN
                $(video).parent().fadeIn(1000);
                i++;
                // IF THIRD VIDEO LOADED
                if ( i === 3 ) {
                    self.vimeoVideosInit();
                }
            };

        });

    },

    vimeoVideosInit: function () {

        console.log("Page.vimeoVideosInit");

        // IF MOBILE: REMOVE BG MODE
        if ( Info.detectMobile() ) {
            console.log( 84, "Mobile detected" );
            $("iframe").each( function(){
                var newSrc = $(this).attr("data-src").replace("background=1","");
                console.log( 87, newSrc );
                $(this).attr("src", newSrc);
            });
        } else {
            console.log( 91, "Mobile not detected" );
        }

    },

	videoSize: function () {

		console.log("Page.videoSize");

		var self = this;

		$("iframe").each( function(){

            var winR = self.winH / self.winW, // WINDOW RATIO
                video = $(this),
                vidR = parseInt( video.attr("height") ) / parseInt( video.attr("width") ); // VIDEO RATIO

            console.log( 49, winR, vidR );

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

	openVideo: function ( link ) {

		console.log("Page.openVideo", link);

		$("#intro_portraits").fadeOut(500);

        var self = this;

        // IF DESKTOP: LOAD PLAYERS
        if ( !Info.detectMobile() ) { // TMP DISABLED

            if ( link === "video_1" ) {

                // IF NOT YET CREATED: CREATE VIMEO PLAYER
                if ( this.player_1 === undefined ) {
                    var newSrc = $("#video_1").attr("data-src");
                    $("#video_1").attr("src", newSrc);
                    this.player_1 = new Vimeo.Player( $("#video_1") );
                }
                this.player_1.play();
                this.player_1.on("timeupdate", function(data){
                    // console.log( 173, "video_1", data.percent );
                    if ( data.percent >= 0.99 ) {
                        self.closeVideo( self.player_1 );
                    }
                });
                this.currentPlayer = this.player_1;

            } else if ( link === "video_2" ) {
     
                // IF NOT YET CREATED: CREATE VIMEO PLAYER
                if ( this.player_2 === undefined ) {
                    var newSrc = $("#video_2").attr("data-src");
                    $("#video_2").attr("src", newSrc);
                    this.player_2 = new Vimeo.Player( $("#video_2") );
                }
                this.player_2.play();
                this.player_2.on("timeupdate", function(data){
                    // console.log( 185, "video_2", data.percent );
                    if ( data.percent >= 0.99 ) {
                        self.closeVideo( self.player_2 );
                    }
                });
                this.currentPlayer = this.player_2;

            } else if ( link === "video_3" ) {

                // IF NOT YET CREATED: CREATE VIMEO PLAYER
                if ( this.player_3 === undefined ) {
                    var newSrc = $("#video_3").attr("data-src");
                    $("#video_3").attr("src", newSrc);
                    this.player_3 = new Vimeo.Player( $("#video_3") );
                }
                this.player_3.play();
                this.player_3.on("timeupdate", function(data){
                    console.log( 193, "video_3", data.percent );
                    if ( data.percent >= 0.99 ) {
                        // console.log( 205, self.player_3  );
                        self.closeVideo( self.player_3 );
                    }
                });
                this.currentPlayer = this.player_3;

            }

        } else {

            // IF MOBILE
            console.log( 210, link, " pointer events auto" );
            $("#" + link).css("pointer-events","auto");

            console.log( 213, $("#" + link) );

            this.mobilePlayer = new Vimeo.Player( $("#" + link) );
            this.mobilePlayer.play();
            this.mobilePlayer.on("ended", function(){
                self.closeVideo();
            });

        } // END OF IF MOBILE CHECK

        $("#" + link).fadeIn(500);

        // SHOW BACK BUTTON
        $(".back_button").fadeIn(1000);

	},

	closeVideo: function ( player ) {

		console.log("Page.closeVideo");

        $("#videos iframe").hide();           
        $(".back_button").fadeOut(1000);

        console.log( 229, this.currentPlayer );

        if ( player !== undefined ) {
            player.pause()
            player.setCurrentTime(0);
        }

        if ( this.mobilePlayer !== undefined ) {
            this.mobilePlayer.pause();
            this.mobilePlayer.setCurrentTime(0);
        }

        _.defer( function(){
            $("#intro_portraits").fadeIn(500);
        });

	}

}

$(document).on("ready", function(){

	Page.init();

});