var NewObjects = {

	run: function () {

		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		var canvas = document.getElementById( "wallmart_canvas" );

		var scenes = [], renderer;

		init();
		animate();

		function init() {

			// MOVED ABOVE
			// canvas = document.getElementById( "canvas" );

			// ORIGINAL
			// var geometries = [
			// 	new THREE.BoxGeometry( 1, 1, 1 ),
			// 	new THREE.SphereGeometry( 0.5, 12, 8 ),
			// 	new THREE.DodecahedronGeometry( 0.5 ),
			// 	new THREE.CylinderGeometry( 0.5, 0.5, 1, 12 )
			// ];

			var template = document.getElementById( "template" ).text;
			var content = document.getElementById( "wallmart_content" ),
				geometries = Page.geometries;

			console.log( 31, content );

			// LOOP THROUGH FILENAMES FOR ORDER OF OBJECTS
			_.each( Page.filenames, function(filename) {

			// ORIGINAL LOOP
			// for ( var i =  0; i < 12; i ++ ) {

				var scene = new THREE.Scene();

				// make a list item
				var element = document.createElement( "div" );
				element.className = "list-item";
				element.innerHTML = template;
				// ORIGINAL
				// element.innerHTML = template.replace( '$', i + 1 );

				// Look up the element that represents the area
				// we want to render the scene
				scene.userData.element = element.querySelector( ".scene" );
				content.appendChild( element );

				var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
				camera.position.z = 5; // WAS 2
				scene.userData.camera = camera;

				// ORIGINAL: CAMERA
				// var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
				// camera.position.z = 2;
				// scene.userData.camera = camera;

				// CONTROLS
				var controls = new THREE.TrackballControls( scene.userData.camera, scene.userData.element );
				controls.minDistance = 2;
				controls.maxDistance = 5;
				controls.enablePan = false;
				controls.enableZoom = false;
				controls.rotateSpeed = 10;

				// ORIGINAL: CONTROLS
				// var controls = new THREE.OrbitControls( scene.userData.camera, scene.userData.element );
				// controls.minDistance = 2;
				// controls.maxDistance = 5;
				// controls.enablePan = false;
				// controls.enableZoom = false;

				scene.userData.controls = controls;

				// GET GEOMETRY BY NAME
				var thisGeometry = _.find( geometries, function(item) {
					return item.name == filename; 
				});

				// GEOMETRY: ORIGINAL – add one random mesh to each scene
				// var geometry = geometries[ geometries.length * Math.random() | 0 ];

				// MATERIAL
				var material = new THREE.MeshPhongMaterial( { color: 0xeeeeee, specular: 0xaaaaaa, shininess: 0 } );
				
				// MATERIAL: ORIGINAL
				// var material = new THREE.MeshStandardMaterial( {
				// 	color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
				// 	roughness: 0.5,
				// 	metalness: 0,
				// 	flatShading: true
				// } );

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

				// ORIGINAL
				// scene.add( new THREE.Mesh( geometry, material ) );

				// LIGHTS
				scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x999999 ) );
				var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
				light.position.set( 1, 1, 1 );
				scene.add( light );

				// LIGHTS: ORIGINAL
				// scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
				// var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
				// light.position.set( 1, 1, 1 );
				// scene.add( light );

				scenes.push( scene );


			});

			// } // END OF ORIGINAL LOOP

			renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
			renderer.setClearColor( 0xffffff, 0 );
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

	        // REDUCE FRAME RATE TO 15 FPS
	        setTimeout( function() {
	            requestAnimationFrame( function(){
	                animate();
	            });
	        }, 1000 / 15 ); // 15 IS A GOOD VALUE

			render();

			// ANIMATE: ORIGINAL
			// render();
			// requestAnimationFrame( animate );

		}

		function render() {

			updateSize();

			renderer.setClearColor( 0xffffff, 0 );
			renderer.setScissorTest( false );
			renderer.clear();

			// renderer.setClearColor( 0xe0e0e0 );
			renderer.setScissorTest( true );

			scenes.forEach( function( scene ) {

				// ROTATE ELEMENTS
				scene.children[0].rotation.z = Date.now() * 0.00005;

				// ORIGINAL: so something moves
				// scene.children[0].rotation.y = Date.now() * 0.001;

				// get the element that is a place holder for where we want to
				// draw the scene
				var element = scene.userData.element;

				// get its position relative to the page's viewport
				var rect = element.getBoundingClientRect();

				// check if it's offscreen. If so skip it
				if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
					 rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {

					return;  // it's off screen

				}

				// set the viewport
				var width  = rect.right - rect.left;
				var height = rect.bottom - rect.top;
				var left   = rect.left;
				var top    = rect.top;

				renderer.setViewport( left, top, width, height );
				renderer.setScissor( left, top, width, height );

				var camera = scene.userData.camera;

				// ADDED:
				scene.userData.controls.update();

				renderer.render( scene, camera );

			} );

		}

	}

}


