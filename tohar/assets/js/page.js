var Page = {

	init: function () {

		console.log("Page.init");

		Audio.init();

		_.defer( function(){
			Video.init();			
		});

		Info.init();

		this.bindEvents();

	}, 

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$("#fullscreen").on("click", function(e) {

			e.preventDefault();
			self.toggleFullScreen();

		});

	}, 

	toggleFullScreen: function () {

		console.log("Info.toggleFullScreen");
		
		if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
			if (document.documentElement.requestFullScreen) {  
				document.documentElement.requestFullScreen();  
			} else if (document.documentElement.mozRequestFullScreen) {  
				document.documentElement.mozRequestFullScreen();  
			} else if (document.documentElement.webkitRequestFullScreen) {  
				document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
			}  
		} else {  
			if (document.cancelFullScreen) {  
				document.cancelFullScreen();  
			} else if (document.mozCancelFullScreen) {  
				document.mozCancelFullScreen();  
			} else if (document.webkitCancelFullScreen) {  
				document.webkitCancelFullScreen();  
			}  
		}  

	}, 

}

$(document).on("ready", function(){

	console.log("Document ready");

	Page.init();

});