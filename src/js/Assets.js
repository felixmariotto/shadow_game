
import * as THREE from 'three';
import params from '../data/params.js';

//

const player = new THREE.Mesh(
	new THREE.SphereBufferGeometry( params.PLAYER_RADIUS ),
	new THREE.MeshNormalMaterial()
)

//

export default {
	player
}