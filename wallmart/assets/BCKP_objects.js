var Objects = {

	init: function () {

		console.log("Objects.init");

		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		var canvas;

		var scenes = [], renderer;

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

				// Look up the element that represents the area
				// we want to render the scene
				scene.userData.element = element.querySelector( ".scene" );
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
				mesh.scale.set( 0.05, 0.05, 0.05 );

				scene.add( mesh );

				// LIGHTS
				scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x999999 ) );
				var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
				light.position.set( 1, 1, 1 );
				scene.add( light );

  				var axis = new THREE.AxisHelper(20);
  				scene.add(axis);

				scenes.push( scene );


			});



			renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
			renderer.setClearColor( 0xffffff, 0 );
			// renderer.setClearColor( 0x000000, 0 );
			renderer.setPixelRatio( window.devicePixelRatio );

		}

		function updateSize() {

			var width = canvas.clientWidth;
			var height = canvas.clientHeight;

			if ( canvas.width !== width || canvas.height != height ) {

				renderer.setSize( width, height, false );

			}

		}

		function animate() {

	        // REDUCE FRAME RATE TO 24 FPS
	        setTimeout( function() {
	            requestAnimationFrame( function(){
	                animate();
	            });
	        }, 1000 / 12 );

			// requestAnimationFrame( animate );

			render();

		}

		function render() {

			updateSize();

			renderer.setClearColor( 0xffffff, 0 );
			renderer.setScissorTest( false );
			renderer.clear();

			// // renderer.setClearColor( 0xe0e0e0 );
			renderer.setScissorTest( true );

			scenes.forEach( function( scene ) {

				// ROTATE ELEMENTS
				scene.children[0].rotation.z = Date.now() * 0.00005;

				// GET THE ELEMENT THAT IS A PLACE HOLDER FOR WHERE WE WANT TO
				// DRAW THE SCENE
				var element = scene.userData.element;

				// GET ITS POSITION OF EACH SCENE RELATIVE TO THE PAGE'S VIEWPORT
				var rect = element.getBoundingClientRect();

				// check if it's offscreen. If so skip it
				if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
					 rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
					return;  // it's off screen
				}

				// console.log( 139, Math.floor(rect.top), Math.floor(rect.bottom), rect.left, rect.right );

				// CALC THE VIEWPORT
				var width  = rect.right - rect.left;
				var height = rect.bottom - rect.top;
				var left   = rect.left;
				var top    = rect.top;

				// SET VIEWPORT FOR EACH SCENE
				renderer.setViewport( left, top, width, height );
				renderer.setScissor( left, top, width, height );

				var camera = scene.userData.camera;

				//camera.aspect = width / height; // not changing in this example
				//camera.updateProjectionMatrix();

				scene.userData.controls.update();

				renderer.render( scene, camera );

			} );

		}

	}

}
