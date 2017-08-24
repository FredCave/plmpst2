var Objects = {

	init: function () {

		console.log("Objects.init");

		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		var self = this;

		var canvas, 
			scenes = [], 
			renderer;

		init();
		animate();

		function init () {

			canvas = document.getElementById( "canvas" );

			var content = document.getElementById("objects_wrapper"), 
				geometries = Page.geometries;

			// LOOP THROUGH FILENAMES FOR ORDER OF OBJECTS
			_.each( Page.filenames, function(filename) {

				var scene = new THREE.Scene();

				// MAKE LIST ITEMS
				element = document.createElement( "div" );
				element.className = "list-item";
				element.innerHTML = "<div class='scene'></div>";

				// FIND WRAPPER FOR SCENE
				scene.userData.element = element.querySelector( ".scene" );
				// APPEND CREATED ELEMENT
				content.appendChild( element );

				var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
				camera.position.z = 5; // WAS 2
				scene.userData.camera = camera;

				var controls = new THREE.TrackballControls( scene.userData.camera, scene.userData.element );
				controls.minDistance = 2;
				controls.maxDistance = 5;
				controls.enablePan = false;
				controls.enableZoom = false;
				controls.rotateSpeed = 10;

				// controls.staticMoving = false;
				// controls.dynamicDampingFactor = 0.01;

				scene.userData.controls = controls;

				// ADD OBJECT FROM GEOMETRIES ARRAY
				var material = new THREE.MeshPhongMaterial( { color: 0xeeeeee, specular: 0xaaaaaa, shininess: 0 } );
				
				// GET GEOMETRY BY NAME
				var thisGeometry = _.find( geometries, function(item) {
					return item.name == filename; 
				});

				var mesh = new THREE.Mesh( thisGeometry, material );
				
				mesh.position.set( 0, 0, 0 );
				mesh.rotation.set( - Math.PI / 2, - Math.PI / 12, 0 );
				
				var scale = 0.045;
				if ( filename === "palestinian_village" ) {
					scale *= 0.825;
				} else if ( filename === "checkpoint" || filename === "menorah" ) {
					scale *= 1.2;
				}

				mesh.scale.set( scale, scale, scale );

				scene.add( mesh );

				// LIGHTS
				scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x999999 ) );
				var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
				light.position.set( 1, 1, 1 );
				scene.add( light );

  				// var axis = new THREE.AxisHelper(20);
  				// scene.add(axis);

  				scene.name = filename;

  				// TMP
  				// var lineGeometry = new THREE.Geometry();
			   //  lineGeometry.vertices.push(new THREE.Vector3(-10, -10, 0),
			   //  new THREE.Vector3(10, -10, 0),
			   //  new THREE.Vector3(10, 10, 0),
			   //  new THREE.Vector3(-10, 10, 0),
			   //  new THREE.Vector3(-10, -10, 0));
			   //  var line = new THREE.Line(lineGeometry,
			   //  	new THREE.LineBasicMaterial({
			   //      	color: 0xffff00
			   //  	}));
			   //  scene.add(line);

			    // PUSH TO ARRAY OF SCENES
				scenes.push( scene );

				// FADE IN CANVAS
				$("#canvas").fadeIn(1000);

			});

			renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
			renderer.setClearColor( 0xffffff, 0 );
			// renderer.setClearColor( 0x000000, 0 );
			
			// CHROME / 1.244
			// SAFARI / 2

			console.log( 119, "Pixel ratio: ", window.devicePixelRatio );
			renderer.setPixelRatio( window.devicePixelRatio / 1.244  ); //  / 1.244 

			self.canvasSize();

		}

		function updateSize() {

			var width = canvas.clientWidth;
			var height = canvas.clientHeight;

			// console.log( 97, width, height );

			width = $("#objects_wrapper").width();
			// height = $("#objects_wrapper").outerHeight();

			// console.log( 131, width, height );

			// console.log( 101, canvas.clientHeight, height );
			$("#canvas").css({
				"width" : width,
				"height" : height 
			});

			if ( canvas.width !== width || canvas.height != height ) {
				renderer.setSize( width, height, false );
			}

		}

		function animate() {

	        // REDUCE FRAME RATE TO 15 FPS
	        setTimeout( function() {
	            requestAnimationFrame( function(){
	                animate();
	            });
	        }, 1000 / 2 ); // 15 IS A GOOD VALUE

			// requestAnimationFrame( animate );
			render();

		}

		function render() {

			updateSize();

			var scrollTop = $(window).scrollTop();
			var winH = $(window).height();

			renderer.setClearColor( 0xffffff, 0 );
			renderer.setScissorTest( false );
			renderer.clear();

			// renderer.setClearColor( 0xe0e0e0 );
			renderer.setScissorTest( true );

			var sceneIndex = 1;
			scenes.forEach( function( scene ) {

				// ROTATE ELEMENTS
				scene.children[0].rotation.z = Date.now() * 0.00005;

				// GET THE ELEMENT THAT IS A PLACE HOLDER FOR WHERE WE WANT TO
				// DRAW THE SCENE
				var element = scene.userData.element;

				// GET ITS POSITION OF EACH SCENE RELATIVE TO THE PAGE'S VIEWPORT
				var rect = element.getBoundingClientRect();

				// MODIFICATION
				// NEED POSITION RELATIVE TO DOCUMENT **NOT** VIEWPORT
				var calcTop = rect.top + window.scrollY,
					calcBottom = rect.bottom + window.scrollY;

				// console.log( 195, rect.top, calcTop);

				// CHECK IF OFFSCREEN : IF SO SKIP IT
				if ( calcBottom < 0 || calcTop > renderer.domElement.clientHeight ||
					 rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
					// console.log( scene.name, " offscreen" );
					// return;
				}

				// CALC THE VIEWPORT
				var width  = rect.right - rect.left;
				// var height = rect.bottom - rect.top;
				var height = calcBottom - calcTop;
				var left   = rect.left - 60;
				// var top    = rect.top;
				var top    = calcTop;

				if ( scene.name === "pillbox" ) {
					console.log( 213, top, height );
				}

				// SET VIEWPORT FOR EACH SCENE
				renderer.setViewport( left, top, width, height ); // ADDING TO TOP CREATES A TOP MARGIN ABOVE MODEL
				renderer.setClearColor( 0xffff00, 1 ); // BACKGROUND COLOUR FOR DEBUGGING
				renderer.setScissor( left, top, width, height );
				renderer.clearColor(); 

				var camera = scene.userData.camera;

				camera.aspect = width / height; // not changing in this example
				camera.updateProjectionMatrix();

				scene.userData.controls.update();

				renderer.render( scene, camera );

				sceneIndex++;

			} );

		}

	},

	canvasSize: function () {

		console.log( 216, "Objects.canvasSize" );

		console.log( 218, $("#objects_wrapper").height(), $("#canvas").height() );

		$("#canvas").css({
			"width" 	: $("#objects_wrapper").width(),
			"height" 	: $("#objects_wrapper").height() + $(window).height()
		});

	}

}
