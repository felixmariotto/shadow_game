
import * as THREE from 'three';

import Scene from './Scene.js';
import Camera from './Camera.js';

//

const CANVAS = document.querySelector('#game-canvas');

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: CANVAS
});

renderer.setSize( CANVAS.scrollWidth, CANVAS.scrollHeight );

renderer.shadowMap.enabled = true;

// renderer.outputEncoding = THREE.sRGBEncoding;

//

function render() {

	renderer.render(
		Scene.threeScene,
		Camera.threeCamera
	);

}

//

function updateSize() {

	/*
	renderer.setSize(
		window.innerWidth,
		window.innerHeight
	);
	*/

}

//

export default {
	threeRenderer: renderer,
	render,
	updateSize
}
