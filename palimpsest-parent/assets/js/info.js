var Info = {

	infoPrepped: false, 

	infoVisible: false, 

	nextIframeLoaded: false, 

	init: function () {

		console.log("Info.init");

		var self = this;

		// SHOW INFO SCREEN AS FIRST THING ON MOBILE IN PORTRAIT
		this.initialLoadCheck();

		ArtistInfo.init();
		MobileInfo.init();
		this.showFullscreenButton();

		MainInfo.init();

		this.bindEvents();

	},

	bindEvents: function () {

		console.log("Info.bindEvents");

		var self = this;

		$(window).on( "mousemove", function() {
			// console.log( 35, "mousemove" );
			self.showInfoBar();
			// CLEAR + RESET TIMER
			clearInterval( self.timer );
			self.timer = setTimeout( function(){
				Info.hideInfoBar();
			}, 4000 );
		});

		// $("#hover_area").on( "mouseout", function() {
		// 	// START COUNTER TO HIDE
		// 	self.timer = setTimeout( function(){
		// 		Info.hideInfoBar();
		// 	}, 4000 );	
		// });

		$("#main_info_show").on( "click", function(e) {
			e.preventDefault();
			if ( Info.detectMobile() ) {
				// IF LANDSCAPE
				console.log( 53, window.orientation );
				if ( window.orientation === 90 || window.orientation === -90 ) {
					MainInfo.preInfoScreen();					
				} else {
					MainInfo.showMobileInfo();
				}
			} else {
				MainInfo.showMainInfo();				
			}
		});

		$("#main_info_hide").on( "click", function(e) {
			e.preventDefault();
			MainInfo.hideMainInfo();
		});

		$("#fullscreen a").on("click", function(e){
			e.preventDefault();
			console.log( 64, "Fullscreen click." );
			self.toggleFullScreen();
		});

		$(window).on("orientationchange", function(event) { 
			if ( self.detectMobile() ) {
				self.orientationManager( event.orientation );
			}
		});

		$(window).on("resize", function(){
			ArtistInfo.artistInfoHeightCheck();
		});

		$("#browser_error_message .close a").on("click", function(e){
			e.preventDefault();
			$("#browser_error_message").hide();
		});

	},

	initialLoadCheck : function () {

		console.log("Info.initialLoadCheck");

		var self = this;

		function detectIE() {
  			var ua = window.navigator.userAgent;
			var msie = ua.indexOf('MSIE ');
			if (msie > 0) {
				// IE 10 OR OLDER => RETURN VERSION NUMBER
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			}
			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				// IE 11 => RETURN VERSION NUMBER
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}
			// ELSE
			return false;
		}

		if ( Info.detectMobile() ) {
			
			console.log( 119, window.orientation, $(window).width(), $(window).height() );

			if ( window.orientation === 0 || window.orientation === 180 || $(window).width() < $(window).height() ) {
				// IF PORTRAIT
				$("#mobile_background").show();
				MainInfo.showMobileInfo();
			} else {
				$("#info_wrapper").fadeIn(500);
				this.showInfoBar();
			}

		} else {

			// IF OPERA OR IF EXPLORER
			if ( navigator.userAgent.indexOf("Opera") > -1 || detectIE() ) {
				console.log( 120, navigator.userAgent );
				console.log("Browser message.");
			} else {
				console.log('Compatible browser.');
			}

			$("#info_wrapper").fadeIn(500);

		}

	},

	hideInfoBar: function ( calledFromOrientation ) {

		// console.log("Info.hideInfoBar");

		if ( calledFromOrientation ) {
			// CONTINUE 
		} else {
			if ( this.infoVisible || this.detectMobile() ) {
				return;
			}	
		}

		var infoH = Math.max( $("#info_left").height(), $("#info_wrapper").height() );
		$("#info_wrapper").css({
			"top" : 0 - infoH - 24
		});

	},

	showInfoBar: function () {

		// console.log("Info.showInfoBar");

		$("#info_wrapper").css({
			"top" : ""
		});

	},

	detectMobile: function () {

		console.log("Info.detectMobile");

		if ( Modernizr.touchevents && $(window).width() <= 1024 ) {
			return true;
		} else {
			return false;
		}

	},

	chromeDetect: function () {

		var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

		console.log( 118, "iOS test: ", iOS );

			// CHROME DETECT
		function isChrome() {
			var isChromium = window.chrome,
			winNav = window.navigator,
			vendorName = winNav.vendor,
			isOpera = winNav.userAgent.indexOf("OPR") > -1,
			isIEedge = winNav.userAgent.indexOf("Edge") > -1,
			isIOSChrome = winNav.userAgent.match("CriOS");

			if (isIOSChrome) {
				return true;
			} else if ( isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
				return true;
			} else { 
				return false;
			}
		}

		if ( isChrome() && !iOS ) {
			return true;
		} else {
			return false;
		}

	},

	mobileHeightCheck: function ( portrait ) {

		console.log("Info.mobileHeightCheck", portrait);

		var height = $(window).height() + 60;
		if ( portrait ) {
			height = "";
		}
		// console.log( 218, height );
		$("body").css( "height", height );

	},

	showFullscreenButton: function () {

		console.log("Info.showFullscreenButton");

		if ( this.detectMobile() ) {
			
			this.mobileHeightCheck();
			
			// IF ON CHROME BUT NOT ON iOS
			if ( this.chromeDetect() ) {
				$("#fullscreen").show().css("display","inline-block");
			} else {
				$("#fullscreen").hide();
			}
		} else {
			$("#fullscreen").hide();
			$("body").css( "height", "");
		}

	}, 

	toggleFullScreen: function () {

		console.log("Info.toggleFullScreen");
		
		if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
			// TOGGLE IMAGE
			$(".enter_fullscreen").hide();
			$(".exit_fullscreen").show();
			if (document.documentElement.requestFullScreen) {  
				document.documentElement.requestFullScreen();  
			} else if (document.documentElement.mozRequestFullScreen) {  
				document.documentElement.mozRequestFullScreen();  
			} else if (document.documentElement.webkitRequestFullScreen) {  
				document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
			}  
		} else {  
			// TOGGLE IMAGE
			$(".exit_fullscreen").hide();
			$(".enter_fullscreen").show();
			if (document.cancelFullScreen) {  
				document.cancelFullScreen();  
			} else if (document.mozCancelFullScreen) {  
				document.mozCancelFullScreen();  
			} else if (document.webkitCancelFullScreen) {  
				document.webkitCancelFullScreen();  
			}  
		}  

	}, 

	orientationManager: function ( orientation ) {

		console.log("Info.orientationManager");

		console.log( 182, "Orientation is " + orientation );

		if ( orientation === "landscape" || $(window).width() > $(window).height() ) {
			// IF INFO_WRAPPER NOT SHOWN YET
			$("#info_wrapper").fadeIn(500);
			// SHOW WORK
			this.mobileHeightCheck();
			MainInfo.hideMobileInfo();
		} else if ( orientation === "portrait" ) {
			// SHOW MAIN INFO
			this.mobileHeightCheck( true ); // RESETS HEIGHT
			MainInfo.showMobileInfo();
		} 

	},

}

