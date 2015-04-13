OclussionThreshold = function () {

	this.windowHalfX = null;
    
    this.windowHalfY = null;
    
    this.projector = null;
	
	this.vFOV = null;

	this.camera = null;

	this.margin = null;

	this.scene = null;

	that = this;

	this.productMatrix = null;

    this.setMargin = function (margin) {
        this.margin = margin;
    },

	this.init = function (camera, scene, margin) {
		this.camera = camera;
		this.vFOV = camera.fov * Math.PI / 180;		
		this.projector = new THREE.Projector();
		this.windowHalfY = window.innerHeight / 2;
		this.windowHalfX = window.innerWidth / 2;
		this.margin = margin;
		this.scene = scene;

		window.addEventListener ('resize', this.refresh);

		return this;
	},

	this.refresh = function () {
		this.windowHalfY = window.innerHeight / 2;
		this.windowHalfX = window.innerWidth / 2;
	},

	this.cameraCalculation = function () {
		this.camera.updateMatrixWorld();

		(function () {

			// Camera Matrix World Inverse 
				var me = that.camera.matrixWorld.elements;
			    var te = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

			    var n11 = me[0], n12 = me[4], n13 = me[8], n14 = me[12];
		        var n21 = me[1], n22 = me[5], n23 = me[9], n24 = me[13];
		        var n31 = me[2], n32 = me[6], n33 = me[10], n34 = me[14];
		        var n41 = me[3], n42 = me[7], n43 = me[11], n44 = me[15];

			    var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];

			    if (det === 0) {
			        var cameraMatrixWorldInverse = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
			    } else {
			    	te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
			        te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
			        te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
			        te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
			        te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
			        te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
			        te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
			        te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
			        te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
			        te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
			        te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
			        te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
			        te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
			        te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
			        te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
			        te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

				    var s = 1.0 / det;

				    // MATRIX * SCALAR
					    te[0] *= s;
				        te[4] *= s;
				        te[8] *= s;
				        te[12] *= s;
				        te[1] *= s;
				        te[5] *= s;
				        te[9] *= s;
				        te[13] *= s;
				        te[2] *= s;
				        te[6] *= s;
				        te[10] *= s;
				        te[14] *= s;
				        te[3] *= s;
				        te[7] *= s;
				        te[11] *= s;
				        te[15] *= s;
				    //

				    var cameraMatrixWorldInverse = te;

			    }    

			//

			// Multiply Matrix
				var ae = that.camera.projectionMatrix.elements;
			    var be = cameraMatrixWorldInverse;
			    var te = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

			    var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
			    var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
			    var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
			    var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

			    var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
			    var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
			    var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
			    var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

			    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			    that.productMatrix = te;

			//

		})();
	}

	this.occlude = function (obj, mainLayer) {
		var date1 = new Date();

		this.cameraCalculation ();

		(function (obj, mainLayer) {
			obj.updateMatrixWorld();
			mainLayer.updateMatrixWorld();

			var vertices = obj.geometry.vertices;
			var length = vertices.length - 1;
			var objMatrixWorld = mainLayer.matrixWorld.elements;
			var boundingBox = {};
			var XYZDistance = {};

			// X
			var x = [];
			var i = length;
			do {
				x.push(vertices[i]['x']);
			} while(--i);

			//HIGHER X LOCAL TO WORLD
				var higher = {
					x: 0,
					y: 0,
					z: 0
				};

				var i = length;
				var t = 0;

		        do {
		        	if (vertices[t]['x'] < vertices[i]['x']) {
		        		t = i;
		        	}
		        } while(--i);

				var xA = vertices[t]['x'], yA = vertices[t]['y'], zA = vertices[t]['z'];

				higher.x = objMatrixWorld[ 0 ] * xA + objMatrixWorld[ 4 ] * yA + objMatrixWorld[ 8 ]  * zA + objMatrixWorld[ 12 ];
				higher.y = objMatrixWorld[ 1 ] * xA + objMatrixWorld[ 5 ] * yA + objMatrixWorld[ 9 ]  * zA + objMatrixWorld[ 13 ];
				higher.z = objMatrixWorld[ 2 ] * xA + objMatrixWorld[ 6 ] * yA + objMatrixWorld[ 10 ] * zA + objMatrixWorld[ 14 ];
			//

			//LOWER X LOCAL TO WORLD
				var lower = {
					x: 0,
					y: 0,
					z: 0
				};

				var i = length;
				var t = 0;

		        do {
		        	if (vertices[t]['x'] > vertices[i]['x']) {
		        		t = i;
		        	}
		        } while(--i);

				var xA = vertices[t]['x'], yA = vertices[t]['y'], zA = vertices[t]['z'];

				lower.x = objMatrixWorld[ 0 ] * xA + objMatrixWorld[ 4 ] * yA + objMatrixWorld[ 8 ]  * zA + objMatrixWorld[ 12 ];
				lower.y = objMatrixWorld[ 1 ] * xA + objMatrixWorld[ 5 ] * yA + objMatrixWorld[ 9 ]  * zA + objMatrixWorld[ 13 ];
				lower.z = objMatrixWorld[ 2 ] * xA + objMatrixWorld[ 6 ] * yA + objMatrixWorld[ 10 ] * zA + objMatrixWorld[ 14 ];
			//

			boundingBox.x = {
				'higher': higher,
				'lower': lower
			};

		//

		// Y

			var y = [];
			var i = length;
			do {
				y.push(vertices[i]['y']);
			} while(--i);

			//HIGHER X LOCAL TO WORLD
				var higher = {
					x: 0,
					y: 0,
					z: 0
				};

				var i = length;
				var t = 0;

		        do {
		        	if (vertices[t]['y'] < vertices[i]['y']) {
		        		t = i;
		        	}
		        } while(--i);

				var xA = vertices[t]['x'], yA = vertices[t]['y'], zA = vertices[t]['z'];

				higher.x = objMatrixWorld[ 0 ] * xA + objMatrixWorld[ 4 ] * yA + objMatrixWorld[ 8 ]  * zA + objMatrixWorld[ 12 ];
				higher.y = objMatrixWorld[ 1 ] * xA + objMatrixWorld[ 5 ] * yA + objMatrixWorld[ 9 ]  * zA + objMatrixWorld[ 13 ];
				higher.z = objMatrixWorld[ 2 ] * xA + objMatrixWorld[ 6 ] * yA + objMatrixWorld[ 10 ] * zA + objMatrixWorld[ 14 ];
			//

			//LOWER X LOCAL TO WORLD
				var lower = {
					x: 0,
					y: 0,
					z: 0
				};

				var i = length;
				var t = 0;

		        do {
		        	if (vertices[t]['y'] > vertices[i]['y']) {
		        		t = i;
		        	}
		        } while(--i);

				var xA = vertices[t]['x'], yA = vertices[t]['y'], zA = vertices[t]['z'];

				lower.x = objMatrixWorld[ 0 ] * xA + objMatrixWorld[ 4 ] * yA + objMatrixWorld[ 8 ]  * zA + objMatrixWorld[ 12 ];
				lower.y = objMatrixWorld[ 1 ] * xA + objMatrixWorld[ 5 ] * yA + objMatrixWorld[ 9 ]  * zA + objMatrixWorld[ 13 ];
				lower.z = objMatrixWorld[ 2 ] * xA + objMatrixWorld[ 6 ] * yA + objMatrixWorld[ 10 ] * zA + objMatrixWorld[ 14 ];
			//

			boundingBox.y = {
				'higher': higher,
				'lower': lower
			};

		//

		// Z

			var z = [];
		    var i = length;
			do {
				z.push(vertices[i]['z']);
			} while(--i);

			//HIGHER Z LOCAL TO WORLD
				var higher = {
					x: 0,
					y: 0,
					z: 0
				};

				var i = length;
				var t = 0;

		        do {
		        	if (vertices[t]['z'] < vertices[i]['z']) {
		        		t = i;
		        	}
		        } while(--i);

				var xA = vertices[t]['x'], yA = vertices[t]['y'], zA = vertices[t]['z'];

				higher.x = objMatrixWorld[ 0 ] * xA + objMatrixWorld[ 4 ] * yA + objMatrixWorld[ 8 ]  * zA + objMatrixWorld[ 12 ];
				higher.y = objMatrixWorld[ 1 ] * xA + objMatrixWorld[ 5 ] * yA + objMatrixWorld[ 9 ]  * zA + objMatrixWorld[ 13 ];
				higher.z = objMatrixWorld[ 2 ] * xA + objMatrixWorld[ 6 ] * yA + objMatrixWorld[ 10 ] * zA + objMatrixWorld[ 14 ];
			//

			//LOWER Z LOCAL TO WORLD
				var lower = {
					x: 0,
					y: 0,
					z: 0
				};

				var i = length;
				var t = 0;

		        do {
		        	if (vertices[t]['z'] > vertices[i]['z']) {
		        		t = i;
		        	}
		        } while(--i);

				var xA = vertices[t]['x'], yA = vertices[t]['y'], zA = vertices[t]['z'];

				lower.x = objMatrixWorld[ 0 ] * xA + objMatrixWorld[ 4 ] * yA + objMatrixWorld[ 8 ]  * zA + objMatrixWorld[ 12 ];
				lower.y = objMatrixWorld[ 1 ] * xA + objMatrixWorld[ 5 ] * yA + objMatrixWorld[ 9 ]  * zA + objMatrixWorld[ 13 ];
				lower.z = objMatrixWorld[ 2 ] * xA + objMatrixWorld[ 6 ] * yA + objMatrixWorld[ 10 ] * zA + objMatrixWorld[ 14 ];
			//

			boundingBox.z = {
				'higher': higher,
				'lower': lower
			};

		//

			obj.boundingBox = boundingBox;

			// HIGHER X CAMERA PROJECTION
				// PROJECT VECTOR 3
					var x = boundingBox.x.higher.x, y = boundingBox.x.higher.y, z = boundingBox.x.higher.z;

					var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

					xR = ( that.productMatrix[0] * x + that.productMatrix[4] * y + that.productMatrix[8] * z + that.productMatrix[12] ) * d;
					yR = ( that.productMatrix[1] * x + that.productMatrix[5] * y + that.productMatrix[9] * z + that.productMatrix[13] ) * d;
					zR = ( that.productMatrix[2] * x + that.productMatrix[6] * y + that.productMatrix[10] * z + that.productMatrix[14] ) * d;

			    //

			    var higher = ( xR * that.windowHalfX ) + that.windowHalfX;
			//

			// HIGHER X CAMERA PROJECTION

				// PROJECT VECTOR 3
					var x = boundingBox.x.lower.x, y = boundingBox.x.lower.y, z = boundingBox.x.lower.z;

					var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

					xR = ( that.productMatrix[0] * x + that.productMatrix[4] * y + that.productMatrix[8] * z + that.productMatrix[12] ) * d;
			    //

			    var lower = ( xR * that.windowHalfX ) + that.windowHalfX;
			//

			XYZDistance.x = higher - lower;

			// HIGHER Y CAMERA PROJECTION
				// PROJECT VECTOR 3
					var x = boundingBox.y.higher.x, y = boundingBox.y.higher.y, z = boundingBox.y.higher.z;

					var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

					yR = ( that.productMatrix[1] * x + that.productMatrix[5] * y + that.productMatrix[9] * z + that.productMatrix[13] ) * d;
			    //

			    var higher = ( yR * that.windowHalfY ) + that.windowHalfY;
			//

			// LOWER Y CAMERA PROJECTION
				// PROJECT VECTOR 3
					var x = boundingBox.y.lower.x, y = boundingBox.y.lower.y, z = boundingBox.y.lower.z;

					var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

					yR = ( that.productMatrix[1] * x + that.productMatrix[5] * y + that.productMatrix[9] * z + that.productMatrix[13] ) * d;
			    //

			    var lower = ( yR * that.windowHalfY ) + that.windowHalfY;
			//

			XYZDistance.y = higher - lower;

			// HIGHER X CAMERA PROJECTION
				// PROJECT VECTOR 3
					var x = boundingBox.z.higher.x, y = boundingBox.z.higher.y, z = boundingBox.z.higher.z;

					var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

					zR = ( that.productMatrix[2] * x + that.productMatrix[6] * y + that.productMatrix[10] * z + that.productMatrix[14] ) * d;
			    //

			    var higher = ( zR * that.windowHalfX ) + that.windowHalfX;
			//

			// HIGHER X CAMERA PROJECTION

				// PROJECT VECTOR 3
					var x = boundingBox.z.lower.x, y = boundingBox.z.lower.y, z = boundingBox.z.lower.z;

					var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

					xR = ( that.productMatrix[0] * x + that.productMatrix[4] * y + that.productMatrix[8] * z + that.productMatrix[12] ) * d;
			    //

			    var lower = ( zR * that.windowHalfX ) + that.windowHalfX;
			//

			XYZDistance.z = higher - lower;

			//CAMERA/OBJECT DISTANCE

				var cameraPosition = {};

				cameraPosition.x = ( that.camera.position.x - obj.position.x);
				cameraPosition.y = ( that.camera.position.y - obj.position.y);
				cameraPosition.z = ( that.camera.position.z - obj.position.z);

				cameraPosition.x = cameraPosition.x * cameraPosition.x;
				cameraPosition.y = cameraPosition.y * cameraPosition.y;
				cameraPosition.z = cameraPosition.z * cameraPosition.z;

				cPosition = Math.sqrt(cameraPosition.x + cameraPosition.y + cameraPosition.z);

			//

	        obj.renderAproximation = cPosition * that.margin / 
	        		 ( XYZDistance.x > XYZDistance.y && XYZDistance.x > XYZDistance.z ? 
	        		   		XYZDistance.x : 
	        		   	XYZDistance.y > XYZDistance.z ? 
	        		   		XYZDistance.y : 
	        		   	XYZDistance.z );

	       	var isVisible = 0;
				isVisible = XYZDistance.x > that.margin ? ++isVisible : isVisible;
				isVisible = XYZDistance.y > that.margin ? ++isVisible : isVisible;
				isVisible = XYZDistance.z > that.margin ? ++isVisible : isVisible;

			mainLayer.visible = isVisible >= 2;

		})(obj, mainLayer);
		
		return (Math.abs(new Date().getTime() - date1.getTime()) / 1000);
	},

    this.isObjectVisible = function (obj, mainLayer) {
    	var date1 = new Date();

    	if (obj.boundingBox)
	    	(function () {

				var XYZDistance = {};

	        	var boundingBox = obj.boundingBox;

	        	// HIGHER X CAMERA PROJECTION
					// PROJECT VECTOR 3
						var x = boundingBox.x.higher.x, y = boundingBox.x.higher.y, z = boundingBox.x.higher.z;

						var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

						xR = ( that.productMatrix[0] * x + that.productMatrix[4] * y + that.productMatrix[8] * z + that.productMatrix[12] ) * d;
						yR = ( that.productMatrix[1] * x + that.productMatrix[5] * y + that.productMatrix[9] * z + that.productMatrix[13] ) * d;
						zR = ( that.productMatrix[2] * x + that.productMatrix[6] * y + that.productMatrix[10] * z + that.productMatrix[14] ) * d;

				    //

				    var higher = ( xR * that.windowHalfX ) + that.windowHalfX;
				//

				// HIGHER X CAMERA PROJECTION

					// PROJECT VECTOR 3
						var x = boundingBox.x.lower.x, y = boundingBox.x.lower.y, z = boundingBox.x.lower.z;

						var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

						xR = ( that.productMatrix[0] * x + that.productMatrix[4] * y + that.productMatrix[8] * z + that.productMatrix[12] ) * d;
				    //

				    var lower = ( xR * that.windowHalfX ) + that.windowHalfX;
				//

				XYZDistance.x = higher - lower;

				// HIGHER Y CAMERA PROJECTION
					// PROJECT VECTOR 3
						var x = boundingBox.y.higher.x, y = boundingBox.y.higher.y, z = boundingBox.y.higher.z;

						var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

						yR = ( that.productMatrix[1] * x + that.productMatrix[5] * y + that.productMatrix[9] * z + that.productMatrix[13] ) * d;
				    //

				    var higher = ( yR * that.windowHalfY ) + that.windowHalfY;
				//

				// LOWER Y CAMERA PROJECTION
					// PROJECT VECTOR 3
						var x = boundingBox.y.lower.x, y = boundingBox.y.lower.y, z = boundingBox.y.lower.z;

						var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

						yR = ( that.productMatrix[1] * x + that.productMatrix[5] * y + that.productMatrix[9] * z + that.productMatrix[13] ) * d;
				    //

				    var lower = ( yR * that.windowHalfY ) + that.windowHalfY;
				//

				XYZDistance.y = higher - lower;

				// HIGHER X CAMERA PROJECTION
					// PROJECT VECTOR 3
						var x = boundingBox.z.higher.x, y = boundingBox.z.higher.y, z = boundingBox.z.higher.z;

						var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

						zR = ( that.productMatrix[2] * x + that.productMatrix[6] * y + that.productMatrix[10] * z + that.productMatrix[14] ) * d;
				    //

				    var higher = ( zR * that.windowHalfX ) + that.windowHalfX;
				//

				// HIGHER X CAMERA PROJECTION

					// PROJECT VECTOR 3
						var x = boundingBox.z.lower.x, y = boundingBox.z.lower.y, z = boundingBox.z.lower.z;

						var d = 1 / ( that.productMatrix[3] * x + that.productMatrix[7] * y + that.productMatrix[11] * z + that.productMatrix[15] ); // perspective divide

						xR = ( that.productMatrix[0] * x + that.productMatrix[4] * y + that.productMatrix[8] * z + that.productMatrix[12] ) * d;
				    //

				    var lower = ( zR * that.windowHalfX ) + that.windowHalfX;
				//

				XYZDistance.z = higher - lower;

				var isVisible = 0;
					isVisible = XYZDistance.x > that.margin ? ++isVisible : isVisible;
					isVisible = XYZDistance.y > that.margin ? ++isVisible : isVisible;
					isVisible = XYZDistance.z > that.margin ? ++isVisible : isVisible;

				mainLayer.visible = isVisible >= 2;

	    	})(obj, mainLayer);

        return (Math.abs(new Date().getTime() - date1.getTime()) / 1000);
    }

}; OT = new OclussionThreshold ();