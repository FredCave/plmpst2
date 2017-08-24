var MainInfo = {
	
	// mobileMainInfoClicked: false, 

	init: function () {

		console.log("MainInfo.init");

		this.getInfo();

	},

	showMainInfo: function () {

		console.log("MainInfo.showMainInfo");

		Info.infoVisible = true;

		// DISABLE WRAPPER EVENTS
		$("#wrapper").css("pointer-events","none");
		$("#info").css("pointer-events","auto");

		// HIDE TITLE + SHOW X
		$("#main_info_show").add("#info_left").fadeOut( 500 );
		$("#main_info_hide").fadeIn( 500 );

		$("#info_text_wrapper").css({
			"color" 		: "transparent",
			"text-shadow" 	: "none"
		}).find("img").css("opacity","0");
		$("#info_title").css("border-bottom","3px solid transparent");
		$("#info").stop().fadeIn( 500, function(){
			$("#info_text_wrapper").css({
				"color" 		: "", 
				"text-shadow" 	: ""
			}).find("img").css("opacity","");
			$("#info_title").css("border-bottom","");
		});

		// TOHAR HACK
		$("#arrows").css("z-index","-9");
		// WALLMART
		$("#wallmart_canvas").css("z-index","-9");
		$("#wallmart_content").css("z-index","-9");


		$("#wrapper").css({"pointer-events":"none"});

	},

	hideMainInfo: function () {

		console.log("MainInfo.hideMainInfo");

		Info.infoVisible = false;

		// DISABLE WRAPPER EVENTS
		$("#wrapper").css("pointer-events","");
		$("#info").css("pointer-events","");

		// SHOW TITLE + HIDE X
		$("#main_info_show").add("#info_left").fadeIn( 500 );
		$("#main_info_hide").fadeOut( 500 );

		$("#info_text_wrapper").css({
			"color" 		: "transparent",
			"text-shadow" 	: "none"
		}).find("img").css("opacity","0");
		$("#info_title").css("border-bottom","3px solid transparent");
		$("#info").stop().fadeOut( 500, function(){
			$("#info_text_wrapper").css({
				"color" 		: "", 
				"text-shadow" 	: ""
			}).find("img").css("opacity","");
			$("#info_title").css("border-bottom","");
		});

		// TOHAR HACK
		$("#arrows").css("z-index","");
		// WALLMART
		$("#wallmart_canvas").css("z-index","");
		$("#wallmart_content").css("z-index","");

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

		console.log("MainInfo.metaTimeInit");

		var now = moment().tz("Asia/Jerusalem"); 
		var nowDate = now.format("DD MMMM YYYY");
		$("#info .meta_date").text( nowDate ).addClass("loaded");
		$("#info .meta_time").text( now.format("HH:mm:ss") ).addClass("loaded");
		// START CLOCK 
		this.clockInterval = setInterval( function(){
			$("#info .meta_time").text( moment().tz("Asia/Jerusalem").format("HH:mm:ss") );
		}, 1000 );

	},

	metaTempInit: function ( data ) {

		console.log("MainInfo.metaTempInit");

		var temp = data.temp;
		if ( temp !== undefined ) {
			$("#info .meta_temp").html( data.temp + "&deg;C, " ).addClass("loaded");
		}

	},

	metaSunInit: function ( data ) {

		console.log("MainInfo.metaSunInit");

		var sunrise = moment( data.sunrise, "X" ).tz("Asia/Jerusalem").format("HH:mm");
		var sunset = moment( data.sunset, "X" ).tz("Asia/Jerusalem").format("HH:mm");
		if ( sunrise !== undefined  ) {
			$("#info .meta_sunrise").append( "&nbsp;" + sunrise + ", " ).addClass("loaded");
		}
		if ( sunset !== undefined  ) {
			$("#info .meta_sunset").append( "&nbsp;" + sunset + ", " ).addClass("loaded");
		}

	}, 

	metaMoonInit: function ( data ) {

		console.log("MainInfo.metaMoonInit");

		var moonrise = moment( data.rise ).format("HH:mm");
		var moonset = moment( data.set ).format("HH:mm");
		if ( moonrise !== undefined  ) {
			$("#info .meta_moonrise").append( "&nbsp;" + moonrise + "," ).addClass("loaded");
		}
		if ( moonset !== undefined  ) {
			$("#info .meta_moonset").append( "&nbsp;" + moonset + "" ).addClass("loaded");
		}

	}, 

	mainInfoPrep: function ( data ) {

		console.log("MainInfo.mainInfoPrep");

		$("#info_definition").html( data.definition );
		$("#info_main_text").html( data.main_text );
		$("#info_colophon").html( data.colophon );
		$("#info_mekudeshet_text").html( data.mekudeshet_text );
		$("#info_mekudeshet_share").html( data.mekudeshet_links );

		$("#info").appendTo( $("#wrapper") );

	}, 

	mainInfoLoadWorks: function ( data ) {

		console.log("MainInfo.mainInfoLoadWorks");	

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

		console.log("MainInfo.infoSectionToggle");

	},

	preInfoScreen: function () {

		console.log("MainInfo.preInfoScreen");

		$("#mobile_background").fadeIn(500);
		$("#info_mobile_exit").fadeIn(1000);

	},

	showMobileInfo: function () {

		console.log("MainInfo.showMobileInfo");

		// ADD VIDEO IN BG
		// console.log( 222, "Append video", $("#info_video_wrapper"), $("#mobile_background_video") );

		// var newSrc = $("#mobile_background_video source").attr("data-src");
		// $("#mobile_background_video source").attr( "src", newSrc );

		// $("#info_video_wrapper").append( $("#mobile_background_video").html() );

		// var video = $("#info_video_wrapper video")[0];
		// video.play();

		// HIDE INFO TOP BAR
		Info.hideInfoBar( true );

		// DISABLE WRAPPER EVENTS
		$("#wrapper").css("pointer-events","none");

		$("#info").addClass("info_mobile").show().css({
			"pointer-events" : "auto", 
			"z-index" : "99",
		});
		$("#mobile_background").hide();
		$("#info_mobile_exit").hide();

		$("#main_info_hide").hide();

		// TOHAR HACK
		$("#arrows").css("z-index","-9");
		$("#video_sources .video").css("z-index","-9");

	}, 

	hideMobileInfo: function () {

		console.log("MainInfo.hideMobileInfo");

		$("#info").hide();

		// SHOW INFO TOP BAR
		Info.showInfoBar( true );

		// ENABLE WRAPPER EVENTS
		$("#wrapper").css("pointer-events","");
		$("#info").css({
			"pointer-events" : "",  
			"z-index" : "",
		});

		// TOHAR HACK
		$("#arrows").css("z-index","");
		$("#video_sources .video").css("z-index","");

	}, 

}