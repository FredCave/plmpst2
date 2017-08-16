var Webcam = {
	
	captureDisabled: false, 

	init: function () {

		console.log("Webcam.init");

		this.bindEvents();

		// this.trackingInit();

		// CALLED FROM PAGE.JS ONCE POST DATA IS LOADED
		// this.initialState();

		// TMP
		$("#webcam_initial_image").hide();
		$("#webcam_button_init").hide();
	
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
		this.webcamLoad();

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

	trackingInit: function () {

		console.log("Webcam.trackingInit");

		var video = document.getElementById('webcam_video');
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');

		// SET CANVAS SIZE ATTR TO ACTUAL SIZE
		var canvasW = $("#webcam_video").width(),
			canvasH = $("#webcam_video").height();
		console.log( 45, canvasW, canvasH );
		// $("#canvas").attr({
		// 	"height" 	: canvasH,
		// 	"width"		: canvasW
		// }).css({
		// 	"height" 	: canvasH,
		// 	"width"		: canvasW			
		// });

		var tracker = new tracking.ObjectTracker('face');
		tracker.setInitialScale(1.4);
		tracker.setStepSize(1.1);
		tracker.setEdgesDensity(0.1);

		tracking.track('#webcam_video', tracker, { camera: true });

		console.log( 49, tracker );

		// var frame_image = new Image();
		// frame_image.src = this.getFrameImage();

		var tracking_image = new Image();
		tracking_image.src = this.getTrackingImage();
		tracking_image.onload = function(){
			context.drawImage( tracking_image, 100, 100 );
  		}

  		var draggable_image = new Image();
		tracking_image.src = this.getTrackingImage();
		tracking_image.onload = function(){
			context.drawImage( tracking_image, 100, 100 );
  		}

		tracker.on('track', function(event) {

			context.clearRect(0, 0, canvas.width, canvas.height);

			event.data.forEach(function(rect) {
				context.strokeStyle = '#a64ceb';
				context.strokeRect(rect.x, rect.y, rect.width, rect.height);
				context.drawImage( tracking_image, rect.x, rect.y, rect.width, rect.height );
				// context.font = '11px Helvetica';
				// context.fillStyle = "#fff";
				// context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
				// context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
			});

		});

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
		var frame = frameArray[0];

		console.log( 151, frameArray, this.imagesFrames );

		// RETURN SRC

	},

	getDraggableImage: function () {

		console.log("Webcam.getDraggableImage");

		var draggableArray = this.imagesDraggable;

		// RETURN SRC

	},

	captureImageClick: function ( click ) {

		console.log("Webcam.captureImageClick");

		// DISABLE CAPTURE
		this.captureDisabled = true;

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

		this.currentFileName = "Arabi Gharbi " + date + " at " + time + ".png";

		// SHOW SUCCESS SCREEN
		$("#webcam_loaded_buttons").hide();
		$("#webcam_success").show();

	},

	captureImage: function () {

		console.log("Webcam.captureImage");

		var videoElem = $("#webcam_video").get(0),
			canvasElem = $("#canvas").get(0),  
			newCanvas = document.createElement("canvas");

        newCanvas.width = videoElem.videoWidth;
        newCanvas.height = videoElem.videoHeight * 2;
        var context = newCanvas.getContext('2d');
        context.drawImage( videoElem, 0 - ( newCanvas.width / 2 ), 0, newCanvas.width * 2, newCanvas.height )
        context.drawImage( canvasElem, 0 - ( newCanvas.width / 2 ), 0, newCanvas.width * 2, newCanvas.height );
 
        var img = document.createElement("img");
        img.src = newCanvas.toDataURL();

        this.currentCapture = img.src;

        return img.src;

	}, 

	saveCaptureToDatabase: function () {

		console.log("Webcam.saveCaptureToDatabase");

		// console.log( 259, this.currentCapture );

		// SAVE TO SERVER
		$.ajax({
			type: "POST",
			url: "save_image/",
			data: { 
		 		imgBase64: this.currentCapture,
		 		filename: this.currentFileName
			}
		}).done( function(o) {
			console.log('saved'); 
		});



	}, 

	webcamClose: function () {

		console.log("Webcam.webcamClose");

	}

}