var Info = {

	infoPrepped: false, 

	infoVisible: false, 

	nextIframeLoaded: false, 

	init: function () {

		console.log("Info.init");

		var self = this;

		ArtistInfo.init();
		MobileInfo.init();

		// GET AJAX INFO (POST INFO, TIME,TEMP,ETC...)
		this.getInfo();

		this.bindEvents();

		// HIDE INITIAL INFO AFTER DELAY
		this.timer = setTimeout( function(){
			self.hideInfo();
		}, 4000 );

	},

	bindEvents: function () {

		console.log("Info.bindEvents");

		var self = this;

		$("#hover_area").on( "mouseover", function() {
			self.showInfo();
			// CLEAR TIMER
			clearInterval( self.timer );
		});

		$("#hover_area").on( "mouseout", function() {
			// START COUNTER TO HIDE
			self.timer = setTimeout( function(){
				self.hideInfo();
			}, 4000 );	
		});

		$("#main_info_show").on( "click", function(e) {
			e.preventDefault();
			self.showMainInfo();
		});

		$("#main_info_hide").on( "click", function(e) {
			e.preventDefault();
			self.hideMainInfo();
		});

		$("#info .info_toggle").on("click", function(){
			self.infoSectionToggle();
		});

	},

	hideInfo: function () {

		console.log("Info.hideInfo");

		console.log( 114, this.infoVisible );

		if ( this.infoVisible ) {
			return;
		}

		var infoH = $("#info_wrapper").height();
		$("#info_wrapper").css({
			"top" : 0 - infoH - 24
		});

	},

	showInfo: function () {

		console.log("Info.showInfo");

		$("#info_wrapper").css({
			"top" : ""
		});

	},

	showMainInfo: function () {

		console.log("Info.showMainInfo");

		this.infoVisible = true;

		// HIDE TITLE + SHOW X
		$("#main_info_show").add("#info_left").fadeOut( 1000 );
		$("#main_info_hide").fadeIn( 1000 );

		$("#info").stop().fadeIn( 4000 );

		$("#wrapper").css({"pointer-events":"none"});

	},

	hideMainInfo: function () {

		console.log("Info.hideMainInfo");

		this.infoVisible = false;

		// SHOW TITLE + HIDE X
		$("#main_info_show").add("#info_left").fadeIn( 1000 );
		$("#main_info_hide").fadeOut( 1000 );

		$("#info").stop().fadeOut( 2000 );

		$("#wrapper").css({"pointer-events":""});


	},

	getInfo: function () {

		console.log("Info.getInfo");

		var self = this;

		// GET POST INFO
		$.ajax({
		    url: MAIN_ROOT + "wp-json/wp/v2/posts/44",
		    success: function(data) {
		    	ArtistInfo.artistInfoPrep(data.acf.works);
		    	self.mainInfoLoadWorks(data.acf.works);
		    },
		    error: function(errorThrown){
		        console.log(errorThrown);
		    }
		}); 

		// GET MAIN TEXT
		$.ajax({
		    url: MAIN_ROOT + "wp-json/wp/v2/posts/42",
		    success: function(data) {
		    	self.mainInfoPrep(data.acf);
		    },
		    error: function(errorThrown){
		        console.log(errorThrown);
		    }
		}); 

		// START CURRENT TIME IN JERUSALEM
		this.metaTimeInit();

		var lat = 31.7683,
			lng = 35.2137,
			cityId = 281184,
			key = "d1e177c805b94194de56eac601d8e565";

		// GET TEMP + SUNTIMES
		$.ajax({
			url: "http://api.openweathermap.org/data/2.5/weather?id=" + cityId + "&APPID=" + key + "&units=metric",
			dataType: "json", 
			success: function (data) {
				self.metaTempInit( data.main );
				self.metaSunInit( data.sys );
			},
			error: function ( response ) {
				console.log( "Ajax error: " + response.responseJSON.message );
			}
		});

		// FALLBACK: GET SUNTIMES
		// $.ajax({
		// 	url: "http://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lng+"&formatted=0",
		// 	dataType: "json", 
		// 	success: function (data) {
		// 		self.metaSunInit( data.results );
		// 	}
		// });

		var moontimes = SunCalc.getMoonTimes( new Date(), lat, lng );
		this.metaMoonInit( moontimes );

	}, 

	metaTimeInit: function ( offset ) {

		console.log("Info.metaTimeInit");

		var now = moment().tz("Asia/Jerusalem");
		console.log( 175, now ); 
		var nowDate = now.format("DD MMMM YYYY");
		$("#info .meta_date").text( nowDate ).addClass("loaded");
		$("#info .meta_time").text( now.format("HH:mm:ss") ).addClass("loaded");
		// START CLOCK 
		this.clockInterval = setInterval( function(){
			$("#info .meta_time").text( moment().tz("Asia/Jerusalem").format("HH:mm:ss") );
		}, 1000 );

	},

	metaTempInit: function ( data ) {

		console.log("Info.metaTempInit");

		var temp = data.temp;
		if ( temp !== undefined ) {
			$("#info .meta_temp").html( data.temp + "&deg;C, " ).addClass("loaded");
		}

	},

	metaSunInit: function ( data ) {

		console.log("Info.metaSunInit");

		var sunrise = moment( data.sunrise, "X" ).tz("Asia/Jerusalem").format("HH:mm");
		var sunset = moment( data.sunset, "X" ).tz("Asia/Jerusalem").format("HH:mm");
		if ( sunrise !== undefined  ) {
			$("#info .meta_sunrise").append( sunrise + ", " ).addClass("loaded");
		}
		if ( sunset !== undefined  ) {
			$("#info .meta_sunset").append( sunset + ", " ).addClass("loaded");
		}

	}, 

	metaMoonInit: function ( data ) {

		console.log("Info.metaMoonInit");

		var moonrise = moment( data.rise ).format("HH:mm");
		var moonset = moment( data.set ).format("HH:mm");
		if ( moonrise !== undefined  ) {
			$("#info .meta_moonrise").append( moonrise + ", " ).addClass("loaded");
		}
		if ( moonset !== undefined  ) {
			$("#info .meta_moonset").append( moonset + "" ).addClass("loaded");
		}

	}, 

	mainInfoPrep: function ( data ) {

		console.log("Info.mainInfoPrep");

		console.log( 302, data );

		$("#info_definition").html( data.definition );
		$("#info_main_text").html( data.main_text );
		$("#info_colophon").html( data.colophon );
		$("#info_mekudeshet_text").html( data.mekudeshet_text );
		$("#info_mekudeshet_share").html( data.mekudeshet_links );

		$("#info").appendTo( $("#wrapper") );

	}, 

	mainInfoLoadWorks: function ( data ) {

		console.log("Info.mainInfoLoadWorks");	

		var works = "<ul>";
		// LOOP THROUGH ARRAY
		_.each( data, function(work) {
			works += "<li>";
			works += "<a href='" + work.work_url + "'>";
			works += work.work_title;
			works += "</a><br>";
			works += work.work_artist;
			works += "</li>";
		});
		works += "</ul>";

		$("#info_works").html( works );

	},

	infoSectionToggle: function () {

		console.log("Info.infoSectionToggle");



	},

}

