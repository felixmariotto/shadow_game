
/* Import everything we need from Three.js */

import * as THREE from 'three';

import Scene from './js/core/Scene.js';
import Camera from './js/core/Camera.js';
import Renderer from './js/core/Renderer.js';
import Light from './js/core/Light.js';
import Loop from './js/core/Loop.js';

import UI from './js/UI.js';

//

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
	Camera.updateAspect();
	Renderer.updateSize();
}

//

Loop.init();
