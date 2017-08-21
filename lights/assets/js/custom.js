var Page = {

	winW: $(window).width(), 

	stopMoveDelay: 8000, 

	init: function () {

		console.log("Page.init");

		// MOBILE TEST
		if ( Info.detectMobile() ) {
			$("#mobile_wrapper").fadeIn(1000);
		} else {
			$("#wrapper").fadeIn(1000);
			this.audioInit();
		}

		this.bindEvents();

		Info.init();

	}, 

	bindEvents: function () {

		console.log("Page.bindEvents");

		var timeout,
			self = this;

		$("#button").on( "click", function(){

			// self.audioInit();
			var player = $("#audio_1")[0];
			player.loop = true;
			player.play();

			setTimeout( function(){
				$("#mobile_wrapper").hide();
				$("#wrapper").fadeIn(1000);				
			}, 50 );
		
		});

		$("#wrapper").on("mousemove touchstart", _.throttle(function(e){

			if ( e.pageX < self.winW * 0.45 ) {
				self.leftFadeIn();
			} else if ( e.pageX > self.winW * 0.55 ) {
				self.rightFadeIn();
			}

			if (timeout !== undefined) {
				window.clearTimeout(timeout);
			}
			timeout = window.setTimeout(function () {
				$("#wrapper").trigger('mousemoveend');
			}, self.stopMoveDelay );

		}, 100 ) );

		$("#wrapper").on("mousemoveend", _.throttle(function(e){

			self.allFadeOut();

		}, 100 ));

		$(window).on( "resize", _.throttle( function(e) {

			self.winW = $(window).width();

		}, 500 ) );

	},

	audioInit: function () {

		console.log("Page.audioInit");

		console.log( 85, $("#wrapper").attr("data-bg") );
		if ( $("#wrapper").attr("data-bg") === "true" ) {
			return;
		}

       // FADE IN FIRST
        $("#audio_1").prop("volume", 0.1);
        $("#audio_1")[0].play();
        $("#audio_1").animate({
            volume : 1
        }, 5000, function(){
            var current = 2;
            // START LOOP
            setInterval( function(){
                // TOGGLE AUDIOS
                current === 1 ? current = 2 : current = 1;
                $("#audio_" + current)[0].play();
            }, 780000 );
        });

	},

	leftFadeIn: function () {

		console.log("Page.leftFadeIn");

		$("#west_image").css({"opacity": "1"});
		$("#east_image").css({"opacity": "0"});

	},

	rightFadeIn: function () {

		console.log("Page.rightFadeIn");

		$("#east_image").css({"opacity": "1"});
		$("#west_image").css({"opacity": "0"});

	},

	allFadeOut: function () {

		console.log("Page.allFadeOut");

		$("#east_image").css({"opacity": "0"});
		$("#west_image").css({"opacity": "0"});		

	}

}


$(document).on("ready", function(){

	Page.init();

});