
import * as THREE from 'three';
import params from '../data/params.js';

//

const player = new THREE.Mesh(
	new THREE.SphereBufferGeometry( params.PLAYER_RADIUS ),
	new THREE.MeshNormalMaterial()
);

//

function Ghost() {

	const mesh = new THREE.Mesh(
		new THREE.SphereBufferGeometry( params.PLAYER_RADIUS ),
		new THREE.MeshBasicMaterial({ color: 0xff0000 })
	);

	return mesh

}

//

export default {
	player,
	Ghost
}