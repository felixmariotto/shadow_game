
import * as THREE from 'three';
import params from '../data/params.js';

//

const player = new THREE.Mesh(
	new THREE.SphereBufferGeometry( params.PLAYER_RADIUS ),
	new THREE.MeshLambertMaterial()
);

player.castShadow = true;
player.receiveShadow = true;

//

function setPlayerStyle( levelID ) {

	player.material.color.set( params.LEVELS_COLORS[ levelID ] );

};

//

function Ghost( id ) {

	const mesh = new THREE.Mesh(
		new THREE.SphereBufferGeometry( params.PLAYER_RADIUS ),
		new THREE.MeshBasicMaterial({
			color: params.LEVELS_COLORS[ id ],
			transparent: true,
			opacity: 0.8
		})
	);

	return mesh

}

//

function BlackGhost() {

	const mesh = new THREE.Mesh(
		new THREE.SphereBufferGeometry( params.PLAYER_RADIUS ),
		new THREE.MeshBasicMaterial({ color: 0x000000 })
	);

	return mesh

}

//

export default {
	player,
	setPlayerStyle,
	Ghost,
	BlackGhost
}