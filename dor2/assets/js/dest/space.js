// Space.init();
// Space.animate();

var Space = {

    container   : "",
    scene       : "",
    camera      : "",
    renderer    : "",
    controls    : "",
    cube        : "",
    clock       : new THREE.Clock(), 

    cubeIndex   : 0, 
    axesVisible : false,

    init : function () {

        console.log("Space.init");

        var self = this;

        // SCENE
        this.scene = new THREE.Scene();
        
        // CAMERA
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add( this.camera );
        this.camera.position.set( 0, -100, 400 ); // 0, 150, 400
        this.camera.lookAt( this.scene.position );  

        // RENDERER
        if ( Detector.webgl ) {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
        } else {
            this.renderer = new THREE.CanvasRenderer(); 
        }   
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.autoClear = false;

        // this.renderer.sortObjects = false;
        
        this.container = document.getElementById( 'space' );
        this.container.appendChild( this.renderer.domElement );

        // EVENTS
        THREEx.WindowResize( this.renderer, this.camera );

        // CONTROLS
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
                  
        // AXES
        // var axes = new THREE.AxisHelper(100);
        // axes.name = "axes";
        // this.scene.add( axes );
        // axes.visible = false;

        this.createSceneTwo();

    }, 

    createSceneTwo : function () {

        console.log("Space.createSceneTwo");

        this.renderer.autoClear = false;
        this.sceneTwo = new THREE.Scene();

    },

    animate : function () {

        // console.log("Space.animate");

        var self = this;



        // REDUCE FRAME RATE TO 24 FPS
        setTimeout( function() {

            requestAnimationFrame( function(){
                self.animate();
            } );

        }, 1000 / 24 );

        this.render();       

        // TMP ???
        var currTime = new Date().getTime() / 1000;
        var dt = currTime - (self.lastFrameTime || currTime);
        self.totalGameTime += dt;
        // END OF TMP ???

        this.update( dt, self.totalGameTime );   
        TWEEN.update();    

        self.lastFrameTime = currTime; 

    }, 

    // TMP ??

    lastFrameTime : new Date().getTime() / 1000, 

    totalGameTime : 0, 

    // END OF TMP ???

    update : function ( dt, t ) {

        // console.log("Space.update");

        var self = this;

        this.controls.update();  

        if ( this.isDragging && Page.phasedLayer !== "" ) {

            Page.phasedLayer.rotation.y += 0.1 * dt;
            // Page.phasedLayer.rotation.y += 1 * dt;
            // console.log( Page.phasedLayer.name, dt, Page.phasedLayer.rotation.x, Page.phasedLayer.rotation.y );            
        }

        setTimeout(function() {
            var currTime = new Date().getTime() / 1000;
            var dt = currTime - (self.lastFrameTime || currTime);
            self.totalGameTime += dt;
            self.update(dt, self.totalGameTime);
        }, 0 );

    }, 

    render : function () {

        // console.log("Space.render");

        // this.renderer.render( this.scene, this.camera );   

        this.renderer.clear();

        this.renderer.render( this.sceneTwo, this.camera ); 
        this.renderer.clearDepth();
        this.renderer.render( this.scene, this.camera );
        this.renderer.clearDepth();
        // this.renderer.render( Spin.sceneSpin, Spin.camera );

    }, 

    generateCube : function () {

        console.log("Space.generateCube");

        // var self = this;

        // // GET ALL DATA FROM CURRENT CUBE
        // var thisCube = Page.cubeData[ this.cubeIndex ];

        // // ADD LI IN BUTTON WRAPPER
        // // Controls.addCubeButtons();

        // // LAYER INDEX TO IDENTIFY LAYERS
        // var layerIndex = 1;

        // // LOOP THROUGH ALL LAYERS
        // _.each( thisCube, function( layer ){

        //     // LAYER = OBJECT
        //     self.prepareLayer( layer, layerIndex );
        //     layerIndex++;

        // });

        // // ADD CUBE CONTROLS AT END OF ROW
        // Controls.addControls();

        // this.cubeIndex++;
        // if ( this.cubeIndex < 6 ) {
        //     this.generateCube();
        // } else if ( this.cubeIndex === 6  ) {

        //     Controls.slidersInit();

        // }

    }, 

    prepareLayer : function ( layerData, time ) {

        console.log("Space.prepareLayer");

        var dataComplete = true,
            self = this;

        // SORT THROUGH DATA
            // LOAD IMAGE SRCs INTO ARRAY
            // STORE LAYER NAME TO ADD TO BUTTON

        // LOOP THROUGH LAYER OBJECT
        var sources = [], 
            layerName, 
            layerId;
        for ( var index in layerData ) {
            
            if ( layerData.hasOwnProperty(index) ) {
                if ( layerData[index] === false ) {
                    // CHECK IF IMAGES ARE LOADED
                    dataComplete = false;
                    // console.log( 135, "Data Incomplete" );
                } else if ( index === "name" ) {
                    layerName = layerData[index];
                } else if ( index === "ID" ) {
                    layerId = layerData[index];
                } else {
                    // console.log( 163, layerData[index].sizes );
                    // sources.push( layerData[index].sizes.extralarge );  
                    sources.push( layerData[index].url );                    
                }
            }
        }

        if ( dataComplete ) {

            // PRELOAD IMAGES BEFORE ADDING THEM TO MESH
            var i = 0;
            function imagePreloader () {
                console.log("imagePreloader", i);
                if ( i < sources.length - 1 ) {
                    var img = new Image();
                    $(img).attr( "src", sources[i] ).on("load", function(){
                        console.log( 234, i, "Image loaded." );
                        i++;
                        imagePreloader();
                    });
                } else {
                    console.log("All images preloaded.");
                    self.generateLayer( sources, layerId, time );
                    return;
                }
            }
            imagePreloader(); 

        }

    },

    generateLayer: function ( sources, layerId, time ) {

        console.log("Space.generateLayer", layerId, time );

        var cubeSize = 6000, 
            geometry = new THREE.CubeGeometry( cubeSize, cubeSize, cubeSize );   
    
        var materialArray = [];
        for (var i = 0; i < 6; i++) {
            
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( sources[i] ),
                side: THREE.BackSide,
                transparent: true, 
                opacity: 0 
            })); 

        }

        var material = new THREE.MeshFaceMaterial( materialArray );
        var box = new THREE.Mesh( geometry, material );
        box.frustumCulled = false;

        // SET NAME
        box.name = layerId;
       // IF E4, C4, B3, A4 : STATIC
        if ( layerId === "E4" || layerId === "C4" || layerId === "B3" || layerId === "A4" ) {
            this.sceneTwo.add( box ); 
        } else {
            this.scene.add( box );  
        }

        // ROTATE LAYERS 180 SO THAT FIRST TEMPLE IS VISIBLE ON LOAD
        box.rotateY(180);                 
           
        // ADD BUTTON IN BUTTON WRAPPER
        // Controls.addLayerButton( layerName );

        setTimeout( function(){

            // FADE IN 
            // console.log( 257, box );
            for ( var i = 0; i < box.material.length; i++ ) {
                // console.log( 259, box.material[i] );
                new TWEEN.Tween( box.material[i] ).to({ opacity: 1 }, time ).start();
            }

        }, 500 );

    }, 

    hideLayer : function ( id ) {

        console.log("Space.hideLayer", id );

        var box = this.scene.getObjectByName( id ) || this.camera.getObjectByName( id );
        // LOOP THROUGH SIDES OF CUBE
        _.each( box.material.materials, function ( material ) {
            material.opacity = 0;
        });

    },

    showLayer: function ( id ) {

        console.log("Space.showLayer", id );

        var box = this.scene.getObjectByName( id ) || this.camera.getObjectByName( id );
        // LOOP THROUGH SIDES OF CUBE
        _.each( box.material.materials, function ( material ) {
            material.opacity = 1;
        });

    },

    fadeInLayer: function ( name, time ) {

        console.log("Space.fadeInLayer", name, time );

        var self = this;

        // GET LAYER DATA
        var cube = name[0].charCodeAt(0) - 65;

        // console.log( 225, cube);

        var layer = _.findWhere( Page.cubeData[cube],{ ID:name } );

        // console.log( 229, Page.cubeData[cube] );

        // GENERATE LAYER
        // if ( sceneTwo ) {
        //     this.prepareLayer( layer, time, true );             
        // } else {
        this.prepareLayer( layer, time );              
        // }

    },

    fadeOutLayer: function ( name, time ) {

        console.log("Space.fadeOutLayer", name, time );

        var layer = this.scene.getObjectByName( name ) || this.sceneTwo.getObjectByName( name ),
            self = this;

        // console.log( 331, layer );

        if ( layer !== undefined ) {

            for ( var i = 0; i < layer.material.length; i++ ) {
                new TWEEN.Tween( layer.material[i] ).to({ opacity: 0 }, time ).start();
            }
            // AFTER FADE OUT: REMOVE LAYER FROM SCENE
            _.delay( function(){
                console.log(346);
                self.scene.remove( self.scene.getObjectByName(name) );
                // console.log("Layer removed from scene.");
            }, time + 1000 );

        } else {
            // console.log( 345, "Layer undefined." );
        }

    },

    hideCube: function ( char ) {

        console.log("Space.hideCube", char );

        var layers = this.scene.children;
        _.each( layers, function( layer ){
            // IF LAYER NAME CONTAINS CHAR
            if ( layer.name.indexOf( char ) > -1 ) {
                _.each( layer.material.materials, function ( material ) {
                    material.opacity = 0;
                });
            }
        });

    }, 

    showCube: function ( char ) {

        console.log("Space.showCube", char );

        var layers = this.scene.children;
        _.each( layers, function( layer ){
            // IF LAYER NAME CONTAINS CHAR
            if ( layer.name.indexOf( char ) > -1 ) {
                _.each( layer.material.materials, function ( material ) {
                    material.opacity = 1;
                });
            }
        });

    }, 

    toggleAxes: function () {

        console.log("Space.toggleAxes");

        var axes = this.scene.getObjectByName( "axes" );

        if ( this.axesVisible ) {
            axes.visible = false;
            this.axesVisible = false;
        } else {
            axes.visible = true;
            this.axesVisible = true;            
        }

    },

    changeOpacity: function ( char, value ) {

        console.log("Space.changeOpacity", char, value);

        var layers = this.scene.children;
        _.each( layers, function( layer ){
            // IF LAYER NAME CONTAINS CHAR
            if ( layer.name.indexOf( char ) > -1 ) {
                _.each( layer.material.materials, function ( material ) {
                    // IF VALUE IS NOT ZERO: CHANGE ONLY VISIBLE LAYER
                    if ( value > 0 && material.opacity > 0 ) {
                        material.opacity = value;
                    }
                });
            }
        });

    },

    changeSize: function ( char, value ) {

        console.log("Space.changeSize", char, value );

        var layers = this.scene.children;
        // INVERT VALUE (?) – CLOSER TO 0 IS BIGGER
        value = ( value + 1 ) * 5000;
        _.each( layers, function( layer ){
            // IF LAYER NAME CONTAINS CHAR
            if ( layer.name.indexOf( char ) > -1 ) {
                // console.log( 292, layer );
                layer.geometry.depth = value;
                layer.geometry.height = value;
                layer.geometry.width = value;
            }
        });

    },   

    isDragging: false, 

    rotateLayer: function ( layerId ) {

        console.log("Space.rotateLayer", layerId);

        var self = this;

        if ( this.phasedLayer === "" ) {
            return;
        }

        function toRadians ( angle ) {
            return angle * ( Math.PI / 180 );
        }

        var previousMousePosition = {
                x: 0, y: 0
            };

        $("#space").on('mousedown', function(e) {
            
            self.isDragging = true;

        }).on('mousemove', function(e) {

            var deltaMove = {
                x: e.offsetX-previousMousePosition.x,
                y: e.offsetY-previousMousePosition.y
            };

            if( self.isDragging) {
                    
                var deltaRotationQuaternion = new THREE.Quaternion()
                    .setFromEuler(new THREE.Euler(
                        toRadians(deltaMove.y * 1),
                        toRadians(deltaMove.x * 1),
                        0,
                        'XYZ'
                    ));
                
                self.phasedLayer.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
            }
            
            previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };

        });

        $(document).on('mouseup', function(e) {

            self.isDragging = false;

        });

    },

}
