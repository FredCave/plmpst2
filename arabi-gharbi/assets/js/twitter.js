var Twitter = {
	
	init: function () {

		console.log("Twitter.init");

		var self = this;

		$.ajax({
			url: 'tweets',
			type: 'GET',
			success: function(response) {

				if ( typeof response.errors === 'undefined' || response.errors.length < 1 ) {
					
					// LOOP THROUGH RESPONSES
					$.each(response, function(i, obj) {
						self.styleTweets( obj.id_str );
					});
					_.delay( function() {
						self.slideshowInit();
					}, 500 );


				} else {
					$('#tweets_wrapper p:first').text('Response error');
				}

			},
			error: function(errors) {
				$('#tweets_wrapper p:first').text('Request error');
			}
		});

	},

	styleTweets: function ( tweetId ) {

		console.log("Twitter.styleTweets");

		$("#twitter_wrapper ul").append("<li id='tweet_" + tweetId + "' class='tweet'></li>");

		var wrapper = document.getElementById("tweet_" + tweetId);
		twttr.widgets.createTweet( tweetId, wrapper, 
		{
			conversation : 'all',    // or all
			cards        : 'visible',  // or visible 
			linkColor    : '#cc0000', // default is blue
			theme        : 'light'    // or dark
		}).then (function (el) {
		});

	},

	slideshowInit: function () {

		console.log("Twitter.slideshowInit");

		$(".tweet").first().addClass("visible");

		setInterval( function(){

			console.log("Twitter loop.");
			if ( $(".visible").next().length ) {
				// GO TO NEXT
				$(".visible").removeClass("visible").next().addClass("visible");
			} else {
				// GO TO BEGINNING
				$(".visible").removeClass("visible");
				$(".tweet").first().addClass("visible");
			}

		}, 8000 );

	}

}