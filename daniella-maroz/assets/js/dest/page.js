var Page = {

	init: function () {

		console.log("Page.init");

		Info.init();

	}

}

$(document).on("ready", function(){

	Page.init();

});