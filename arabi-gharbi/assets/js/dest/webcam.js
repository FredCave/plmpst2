var Webcam = {
	
	running: false, 

	captureDisabled: false, 

	showCapture: false, 

	init: function () {

		console.log("Webcam.init");

		this.bindEvents();

		Webcam.loadWebcamArchive();

		// IF NOT MOBILE
		if ( !Info.detectMobile() ) {
			// SHOW BUTTON
			$("#webcam_button_init").fadeIn();
		} 
	
	},

	bindEvents: function () {

		console.log("Webcam.bindEvents");

		var self = this;

		$("#webcam_button_init").on( "click", function(){
			self.getUserMedia();
		});

		$("#webcam_button_close").on( "click", function(){
			self.webcamClose();
		});

		$("#webcam_button_refresh").on( "click", function(){
			self.loadImages();
		});

		$("#webcam_button_take").on( "click", function(){
			if ( !self.captureDisabled ) {
				self.captureImageClick( $(this) );
			}
		});

		$("#webcam_success_yes").on( "click", function(){
			self.saveCaptureToDatabase();
			self.webcamClose();
			self.captureDisabled = false;
		});

		$("#webcam_success_no").on( "click", function(){
			self.webcamClose();
			self.captureDisabled = false;
		});

	},

	loadWebcamArchive: function () {

		console.log("Webcam.loadWebcamArchive");

		var self = this;

		console.log( 62, ROOT + "/get_archive/" );

		$.ajax({
			type: "GET",
			url: ROOT + "/get_archive/",
			dataType: "json"
		}).done( function(data) {
		
			self.webcamImages = data;
			Webcam.initialState( self.webcamImages );
			console.log( 72, data );

		}).error( function( error ){
			console.log( 74, error );
		});

	},

	initialState: function ( imageData ) {

		console.log("Webcam.initialState");

		var self = this;

		// SHUFFLE IMAGES
		Page.shuffle( imageData );

		// INJECT FIRST IMAGE
		var i = 0;
		Page.injectImage( "#webcam_initial_image", imageData[i] );

		// CHANGE DURATION BASED ON LENGTH OF ARRAY
		var arrayLength = imageData.length,
			time;
		if ( arrayLength < 5 ) {
			time = 20;
		} else if ( arrayLength >= 5 && arrayLength < 10 ) {
			time = 15;
		} else {
			time = 8;
		}

		this.timer = setInterval( function(){
			if ( i >= arrayLength - 1 ) {
				i = 0;
			} else {
				i++;
			} 
			console.log( 112, self.showCapture );
			if ( !self.showCapture ) {
				Page.injectImage( "#webcam_initial_image", imageData[i] );
			}

		}, time * 1000 );

	},

	getUserMedia: function () {

		console.log("Webcam.getUserMedia");

		$("#webcam_initial_image").hide();
		$("#webcam_button_init").hide();

		// TEST IF WEBCAM FUNCTIONALITY
		if ( !Modernizr.getusermedia ) {
			$("#webcam_error_screen").show();
		} else {

			// SHOW ACCESS SCREEN
			$("#webcam_access_screen").show();

			// INIT TRACKING TO TEST IF WEBCAM IS ACTIVATED
			this.trackingInit();

		}

	},

	accessDenied: function () {

		console.log("Webcam.accessDenied");

		// SHOW ACCESS SCREEN
		$("#webcam_access_screen").show();

		$("#webcam_video").hide();
		$("#canvas").hide();

		$("#webcam_loaded_buttons").hide().children().hide();

	},

	accessSuccess: function () {

		console.log("Webcam.accessSuccess");

		$("#webcam_access_screen").hide();

		$("#webcam_video").show();
		$("#canvas").show();

		$("#webcam_loaded_buttons").show().children().show();

		this.running = true;
		// SWITCH OUT ANY ACTIVE VIDEOS TO STOP THEM FROM BUGGING
		Page.removeVideos();

	},

	loadImages: function () {

		console.log("Webcam.loadImages");

		this.frame_image = new Image();
		this.frame_image.src = this.getFrameImage();

		this.tracking_image = new Image();
		this.tracking_image.src = this.getTrackingImage()[0];
		this.tracking_image.ratio = this.getTrackingImage()[1];

  		this.static_image = new Image();
		this.static_image.src = this.getStaticImage();

	},

	trackingInit: function () {

		console.log("Webcam.trackingInit");

		var self = this;

		this.video = document.getElementById('webcam_video');
		this.canvas = document.getElementById('canvas');
		this.context = canvas.getContext('2d');

		// SET CANVAS SIZE ATTR TO ACTUAL SIZE
		var canvasH = $("#webcam_video").height(),
			canvasW = canvasH * 1.3333;

		$("#canvas").attr({
			"height" 	: canvasH,
			"width"		: canvasW
		}).css({
			"height" 	: canvasH,
			"width"		: canvasW			
		});

		this.tracker = new tracking.ObjectTracker('face');
		this.tracker.setInitialScale(1);
		this.tracker.setStepSize(1.1);
		this.tracker.setEdgesDensity(0.1);
		tracking.track('#webcam_video', this.tracker, { camera: true });

  		// X POSITION OF FRAME IN ORDER TO CENTER
  		var frameX = ( canvasW - canvasH * 0.7 ) / 2;

  		this.loadImages();

		this.tracker.on('track', _.throttle( function(event) {

			self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

			// DRAW FRAME
			self.context.drawImage( self.frame_image, frameX, canvasH * 0.05, canvasH * 0.7, canvasH * 0.9 );

			// DRAW STATIC IMAGE
			self.context.drawImage( self.static_image, frameX, canvasH * 0.05, canvasH * 0.7, canvasH * 0.9 );

			event.data.forEach( function(rect) {
				// self.context.strokeStyle = '#a64ceb';
				// self.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
				// SHIFT STARTING Y POS TO VERTICALLY CENTER IMAGE
				var diff = rect.height - ( rect.width / self.tracking_image.ratio ),
					centeredY = rect.y + ( diff / 2 );
				self.context.drawImage( self.tracking_image, rect.x, centeredY, rect.width, rect.width / self.tracking_image.ratio );
			});

		}, 100 ));

	},

	getTrackingImage: function () {

		console.log("Webcam.getTrackingImage");

		var trackingArray = this.imagesTracking;
		// SHUFFLE
		Page.shuffle( trackingArray );
		// GET FIRST IMAGE
		var trackingImage = trackingArray[0];

		// RETURN DATA IN ARRAY
		var imageData = [];
		imageData.push( trackingImage["tracking_image"].url );
		imageData.push( trackingImage["tracking_image"].width / trackingImage["tracking_image"].height );

		// RETURN IMAGEDATA
		return imageData;

	},

	getFrameImage: function () {

		console.log("Webcam.getFrameImage");

		var frameArray = this.imagesFrames;
		// SHUFFLE
		Page.shuffle( frameArray );
		// GET FIRST IMAGE
		var frameImage = frameArray[0];

		// RETURN SRC
		return frameImage["frame_image"].sizes.extralarge;

	},

	getStaticImage: function () {

		console.log("Webcam.getStaticImage");

		var staticArray = this.imagesDraggable;
		// SHUFFLE
		Page.shuffle( staticArray );
		// GET FIRST IMAGE
		var staticImage = staticArray[0];
		// RETURN SRC
		return staticImage["draggable_image"].sizes.extralarge;

	},

	captureImageClick: function ( click ) {

		console.log("Webcam.captureImageClick");

		var clickAudio = $("#cam_click").get(0);
		clickAudio.play();

		var capture = this.captureImage();

		// DISABLE CAPTURE
		this.captureDisabled = true;

		// GET CURRENT DATE AND TIME
		var today = new Date(),
			day = ( '0' + today.getDate() ).slice(-2),
			month = ( '0' + ( today.getMonth()+1 ) ).slice(-2),
			year = today.getFullYear(),
			hour = ( '0' + today.getHours() ).slice(-2),
			minute = ( '0' + today.getMinutes() ).slice(-2),
			second = ( '0' + today.getSeconds() ).slice(-2);
		var date = day + '-' + month + '-' + year;
		var time = hour + "." + minute + "." + second;
		// DOWNLOAD IMAGE
		click.attr({
			"download" 	: "Arabi-Arabi " + date + " at " + time + ".png", 
			"href" 		: capture
		});

		// SAVE CURRENT FILENAME
		// this.currentFileName = "Arabi Gharbi " + date + " at " + time + ".png";

		// SHOW SUCCESS SCREEN
		$("#webcam_loaded_buttons").hide();
		$("#webcam_success").show();

		// SHOW PHOTO
        this.showCapture( capture );

	},

	captureImage: function () {

		console.log("Webcam.captureImage");

		// GET ELEMENTS TO CAPTURE
		var videoElem = $("#webcam_video").get(0),
			canvasElem = $("#canvas").get(0);

		// CREATE NEW CANVAS
		var newCanvas = document.createElement("canvas");
		// SET FORMAT OF CANVAS BASED ON WHAT IS VISIBLE IN BROWSER : RATIO 1.36
        newCanvas.width = $("#webcam").width() * 1.67;
        newCanvas.height = $("#webcam").height() * 1.67;
        
        // DRAW ELEMENTS ONTO NEW CANVAS
        var context = newCanvas.getContext('2d'),
        	elemX = ( newCanvas.width - ( newCanvas.height * 1.33 ) ) / 2, // X POSITION OF ELEM ON CANVAS = ( CANVASW - ELEMW ) / 2
        	elemY = 0, // Y POSITION OF ELEM ON CANVAS = 0
        	elemW = newCanvas.height * 1.33, // WIDTH OF ELEM ON CANVAS = CANVAS HEIGHT * VIDEO RATIO
        	elemH = newCanvas.height; // HEIGHT OF ELEM ON CANVAS

        context.drawImage( videoElem, elemX, elemY, elemW, elemH )
        context.drawImage( canvasElem, elemX, elemY, elemW, elemH );
 
        var img = document.createElement("img");
        img.src = newCanvas.toDataURL();

        // DATA AS BASE64
        this.currentCapture = img.src;

        return img.src;

	}, 

	saveCaptureToDatabase: function () {

		console.log("Webcam.saveCaptureToDatabase");

		var self = this;

		// SAVE TO SERVER
		$.ajax({
			type: "POST",
			url: "save_image/",
			data: { 
		 		imgBase64: this.currentCapture
			}
		}).done( function(response) {
			// GET FILE PATH
			var path = MAIN_ROOT + response;
			self.uploadToComments( path );
		}).error( function(error){
			console.log("Error saving to database.");
		});

	}, 

	uploadToComments: function ( filepath ) {

		console.log("Webcam.uploadToComments", filepath);

		$("#comment").append( filepath );
		
		// GET THE COMMENT FORM
		var commentform=$('#commentform');
		// ON SUBMIT
		commentform.submit(function(){

			console.log( 390, "Comment submitted" );

			// SERIALIZE AND STORE FORM DATA
			var formdata=commentform.serialize();
		
			// EXTRACT ACTION URL FROM COMMENTFORM
			var formurl=commentform.attr('action');
			// POST FORM WITH DATA
			$.ajax({
				type: 'post',
				url: formurl,
				data: formdata,
				error: function( XMLHttpRequest, textStatus, errorThrown ) {
					console.log( 401, XMLHttpRequest, textStatus, errorThrown );
				},
				success: function(data, textStatus){
					if ( data == "success" ) {
						console.log( 405, textStatus, "Success" );
					} else {
						console.log( 407, textStatus, "!Success" );
					}
					// CLEAR FORM
					commentform.find('textarea[name=comment]').val('');
				}
			});
			return false;

		});

		// "CLICK" ON SUBMIT 
		// $("#submit").trigger("click");
		var clickEvent = new MouseEvent("click", {
		    "view": window,
		    "bubbles": true,
		    "cancelable": false
		});
		$("#submit")[0].dispatchEvent(clickEvent);

	},

	showCapture : function ( src ) {

		console.log("Webcam.showCapture");

		var self = this;

		// var img = new Image();
		// $(img).attr("src",src);

		Page.injectImage( "#webcam_initial_image", src );

		this.showCapture = true;
		setTimeout( function(){
			self.showCapture = false;
		}, 30000 );

	},

	webcamClose: function () {

		console.log("Webcam.webcamClose");

		$("#webcam_success").hide();
		$("#webcam_video").hide();
		$("#canvas").hide();
		$("#webcam_loaded_buttons").hide();
		$("#webcam_access_screen").hide();

		$("#webcam_initial_image").show();
		$("#webcam_button_init").show();

		// STOP STREAM
		var vidStream = this.video.srcObject,
			audioStreams = vidStream.getAudioTracks(), 
			videoStreams = vidStream.getVideoTracks();
		if ( audioStreams.length ) {
			audioStreams[0].stop();
		}
		if ( videoStreams.length ) {
			videoStreams[0].stop();
		}

		this.running = false;

	},

}