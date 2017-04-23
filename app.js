import './assets/scss/main.scss';
// import cubeD3 from './app/assets/js/components/cube';

import THREELib from 'three-js';

var THREE = THREELib();

var container;
var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var n = 3;
var BOX_WIDTH = 20;
var BOX_GAP = BOX_WIDTH + 20;

document.addEventListener('DOMContentLoaded', function() {
	init();
	animate();

	function init() {
		container = document.createElement('div');
		document.body.appendChild(container);
		var info = document.createElement('div');
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - interactive cubes';

		container.appendChild( info );

		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
		scene = new THREE.Scene();
		var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(1, 1, 1).normalize();
		scene.add(light);
		var geometry = new THREE.BoxBufferGeometry(BOX_WIDTH, BOX_WIDTH, BOX_WIDTH);

		for (var i = 0; i < n; i ++) {
			for (var j = 0; j < n; j++) {
				for (var k = 0; k < n; k++) {
					var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
					object.position.x = (i - (n / 2)) * BOX_GAP;
					object.position.y = (j - (n / 2)) * BOX_GAP;
					object.position.z = (k - (n / 2)) * BOX_GAP;

					scene.add(object);
				}
			}
		}

		raycaster = new THREE.Raycaster();
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xf0f0f0);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.sortObjects = false;
		container.appendChild(renderer.domElement);
		document.addEventListener('mousemove', onDocumentMouseMove, false);
		//
		window.addEventListener('resize', onWindowResize, false);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function onDocumentMouseMove( event ) {
		event.preventDefault();
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	}

	//
	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		theta += 0.1;
		camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
		camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
		camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
		camera.lookAt(scene.position);
		camera.updateMatrixWorld();
		// find intersections
		raycaster.setFromCamera(mouse, camera );
		var intersects = raycaster.intersectObjects(scene.children);

		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
				INTERSECTED = intersects[0].object;
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				INTERSECTED.material.emissive.setHex(0xff0000);
			}
		} else {
			if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
			INTERSECTED = null;
		}

		renderer.render(scene, camera);
	}
});