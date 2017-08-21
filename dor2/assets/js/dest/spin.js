var Spin = {

	// container : "", 
	// camera : "",
	// sceneSpin : "", 
	// renderer : "", 

	// cube : "",
	// plane : "", 

	// mouseDown : false, 
	// rotateStartPoint : new THREE.Vector3(0, 0, 1), 
	// rotateEndPoint : new THREE.Vector3(0, 0, 1), 

	// curQuaternion : "", 
	// windowHalfX : window.innerWidth / 2, 
	// windowHalfY : window.innerHeight / 2, 
	// rotationSpeed : 2, 
	// lastMoveTimestamp : "", 
	// moveReleaseTimeDelta : 50, 

	// startPoint : {
	// 	x: 0,
	// 	y: 0
	// }, 

	// deltaX : 0,
	// deltaY: 0, 	

	// cubeAdded: false, 
	// currentCube: "", 

	// init: function () {

	// 	console.log("Spin.init");

	// 	// this.container = document.getElementById( 'space' );
	// 	// document.body.appendChild( this.container );

	// 	// this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	// 	// this.camera.position.y = 150;
	// 	// this.camera.position.z = 500;

	// 	this.sceneSpin = new THREE.Scene();

 //        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
 //        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
 //        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
 //        this.sceneSpin.add( this.camera );
 //        this.camera.position.set( 0, -100, 400 ); // 0, 150, 400
 //        this.camera.lookAt( this.sceneSpin.position ); 

 //        if ( Detector.webgl ) {
 //            this.renderer = new THREE.WebGLRenderer({ antialias: true });
 //        } else {
 //            this.renderer = new THREE.CanvasRenderer(); 
 //        }   

	// 	// this.renderer.setClearColor(0xf0f0f0);
	// 	this.renderer.setSize(window.innerWidth, window.innerHeight);

	// 	// this.container.appendChild(this.renderer.domElement);

	// 	document.addEventListener('mousedown', this.onDocumentMouseDown, false);

	// 	window.addEventListener('resize', this.onWindowResize, false);

	// 	this.animate();

	// }, 

	// fadeInLayer: function ( _layerId ) {

	// 	console.log("Spin.fadeInLayer", _layerId );

	// 	var self = this;

	// 	// console.log( 78, this.currentCube );
	// 	// IF ALREADY CUBE: FADE OUT FIRST
	// 	if ( this.sceneSpin.children.length > 1 ) {
	// 		this.fadeOutLayer();
	// 		setTimeout( function(){
	// 			self.fadeInLayer( _layerId );
	// 		}, 8000 );
	// 		return;
	// 	}

	// 	// CUBE
	// 	var cubeSize = 5000,
	// 		boxGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
	// 	// GET LAYER DATA
	// 	var cubeLetter = _layerId[0].charCodeAt(0) - 65, 
	// 		layer = _.findWhere( Page.cubeData[cubeLetter],{ ID:_layerId } );
	// 	// console.log( 47, layer );

 //        // LOOP THROUGH LAYER OBJECT
 //        var sources = [], 
 //            layerName, 
 //            layerId;
 //        for ( var index in layer ) {
 //            if ( layer.hasOwnProperty(index) ) {
 //                if ( layer[index] === false ) {
 //                    // CHECK IF IMAGES ARE LOADED
 //                    dataComplete = false;
 //                    // console.log( 135, "Data Incomplete" );
 //                } else if ( index === "name" ) {
 //                    layerName = layer[index];
 //                } else if ( index === "ID" ) {
 //                    layerId = layer[index];
 //                } else {
 //                    // console.log( 163, layerData[index].sizes );
 //                    // sources.push( layer[index].sizes.extralarge );  
 //                    sources.push( layer[index].url );                    
 //                }
 //            }
 //        }

	// 	var materialArray = [];
 //        for ( var i = 0; i < 6; i++ ) {
 //            materialArray.push( new THREE.MeshBasicMaterial({
 //                map: THREE.ImageUtils.loadTexture( sources[i] ),
 //                side: THREE.BackSide,
 //                transparent: true, 
 //                opacity: 0 
 //            }));    
 //        }

	// 	var material = new THREE.MeshFaceMaterial( materialArray );
	// 	this.cube = new THREE.Mesh(boxGeometry, material);
	// 	this.cube.frustumCulled = false;
	// 	this.cube.name = _layerId;
	// 	// this.cube.position.y = 200;
	// 	this.sceneSpin.add( this.cube );

	// 	// FADE IN 
	// 	var time = 10000;
 //        for ( var i = 0; i < this.cube.material.length; i++ ) {
 //            // console.log( 259, generatedCube.material[i] );
 //            new TWEEN.Tween( this.cube.material[i] ).to({ opacity: 1 }, time ).start();
 //        }
 //        this.cubeAdded = true;
 //        this.currentCube = _layerId;

	// }, 

	// fadeOutLayer: function () {

	// 	console.log("Spin.fadeOutLayer");

	// 	var layer = this.sceneSpin.getObjectByName( this.currentCube ),
	// 		duration = 5000, 
 //            self = this;

 //        // console.log( 139, this.currentCube, layer );

 //        if ( layer !== undefined && this.currentCube !== "" ) {

 //            for ( var i = 0; i < layer.material.length; i++ ) {
 //                new TWEEN.Tween( layer.material[i] ).to({ opacity: 0 }, duration ).start();
 //            }
 //            // AFTER FADE OUT: REMOVE LAYER FROM SCENE
 //            _.delay( function(){
 //                self.sceneSpin.remove( self.sceneSpin.getObjectByName( self.currentCube ) );
 //                self.cubeAdded = false;
 //                // console.log("Layer removed from sceneSpin.");
 //                this.currentCube = "";
 //            }, duration + 1000 );
            
 //        } else {
 //            // console.log( 345, "Layer undefined." );
 //        }

	// }, 

	// onWindowResize: function () {

	// 	console.log("Spin.onWindowResize");

	// 	Spin.windowHalfX = window.innerWidth / 2;
	// 	Spin.windowHalfY = window.innerHeight / 2;

	// 	Spin.camera.aspect = window.innerWidth / window.innerHeight;
	// 	Spin.camera.updateProjectionMatrix();

	// 	Spin.renderer.setSize( window.innerWidth, window.innerHeight );

	// }, 

	// onDocumentMouseDown: function (event) {

	// 	// console.log("Spin.onDocumentMouseDown");

	// 	event.preventDefault();

	// 	var self = this;

	// 	document.addEventListener('mousemove', Spin.onDocumentMouseMove, false);
	// 	document.addEventListener('mouseup', Spin.onDocumentMouseUp, false);

	// 	Spin.mouseDown = true;

	// 	Spin.startPoint = {
	// 		x: event.clientX,
	// 		y: event.clientY
	// 	};

	// 	Spin.rotateStartPoint = Spin.rotateEndPoint = Spin.projectOnTrackball(0, 0);

	// }, 

	// onDocumentMouseMove : function (event) {

	// 	// console.log("Spin.onDocumentMouseMove");

	// 	Spin.deltaX = event.x - Spin.startPoint.x;
	// 	Spin.deltaY = event.y - Spin.startPoint.y;

	// 	if ( Spin.cubeAdded ) {
	// 		Spin.handleRotation();
	// 	}

	// 	Spin.startPoint.x = event.x;
	// 	Spin.startPoint.y = event.y;

	// 	Spin.lastMoveTimestamp = new Date();

	// }, 

	// onDocumentMouseUp: function (event) {

	// 	// console.log("Spin.onDocumentMouseUp");

	// 	if ( new Date().getTime() - Spin.lastMoveTimestamp.getTime() > Spin.moveReleaseTimeDelta ) {
	// 		Spin.deltaX = event.x - Spin.startPoint.x;
	// 		Spin.deltaY = event.y - Spin.startPoint.y;
	// 	}

	// 	Spin.mouseDown = false;

	// 	document.removeEventListener('mousemove', Spin.onDocumentMouseMove, false);
	// 	document.removeEventListener('mouseup', Spin.onDocumentMouseUp, false);
	
	// }, 

	// projectOnTrackball : function (touchX, touchY) {

	// 	// console.log("Spin.projectOnTrackball");

	// 	var mouseOnBall = new THREE.Vector3();

	// 	mouseOnBall.set(
	// 		this.clamp(touchX / this.windowHalfX, -1, 1), this.clamp(-touchY / this.windowHalfY, -1, 1),
	// 		0.0
	// 	);

	// 	var length = mouseOnBall.length();

	// 	if (length > 1.0) {
	// 		mouseOnBall.normalize();
	// 	} else {
	// 		mouseOnBall.z = Math.sqrt(1.0 - length * length);
	// 	}

	// 	return mouseOnBall;

	// }, 

	// rotateMatrix: function (rotateStart, rotateEnd) {

	// 	// console.log("Spin.rotateMatrix");

	// 	var axis = new THREE.Vector3(),
	// 		quaternion = new THREE.Quaternion();

	// 	var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

	// 	if (angle) {
	// 		axis.crossVectors( rotateStart, rotateEnd ).normalize();
	// 		angle *= this.rotationSpeed;
	// 		quaternion.setFromAxisAngle(axis, angle);
	// 	}
	// 	return quaternion;

	// }, 

	// clamp : function (value, min, max) {

	// 	// console.log("Spin.clamp");

	// 	return Math.min( Math.max(value, min), max );

	// }, 

	// animate : function () {

	// 	var self = this;

 //        setTimeout( function() {

 //            requestAnimationFrame( function(){
 //                self.animate();
 //            } );

 //        }, 1000 / 24 );

	// 	this.render();

	// }, 

	// render : function () {

	// 	if (!this.mouseDown) {
	// 		// var drag = 0.95;
	// 		var drag = 0.85;
	// 		var minDelta = 0.05;

	// 		if (this.deltaX < -minDelta || this.deltaX > minDelta){
	// 			this.deltaX *= drag;
	// 		} else {
	// 			this.deltaX = 0;
	// 		}

	// 		if (this.deltaY < -minDelta || this.deltaY > minDelta) {
	// 			this.deltaY *= drag;
	// 		} else {
	// 			this.deltaY = 0;
	// 		}

	// 		if ( this.cubeAdded ) {
	// 			this.handleRotation();
	// 		}

	// 	}

	// 	this.renderer.render(this.sceneSpin, this.camera);

	// }, 

	// handleRotation : function() {

	// 	// console.log("Spin.handleRotation");

	// 	this.rotateEndPoint = this.projectOnTrackball( this.deltaX, this.deltaY );

	// 	var rotateQuaternion = this.rotateMatrix( this.rotateStartPoint, this.rotateEndPoint );
	// 	this.curQuaternion = this.cube.quaternion;
	// 	this.curQuaternion.multiplyQuaternions(rotateQuaternion, this.curQuaternion);
	// 	this.curQuaternion.normalize();
	// 	this.cube.setRotationFromQuaternion(this.curQuaternion);

	// 	this.rotateEndPoint = this.rotateStartPoint;
		
	// }, 

}
