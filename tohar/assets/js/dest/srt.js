var SRT = ( function(){
	var o = this;
	o.props = {};
	var subtitles = [];

	/* PUBLIC */

	var init = function( _props ){
		var defaults = {
				console : '#console'
			};

		// Update properties
		o.props = $.extend({}, defaults, _props);
	}

	var get = function( URL, callback ){
		getSRT( URL, function( data ){
			// clear subtitles
			subtitles = [];

			// populate subtitles
			$.each( data, function( k, v ){
				var subtitle = new Subtitle( v );
				subtitles.push( subtitle );
			});

			callback();
		});
	}

	var play = function( skipSeconds ){
		skipSeconds *= 1000;
		startTimeline( skipSeconds );
	}

	var playByTheHour = function(){
		
		// console.log( "playByTheHour" );

		var subtitleIndex = 0;

		// find closest index regarding current time
		var now = new Date();
		now.setYear(0);
		now.setMonth(0);
		now.setDate(0);
		now.setHours(0);

		var nowInMillis = timeInMillis( now );
		$.each( subtitles, function( k, v){
			var subtitle = v;
			if( nowInMillis <= subtitle.getStartMillis() ){
				subtitleIndex = k;
				return false;
			}
		});

		var timeline = setInterval( function(){
			var subtitle = subtitles[ subtitleIndex ];

			now = new Date();
			updateCounter( now.getTime() );

			now.setYear(0);
			now.setMonth(0);
			now.setDate(0);
			now.setHours(0);

			nowInMillis = timeInMillis( now );

			if( nowInMillis >= subtitle.getStartMillis() && !subtitle.isActive() ){
				// console.log(' ');
				// console.log('[START #' + subtitle.index + ']');
				// console.log( subtitle.timecode );
				// console.log( subtitle.line1 );
				if( subtitle.line2 != null ){
					// console.log( subtitle.line2 );
				}
				subtitle.setActive( true )
				subtitle.display();
			}else if( nowInMillis >= subtitle.getEndMillis() ){
				// console.log('[END]');
				subtitle.setActive( false );
				subtitle.display();

				if( subtitleIndex < subtitles.length-1 ){
					subtitleIndex++;
				}else{
					subtitleIndex = 0;
				}
			}
			
		}, 0);
	}

	/* PRIVATE */

	var timeInMillis = function( date ){
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var mi = date.getMilliseconds();

		return ( h * 60 * 60 * 1000 ) + ( m * 60 * 1000 ) + ( s * 1000 ) + (mi);
	}

	var getSRT = function( url, callback ){
		var item = Array();

		var jsonList = [];
		var jsonItem = [];

		$.get( url, function(data){
			data = data.split('\n');
			
			$.each( data, function( k, v){
				if( v != "\r" ){
					v = v.replace('\r', '');
					item.push( v );
				}else{
					jsonItem["index"] = item[0];
					jsonItem["timecode"] = item[1];
					jsonItem["line1"] = item[2];
					jsonItem["line2"] = item[3];

					jsonList.push( jsonItem );
					jsonItem = [];

					item = [];
				}
			});

			callback( jsonList );
		});
	}


	var startTimeline = function( skipSeconds ){	
		var subtitleIndex = 0;
		var startDate = new Date();
		var startTime = startDate.getTime();

		var timeline = setInterval( function(){
			var currentDate = new Date();
			var timeCounter = currentDate.getTime();
			timeCounter -= startTime;

			var timer = timeCounter + skipSeconds;
			updateCounter( timer );

			var subtitle = subtitles[ subtitleIndex ];
			
			if ( subtitle === undefined ) {
				return;
			}

			if( timer >= subtitle.getStartMillis() && !subtitle.isActive() ){
				// console.log(' ');
				// console.log('[START #' + subtitle.index + ']');
				// console.log( subtitle.timecode );
				// console.log( subtitle.line1 );
				if( subtitle.line2 != null ){
					// console.log( subtitle.line2 );
				}
				subtitle.setActive( true )
				subtitle.display();
			}else if( timer >= subtitle.getEndMillis() ){
				// console.log('[END]');
				subtitle.setActive( false );
				subtitle.display();
				if( subtitleIndex < subtitles.length ){
					subtitleIndex++;
				}else{
					subtitleIndex = 0;
				}
			}
		}, 0);
	}

	var updateCounter = function( timer ){
		var $timecode = $('.js-timecode');

		var time = new Date( timer );
	
		var hour = time.getHours();
		var min = time.getMinutes();
		var sec = time.getSeconds();
		var millis = time.getMilliseconds();

		hour = ('0' + hour).slice(-2);
		min = ('0' + min).slice(-2);
		sec = ('0' + sec).slice(-2);
		millis = ('0' + millis).slice(-2);

		var str = hour + ":" + min + ":" + sec + ":" + millis;
		$timecode.html( str );
	}

	function Subtitle( props ){
		// timecodes should be translated to millis
		var start, end;

		if( props["timecode"] != null ){
			var timecodes = props["timecode"].split('-->');
	 		start = timecodeToObject( timecodes[0] );
	 		end = timecodeToObject( timecodes[1] );
	 	}

		this.index = props["index"];
		this.timecode = props["timecode"];
		this.start = start;
		this.end = end;
		this.line1 = props["line1"]; 
		this.line2 = props["line2"];
		this.active = false;

		this.getStartMillis = function(){
			return this.start.total;
		}

		this.getEndMillis = function(){
			return this.end.total;
		}

		this.isActive = function(){
			return this.active;
		}

		this.setActive = function( b ){
			this.active = b;
		}

		this.display = function(){
			var $console = $(o.props.console);
		
			var str = '';
			if( this.isActive() ){
				str = this.line1;
				if( this.line2 != null ){
					str += '<br/>';
					str += this.line2;
				}
			}

			$console.html( str );
		}
	}

	var timecodeToObject = function( _timecode ){
		var timecode = $.trim( _timecode );
		var timeRegex = /([0-9]+)/g;

		var matches = [];
		var match = timeRegex.exec( timecode );
		matches.push( match );

		while (match != null) {
			match = timeRegex.exec( timecode );
			matches.push( match );
		}

		//console.log( matches[0][0] + " | " + matches[1][0] + " | " + matches[2][0] + " | " + matches[3][0] );

		var time = {
			h  : parseInt(matches[0][0]),
			m  : parseInt(matches[1][0]), 
			s  : parseInt(matches[2][0]), 
			mi : parseInt(matches[3][0])
		}

		var total = (time.h * 60 * 60 * 1000) + (time.m * 60 * 1000) + (time.s * 1000) + time.mi;
		time.total = total;
		//console.log( total );

		return time;
	}

	/* */

	return {
		init: init,
		get: get,
		play: play,
		playByTheHour: playByTheHour
	}
})();
