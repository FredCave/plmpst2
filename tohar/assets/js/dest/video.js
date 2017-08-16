var Video = {
	
    winH: $(window).height(), 

    winW: $(window).width(), 

	init: function () {

		console.log("Video.init");

        var self = this;

        this.noVideos = $("#video_sources .video").length;

        this.loadVideos();

	}, 

    bindEvents: function () {

        console.log("Video.bindEvents");

        var self = this;

        $(window).on("resize", _.throttle( function(){

            self.winH = $(window).height();
            self.winW = $(window).width();

            self.resizeIframes();

        }, 250 ));

        $(".arrow").on("click", function(){

            if ( $(this).attr("id") === "arrow_right" ) {

                self.changeVideo( "next" );

            } else {

                self.changeVideo( "prev" );

            }

        });

    },

    loadVideos: function () {

        console.log("Video.loadVideos");

        var self = this;

        this.resizeIframes(); 
            
        this.bindEvents();   

        // CREATE JS PLAYERS FOR EACH VIDEO
            // CREATE OBJECT FOR VARIABLE NAMES
        this.vars = {};
        $("#video_sources iframe").each( function(){

            self.vars["player-" + $(this).attr("id")] = new Vimeo.Player( $(this).attr("id") );

            self.vars["player-" + $(this).attr("id")].setVolume(0);
            self.vars["player-" + $(this).attr("id")].setAutopause(false);

        });

        console.log( 38, this.vars["player-video-1"], $("#video-1") );

        // PLAY + SHOW FIRST VIDEO
        this.currentVideo = 1;
        this.playVideo( this.vars["player-video-1"] );
        this.loadNextPrev();

        // console.log( 81 );

        // SHOW ARROWS AFTER 10 SECONDS
        _.delay( function(){
            
            $("#arrows").fadeIn( 1000 );

            // LOAD + SHOW COUNTER
            $("#counter").text("1/"+ self.noVideos).fadeIn( 1000 );

        }, 10000 );

    },

	resizeIframes: function () {
            
		console.log("Video.resizeIframes");

        // MAYBE ONLY RESIZE CURRENT VISIBLE IFRAME?? 

        var self = this;

		$("iframe").each( function(){

            var winR = self.winH / self.winW, // WINDOW RATIO
                video = $(this),
                vidR = parseInt( video.attr("height") ) / parseInt( video.attr("width") ); // VIDEO RATIO

            // console.log( 104, video.attr("height"), video.attr("width") );

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

    changeVideo: function ( direction ) {

        console.log("Video.changeVideo", direction );

        var number,
            self = this;

        if ( direction === "next" ) {
            number = this.currentVideo + 1;
            if ( number > this.noVideos ) {
                number = 1;
            }
        } else if ( direction === "prev" ) {
            number = this.currentVideo - 1;
            if ( number <= 0 ) {
                number = this.noVideos;
            }
        }

        // PLAY NEXT OR PREV VIDEO IN LINE
        var currentElem = $("#video_sources div").eq( this.currentVideo - 1 ), 
            targetId = $("#video_sources div").eq( number - 1 ).find("iframe").attr("id");

        this.currentVideo = number;

        console.log( 158, $("#"+targetId).parent(), $("#"+targetId).parent().hasClass("playing")  );

        // IF ALREADY PLAYING
        if ( $("#"+targetId).parent().hasClass("playing") ) {
            console.log( 160, "Already playing." )
            $("#"+targetId).parent().css("opacity","1").siblings().css({ opacity : 0 });

            if ( $("#"+targetId).parent().hasClass("audio") ) {
                // SET VOLUME
                this.vars["player-" + targetId].setVolume(1);
                console.log( 179, this.vars["player-" + targetId] );
            }

        } else {
            console.log( 175 );
            this.playVideo( this.vars["player-" + targetId] );            
        }

        _.defer( function(){
            self.loadNextPrev();
        });

        // UPDATE COUNTER
        $("#counter").text( number + "/" + this.noVideos );

    },

    playVideo: function ( player ) {

        console.log("Video.playVideo", player);

        var self = this;

        player.play();
        player.on("progress", function(){
            player.off("progress");  
            console.log( 173, "Playing.", player.element );
            _.defer( function(){
                $(player.element).parent().addClass("playing").css({ opacity : 1 }).siblings().css({ opacity : 0 });               
                // IF AUDIO:
                // console.log( 200, $(player.element).parent() );
                // if ( $(player.element).parent().attr("data-audio") ) {
                //     console.log( 202, "Audio!" );
                //     // $(player.element).setVolume(1);
                //     $(player.element).parent().addClass("audio");
                // }
            });
        });

        player.on("ended", function(){
            console.log( 205, "Video ended." );
            // NAV TO NEXT VIDEO
            self.changeVideo("next");
        });

    },

    loadNextPrev: function () {

        // PLAY ADJACENT VIDEOS
            // NEXT
        console.log( "Video.loadNextPrev" );
    
        var next = this.currentVideo + 1;
        if ( next > this.noVideos ) {
            next = 1;
        }

        this.vars["player-video-"+next].play();
        // + MUTE
        this.vars["player-video-"+next].setVolume(0);

        $(this.vars["player-video-"+next].element).parent().addClass("playing");

        console.log( 223, next, this.vars["player-video-"+next] );

        var prev = this.currentVideo - 1;
        if ( prev <= 0 ) {
            prev = this.noVideos;
        }

        console.log( 214, prev, this.noVideos );

        this.vars["player-video-"+prev].play();
        // + MUTE
        this.vars["player-video-"+prev].setVolume(0);

        $(this.vars["player-video-"+prev].element).parent().addClass("playing");

        // STOP NON ADJACENT VIDEOS FROM PLAYING (NEXT OF NEXT AND PREV OF PREV)
        var nextOfNext = next + 1;
        if ( nextOfNext > this.noVideos ) {
            nextOfNext = 1;
        }

        this.vars["player-video-"+nextOfNext].pause();
        this.vars["player-video-"+nextOfNext].setVolume(0);
        $(this.vars["player-video-"+nextOfNext].element).parent().removeClass("playing");
        // this.updatePosition( this.vars["player-video-"+nextOfNext] );

        var prevOfPrev = prev - 1;
        if ( prevOfPrev <= 0 ) {
            prevOfPrev = this.noVideos;
        }

        this.vars["player-video-"+prevOfPrev].pause();
        this.vars["player-video-"+prevOfPrev].setVolume(0);
        $(this.vars["player-video-"+prevOfPrev].element).parent().removeClass("playing");
        // this.updatePosition( this.vars["player-video-"+prevOfPrev] );

    },

    updatePosition: function ( player ) {

        console.log("Video.updatePosition");



    }

}