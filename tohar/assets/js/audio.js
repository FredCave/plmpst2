var Audio = {

	init: function () {

		console.log("Audio.init");

        // NO MOBILE ON AUDIO
        if ( !Info.detectMobile() ) {

            // IF IN BACKGROUND
            if ( $("#wrapper").attr("data-bg") == "true" ) {
                return;
            } 

            this.startMainLoop();

            this.startVoiceover();            

        }

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

        // START SRT AT SAME TIME AS THE AUDIO
        $("#main_audio_1")[0].onplaying = function() {
            console.log( 35, "Audio playing" );
            SRT.init({
                console : '#subtitles'
            });
            var SRT_URL = TEMPLATE + '/assets/srt/tohar_subs.srt';
            SRT.get( SRT_URL, function(){
                var skipSeconds = 0;
                SRT.play( skipSeconds );
            });
        };

	}, 

	startVoiceover: function () {

		console.log("Audio.startVoiceover");

		$("#voiceover_audio")[0].play();

	}, 

}