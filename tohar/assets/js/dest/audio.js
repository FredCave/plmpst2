var Audio = {

	init: function () {

		console.log("Audio.init");

		this.startMainLoop();

		this.startVoiceover();

	},

	startMainLoop: function () {

		console.log("Audio.startMainLoop");

        // FADE IN FIRST
        $("#main_audio_1").prop("volume", 0.1);
        $("#main_audio_1")[0].play();
        $("#main_audio_1").animate({
            volume : 1
        }, 1000, function(){
            var current = 1;
            // START LOOP
            setInterval( function(){
                console.log( "Audio loop.", "#main_audio_" + current );
                // TOGGLE AUDIOS
                current === 1 ? current = 2 : current = 1;
                console.log( 29, "#main_audio_" + current );
                $("#main_audio_" + current)[0].play();
            }, 696000 ); // 696000
        });

	}, 

	startVoiceover: function () {

		console.log("Audio.startVoiceover");

		$("#voiceover_audio")[0].play();

	}, 

}