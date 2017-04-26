var s = require('../assets/scss/main.scss');
import THREELib from 'three-js';

const THREE = THREELib();

let container;
let camera, scene, raycaster, renderer;
let mouse = new THREE.Vector2(), INTERSECTED;
let singleColor, matrixN, matrixGap, matrixGapInput;

let isMouseDown = false;
let X = 0, Y = 0;
let phi = 90, theta = 90, onMouseDownTheta = theta, onMouseDownPhi = phi;
let radius = 100, zoomFactor = 1;
let ZOOM_MIN = 0.1, ZOOM_MAX = 25;
let n = 3;
let BOX_WIDTH = 20;
let BOX_GAP;
let toolBar, toolBarTimer;
let isIntersected = false;

document.addEventListener('DOMContentLoaded', function() {
	const init = () => {
		matrixGapInput = document.querySelector('#matrixGap');
		matrixGapInput.innerHTML = matrixGap.value;
		BOX_GAP = BOX_WIDTH + parseInt(matrixGap.value);

		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
		scene = new THREE.Scene();

		setMatrixBoxes();

		raycaster = new THREE.Raycaster();
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xf0f0f0);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.sortObjects = false;
		container.appendChild(renderer.domElement);

	}

	const getItems = () => {
		toolBar = document.querySelector('.tool-bar');
		singleColor = document.querySelector('input[name="single-color"]');
		matrixN = document.querySelector('#matrixN');
		matrixGap = document.querySelector('input[name="matrixGap"]');
		container = document.createElement('div');
	}

	const listeners = () => {
		toolBar.addEventListener('mouseover', onToolBarMouseOver);
		singleColor.addEventListener('change', onColorChange);
		matrixN.addEventListener('click', onMatrixNChange);
		matrixGap.addEventListener('input', onMatrixGapChange);
		document.addEventListener('mousemove', onDocumentMouseMove, false);
		window.addEventListener('resize', onWindowResize, false);
		container.addEventListener('mousemove', onContainerMouseMove, false);
		container.addEventListener('mouseout', onContainerMouseOut, false);
		container.addEventListener('mousedown', onContainerMouseDown, false);
		container.addEventListener('mouseup', onContainerMouseUp, false);
		container.addEventListener("mousewheel", onMouseWheelHandler, false);
		container.addEventListener("DOMMouseScroll", onMouseWheelHandler, false);
	}

	const addSpotLight = () => {
		var light1 = new THREE.DirectionalLight(0xffffff, 1);
		light1.position.set(1, 1, 1).normalize();
		scene.add(light1);
		var light2 = new THREE.DirectionalLight(0xffffff, 1);
		light2.position.set(-1, -1, -1).normalize();
		scene.add(light2);
	}

	const setMatrixBoxes = () => {
		while(scene.children.length > 0){
  	  scene.remove(scene.children[0]);
		}
		addSpotLight();


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
	}

	const onToolBarMouseOver = (e) => {
		clearTimeout(toolBarTimer);
	}

	const onColorChange = (e) => {
		var rgb = e.target.value;
		var hex = rgb.replace(/#/, '0x');

		INTERSECTED.material.color.setHex(hex);
		render();
	}

	const onMatrixNChange = (e) => {
		const matrixNInput = document.querySelector('input[name="matrixN"]');
		let value = matrixNInput.value;

		if (value && !isNaN(value)) {
			n = parseInt(value);
			setMatrixBoxes();
		}

		render();
	}

	const onMatrixGapChange = (e) => {
		const value = e.target.value;
		matrixGapInput.innerHTML = value;
		BOX_GAP = BOX_WIDTH + parseInt(value);

		let startItem = 0;
		scene.children.forEach((child, idx) => {
			if (child instanceof THREE.Mesh) {
				if (startItem == 0) startItem = idx;
				let c = idx - startItem;
				let i, j, k = 0;

				i = c % n;
				j = (c - c % n) / n;
				if (j > 2) {
					k = (j - j % n) / n;
					j = j % n;
				}

				child.position.x = (i - (n / 2)) * BOX_GAP;
				child.position.y = (j - (n / 2)) * BOX_GAP;
				child.position.z = (k - (n / 2)) * BOX_GAP;
			}
		});

		render();
	}

	const onContainerMouseMove = (e) => {
		if (isMouseDown) {
      theta = - ((e.clientX - X) * 0.5) + onMouseDownTheta;
      phi = ((e.clientY - Y) * 0.5) + onMouseDownPhi;
      phi = Math.min(180, Math.max(0, phi));
      setCamera();
    }

    render();
	}

	const onContainerMouseOut = (e) => {
		isMouseDown = false;
	}

	const onContainerMouseDown = (e) => {
		isMouseDown = true;
		X = e.pageX;
		Y = e.pageY;
		interact();
	}

	const onContainerMouseUp = (e) => {
		isMouseDown = false;
		onMouseDownTheta = theta;
    onMouseDownPhi = phi;

    if (e.clientY < 100) {
    	showToolBar(true);
    } else {
    	if (isIntersected) {
    		showToolBar(false);
    	}
    	isIntersected = false;
    }
	}

	const onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	const onDocumentMouseMove = (e) => {
		mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

		if (e.clientY < 60) showToolBar(true);
	}

	const onMouseWheelHandler = (e) => {
		var d = typeof e.wheelDelta != "undefined"? -e.wheelDelta: e.detail;
    d = 100 * ((d > 0)? 1: -1);
    var cPos = camera.position;

    if (isNaN(cPos.x) || isNaN(cPos.y) || isNaN(cPos.y)) return;

    // Your zomm limitation
    // For X axe you can add anothers limits for Y / Z axes
    if (zoomFactor < ZOOM_MIN) {
    	zoomFactor = ZOOM_MIN;
    } else if(zoomFactor > ZOOM_MAX ) {
    	zoomFactor = ZOOM_MAX;
    }

	  let mb = d > 0? 1.1: 0.9;
	  zoomFactor = zoomFactor * mb;
	  setCamera();
	  render();
	}

	const showToolBar = (b) => {
		if (b) {
			let cn = toolBar.className;
			const idx = cn.indexOf('active');
			if (idx == -1) {
				toolBar.className += ' active';
			}
		} else {
			toolBarTimer = setTimeout(function() {
				toolBar.className = toolBar.className.replace(/ active/g, '');
			}, 3000);
		}
	}

	const setCamera = () => {
		camera.position.x = radius * Math.sin( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 ) * zoomFactor;
    camera.position.y = radius * Math.sin( phi * Math.PI / 360 ) * zoomFactor;
    camera.position.z = radius * Math.cos( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 ) * zoomFactor;

		camera.updateMatrixWorld();
	}

	const interact = () => {
		camera.lookAt(scene.position);
		camera.updateMatrixWorld();
		// find intersections
		raycaster.setFromCamera(mouse, camera );
		var intersects = raycaster.intersectObjects(scene.children);

		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].object) {
				isIntersected = true;
				INTERSECTED = intersects[0].object;
				showToolBar(true);
			}
		} else {
			INTERSECTED = null;
		}
	}

	const render = () => {
		camera.lookAt(scene.position);
		camera.updateMatrixWorld();

		renderer.render(scene, camera);
	}

	getItems();
	listeners();

	init();
	setCamera();
	render();
});