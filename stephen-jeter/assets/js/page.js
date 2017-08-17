var Page = {

    winH: $(window).height(), 

    winW: $(window).width(), 

	init: function () {

		console.log("Page.init");

		Info.init();

		this.bindEvents();

		this.videoSize();

        var portrait_2 = $("#portrait_2").get(0);
        
        portrait_2.play();

		// CREATE PLAYERS
		this.player_1 = new Vimeo.Player( $("#video_1") );
        this.player_1.setAutopause(false);
		this.player_1.pause();

		this.player_2 = new Vimeo.Player( $("#video_2") );
        this.player_2.setAutopause(false);
        this.player_2.pause();

		this.player_3 = new Vimeo.Player( $("#video_3") );
        this.player_3.setAutopause(false);
        this.player_3.pause();

	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$(".portrait_wrapper").on("click", function(){
			self.openVideo( $(this).attr("data-link") );
		});

        $("#back_button a").on("click", function(e) {
            e.preventDefault();
            self.closeVideo();
        });

        $(window).on("resize", _.throttle( function(){

            self.winH = $(window).height();
            self.winW = $(window).width();

            self.videoSize();

        }, 250 ));

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

        if ( link === "video_1" ) {
            this.player_1.play();
            this.player_1.on("ended", function(){
                console.log( 117, "Video 1 ended." );
                self.closeVideo();
            });
        } else if ( link === "video_2" ) {
            this.player_2.play();
            this.player_2.on("ended", function(){
                console.log( 117, "Video 2 ended." );
                self.closeVideo();    
            });
        } else if ( link === "video_3" ) {
            this.player_3.play();
            this.player_3.on("ended", function(){
                console.log( 117, "Video 3 ended." );
                self.closeVideo();   
            });
        }

        $("#" + link).fadeIn(500);

        // SHOW BACK BUTTON
        $("#back_button").fadeIn(1000);

	},

	closeVideo: function () {

		console.log("Page.closeVideo");
           
        $("#back_button").fadeOut(1000);

        this.player_1.pause();
        this.player_2.pause();
        this.player_3.pause();

        _.defer( function(){
            $("#intro_portraits").fadeIn(500, function(){
                $("#videos iframe").hide();
            });
        });

	}

}

$(document).on("ready", function(){

	Page.init();

});