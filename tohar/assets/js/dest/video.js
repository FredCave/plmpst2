var Video = {
	
    videosQuiet: true,

    winH: $(window).height(), 

    winW: $(window).width(), 

	init: function () {

		console.log("Video.init");

        var self = this;

        this.noVideos = $("#video_sources .video").length;

        this.bindEvents();   

        this.loadVideos();

        // ALL VIDEOS WITH SOUND ARE AT 50% VOLUME DURING FIRST MINUTE
        setTimeout( function () {
            self.videosQuiet = false;
            // GET CURRENTLY PLAYING VIDEO & CHECK IF HAS SOUND
            var currentVideo = $("#video_sources div").eq( self.currentVideo - 1 );
            if ( currentVideo.hasClass("audio") ) {
                // SET VOLUME TO ONE
                var videoId = currentVideo.find("iframe").attr("id");
                console.log( 30, "Volume increased on ", videoId );
                self.vars["player-" + videoId].setVolume(0.6);
                _.delay( function(){
                   self.vars["player-" + videoId].setVolume(0.8); 
                }, 250 );
                _.delay( function(){
                   self.vars["player-" + videoId].setVolume(1); 
                }, 500 );
            } 
        }, 60000 );

	}, 

    bindEvents: function () {

        console.log("Video.bindEvents");

        var self = this;

        $(window).on("resize", _.throttle( function(){

            self.winH = $(window).height();
            self.winW = $(window).width();

            self.resizeIframes();

        }, 250 ));

        $(".arrow a").on("click", function(e){
            
            e.preventDefault();
            if ( $(this).parent().attr("id") === "arrow_right" ) {
                self.changeVideo( "next" );
            } else if ( $(this).parent().attr("id") === "arrow_left" ) {
                self.changeVideo( "prev" );
            }
        });

    },

    loadVideos: function () {

        console.log("Video.loadVideos");

        var self = this;

        if ( Info.detectMobile() ) {

            this.mobileInit();

        } else {

            this.resizeIframes(); 
                
            // CREATE JS PLAYERS FOR EACH VIDEO
                // CREATE OBJECT FOR VARIABLE NAMES
            this.vars = {};
            $("#video_sources iframe").each( function(){

                var selfElem = $(this);

                var newSrc = $(this).attr("data-src");
                console.log( 95, newSrc );
                $(this).attr( "src", newSrc );

                self.vars["player-" + $(this).attr("id")] = new Vimeo.Player( $(this).attr("id") );

                self.vars["player-" + $(this).attr("id")].setVolume(0);
                self.vars["player-" + $(this).attr("id")].setAutopause(false);
                self.vars["player-" + $(this).attr("id")].pause();

                // WORKAROUND TO DETECT END OF VIDEO
                self.vars["player-" + $(this).attr("id")].on( "timeupdate", _.throttle( function(data){
                    // console.log( 101, "Time update", $(selfElem).attr("id"), data.percent, data.duration, data.seconds );
                    // CACLULATE TIME LEFT
                    if ( data.duration - data.seconds < 2 ) {
                        // AND IF THIS IS CURRENT VIDEO
                        var playerId = $(selfElem).attr("id").split("-")[1];
                        // console.log( 98, "Video ended", playerId, " current: ", self.currentVideo );
                        if ( parseInt(playerId) === self.currentVideo ) {
                            self.changeVideo("next");
                        }
                    }

                }, 1000 ));

            });

            // PLAY + SHOW FIRST VIDEO
            this.currentVideo = 1;
            this.playVideo( this.vars["player-video-1"] );

            this.loadNextPrev();

            // SHOW ARROWS AFTER 10 SECONDS
                // IF MOBILE: NO DELAY
            var delayTime = 10000;

            _.delay( function(){
                $("#arrows").fadeIn( 1000 );
                // LOAD + SHOW COUNTER
                // $("#counter").text("1/"+ self.noVideos).fadeIn( 1000 );
            }, delayTime );

        }

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

        if ( Info.detectMobile() ) {
            this.mobileChangeVideo( direction );
            return;
        } 

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
                if ( this.videosQuiet ) {
                    this.vars["player-" + targetId].setVolume(0.4);
                } else {
                    this.vars["player-" + targetId].setVolume(1);                    
                }
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
            });
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

        var prevOfPrev = prev - 1;
        if ( prevOfPrev <= 0 ) {
            prevOfPrev = this.noVideos;
        }

        this.vars["player-video-"+prevOfPrev].pause();
        this.vars["player-video-"+prevOfPrev].setVolume(0);
        $(this.vars["player-video-"+prevOfPrev].element).parent().removeClass("playing");

    },

    mobileInit: function () {

        console.log("Video.mobileInit");

        this.mobileVars = {};

        $("iframe").css("height", $(window).height() ); 

        // CREATE PLAYERS AS THEY ARE NEEDED
        
        // SHOW FIRST VIDEO
        var thisId = $("#video_sources iframe").eq(0).attr("id"),
            newSrc = $("#"+thisId).attr("data-src").replace("?background=1","");
        $("#"+thisId).attr( "src", newSrc );
        // this.mobileVars["player-" + thisId] = new Vimeo.Player( thisId );
        this.mobilePlayer = new Vimeo.Player( thisId );
        this.mobilePlayer.disableTextTrack().then(function() {
            console.log(338, "Captions disabled.");
        }).catch(function(error) {
            console.log(340, error );
        });
        $("#"+thisId).parent().css({
            "opacity" : "1", 
            "z-index" : "9"
        });
        this.currentVideo = 1;

        // SHOW ARROWS AFTER 0.5 SECONDS
        _.delay( function(){
            $("#arrows").fadeIn( 1000 );
        }, 500 );    

        // this.mobileLoadNextPrev( thisId );

    },

    // mobileLoadNextPrev: function () {

    //     console.log("Video.mobileLoadNextPrev");

    //     var next = this.currentVideo + 1;
    //     if ( next > this.noVideos ) {
    //         next = 1;
    //     }
    //     // CHECK IF PLAYER EXISTS
    //     if ( this.mobileVars["player-video-" + next] === undefined ) {
    //         // IF NOT: CHANGE SRC & CREATE PLAYER
    //         var nextSrc = $("#video-"+next).attr("data-src").replace("?background=1","");
    //         $("#video-"+next).attr( "src", nextSrc );
    //         this.mobileVars["player-video-" + next] = new Vimeo.Player( "video-" + next );
    //     }

    //     var prev = this.currentVideo - 1;
    //     if ( prev <= 0 ) {
    //         prev = this.noVideos;
    //     }
    //     // CHECK IF PLAYER EXISTS
    //     if ( this.mobileVars["player-video-" + prev] === undefined ) {
    //         // IF NOT: CHANGE SRC & CREATE PLAYER
    //         var prevSrc = $("#video-"+prev).attr("data-src").replace("?background=1","");
    //         $("#video-"+prev).attr( "src", prevSrc );
    //         this.mobileVars["player-video-" + prev] = new Vimeo.Player( "video-" + prev );
    //     }

    // },

    mobileChangeVideo: function ( direction ) {

        console.log("Video.mobileChangeVideo");

        var number,
            self = this;

        // HIDE CURRENT
        this.mobilePlayer.pause();
        this.mobilePlayer = null;
        $("#video-"+this.currentVideo).parent(".video").css("opacity","0");

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
        this.currentVideo = number;

        // CREATE NEW PLAYER
        var nextSrc = $("#video-"+number).attr("data-src").replace("?background=1","");
        $("#video-"+number).attr( "src", nextSrc );
        this.mobilePlayer = new Vimeo.Player( "video-" + number );

        // PLAY
        // this.mobileVars["player-video-" + number].play();
       
        // SHOW NEXT
        $("#video-"+number).parent(".video").css({
            "opacity" : "1", 
            "z-index" : "99"
        }).siblings().css({
            "z-index" : ""            
        });

        // this.mobileLoadNextPrev();

    }


}