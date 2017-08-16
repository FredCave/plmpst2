var Page = {

	init: function () {

		console.log("Page.init");

		Audio.init();

		Video.init();

		Info.init();

	}, 

}

$(document).on("ready", function(){

	console.log("Document ready");

	Page.init();

});