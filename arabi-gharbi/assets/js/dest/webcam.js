var Webcam = {
	
	captureDisabled: false, 

	init: function () {

		console.log("Webcam.init");

		this.bindEvents();

		// this.trackingInit();

		// CALLED FROM PAGE.JS ONCE POST DATA IS LOADED
		// this.initialState();

		// // TMP
		// $("#webcam_initial_image").hide();
		// $("#webcam_button_init").hide();
	
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
			self.captureImageClick( $(this) );
		});

		$("#webcam_success_yes").on( "click", function(){
			self.saveCaptureToDatabase();
			self.webcamClose();
		});

		$("#webcam_success_no").on( "click", function(){
			self.webcamClose();
		});

	},

	initialState: function ( imageData ) {

		console.log("Webcam.initialState");

		// LOAD RANDOM IMAGE FROM ARCHIVE
		var randomIndex = parseInt ( Math.random() * imageData.length ),
			webcamArray = [ imageData[randomIndex] ]; 

		Page.injectImage( "#webcam_initial_image", webcamArray );

		// TMP
		// this.webcamLoad();

	},

	getUserMedia: function () {

		console.log("Webcam.getUserMedia");

		$("#webcam_initial_image").hide();
		$("#webcam_button_init").hide();

		// TEST IF WEBCAM IN USE

		// TMP
		var webcamActive = true;
		if ( webcamActive ) {
			this.webcamLoad();
		} else {
			$("#webcam_access_screen").show();
		}

	},

	webcamLoad: function () {

		console.log("Webcam.webcamLoad");

		$("#webcam_access_screen").hide();

		$("#webcam_video").show();
		$("#canvas").show();

		$("#webcam_loaded_buttons").show().children().show();

		// INIT TRACKING + LOAD ELEMENTS
		this.trackingInit();

	},

	loadImages: function () {

		console.log("Webcam.loadImages");

		this.frame_image = new Image();
		this.frame_image.src = this.getFrameImage();

		this.tracking_image = new Image();
		this.tracking_image.src = this.getTrackingImage();

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
		this.tracker.setInitialScale(1.4);
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
			// ....

			event.data.forEach( function(rect) {
				// context.strokeStyle = '#a64ceb';
				// context.strokeRect(rect.x, rect.y, rect.width, rect.height);
				self.context.drawImage( self.tracking_image, rect.x, rect.y, rect.width, rect.height );
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

		// RETURN SRC
		return trackingImage["tracking_image"].url;

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

		// var draggableArray = this.imagesDraggable;

		// RETURN SRC

	},

	captureImageClick: function ( click ) {

		console.log("Webcam.captureImageClick");

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
			"download" 	: "Arabi Gharbi " + date + " at " + time + ".png", 
			"href" 		: this.captureImage()
		});

		// SAVE CURRENT FILENAME
		// this.currentFileName = "Arabi Gharbi " + date + " at " + time + ".png";

		// SHOW SUCCESS SCREEN
		$("#webcam_loaded_buttons").hide();
		$("#webcam_success").show();

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
        
        console.log( 260, videoElem, newCanvas.width, newCanvas.height );

        // DRAW ELEMENTS ONTO NEW CANVAS
        var context = newCanvas.getContext('2d'),
        	elemX = ( newCanvas.width - ( newCanvas.height * 1.33 ) ) / 2, // X POSITION OF ELEM ON CANVAS = ( CANVASW - ELEMW ) / 2
        	elemY = 0, // Y POSITION OF ELEM ON CANVAS = 0
        	elemW = newCanvas.height * 1.33, // WIDTH OF ELEM ON CANVAS = CANVAS HEIGHT * VIDEO RATIO
        	elemH = newCanvas.height; // HEIGHT OF ELEM ON CANVAS

        console.log( 269, elemX, elemY, elemW, elemH );

        context.drawImage( videoElem, elemX, elemY, elemW, elemH )
        context.drawImage( canvasElem, elemX, elemY, elemW, elemH );
 
        var img = document.createElement("img");
        img.src = newCanvas.toDataURL();

        this.currentCapture = img.src;

        return img.src;

	}, 

	saveCaptureToDatabase: function () {

		console.log("Webcam.saveCaptureToDatabase");

		// SAVE TO SERVER
		$.ajax({
			type: "POST",
			url: "save_image/",
			data: { 
		 		imgBase64: this.currentCapture
			}
		}).done( function(o) {
			console.log("Image saved."); 
		});

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

		// tracking.stopUserMedia();

	}

}