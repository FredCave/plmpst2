var Objects = {

	container 		: "",
	camera 			: "",
	cameraTarget 	: "",
	scene 			: "",
	renderer 		: "",	
	controls 		: "", 

	init: function () {

		console.log("Objects.init");

		// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		var self = this;

		// this.container = document.createElement( 'div' );
		// document.body.appendChild( this.container );

        if ( Detector.webgl ) {
            this.renderer = new THREE.WebGLRenderer({ 
            	antialias: true,
            	alpha: true 
            });
        } else {
            this.renderer = new THREE.CanvasRenderer(); 
        }   
 
		this.renderer.setPixelRatio( window.devicePixelRatio * 1.2 );
		this.renderer.setClearColor(0xffffff, 0);

        this.container = document.getElementById( 'object' );
        this.container.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
		this.camera.position.set( 10, 0, 3 );
		this.cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

		// CONTROLS
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 0, 0 );
		this.controls.addEventListener( 'change', self.render.bind(this) );

		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;

		this.scene = new THREE.Scene();

		// LOAD FILE

		var loader = new THREE.STLLoader();
		loader.load( TEMPLATE + '/assets/objects/wall.stl', function ( geometry ) {

			var material = new THREE.MeshPhongMaterial( { color: 0xcccccc, specular: 0x888888, shininess: 0 } );
			var mesh = new THREE.Mesh( geometry, material );

			// mesh.position.set( 1, - 0.25, 0.6 );
			mesh.position.set( 0, -1, -1 );
			// mesh.rotation.set( 0, - Math.PI / 2, 0 );
			mesh.rotation.set( - Math.PI / 3.3, Math.PI / 9, Math.PI / 4 );
			mesh.scale.set( 0.05, 0.05, 0.05 );

			self.scene.add( mesh );

		} );

		// Lights
		this.scene.add( new THREE.HemisphereLight( 0xeeeeee, 0xaaaaaa ) );
		this.addShadowedLight( 1, 1, 1, 0xffffff, 1.25 );
		
		// renderer
		// this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		// this.renderer.setSize( window.innerWidth, window.innerHeight );
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.renderReverseSided = false;
		// this.container.appendChild( this.renderer.domElement );

		window.addEventListener( 'resize', self.onWindowResize(), false );

	},

	addShadowedLight : function ( x, y, z, color, intensity ) {

		var directionalLight = new THREE.DirectionalLight( color, intensity );
		directionalLight.position.set( x, y, z );
		this.scene.add( directionalLight );

		directionalLight.castShadow = true;

		var d = 1;
		directionalLight.shadow.camera.left = -d;
		directionalLight.shadow.camera.right = d;
		directionalLight.shadow.camera.top = d;
		directionalLight.shadow.camera.bottom = -d;

		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 4;

		directionalLight.shadow.mapSize.width = 1024;
		directionalLight.shadow.mapSize.height = 1024;

		directionalLight.shadow.bias = -0.005;

	}, 

	onWindowResize : function () {

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );

	}, 

	animate: function () {

		var self = this;

        // REDUCE FRAME RATE TO 12 FPS
        setTimeout( function() {

            requestAnimationFrame( function(){
                self.animate();
            } );

        }, 1000 / 24 );

		this.render();
		this.controls.update();

	}, 

	render: function () {

		this.renderer.render( this.scene, this.camera );

	}

}