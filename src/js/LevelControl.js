
import * as THREE from 'three';

import Assets from './Assets.js';
import Input from './Input.js';

import Scene from './core/Scene.js';

import params from '../data/params.js';

//

const worldGroup = new THREE.Group();
Scene.add( worldGroup );

let player;

//

function initLevel( levelID, familyID, world, ghosts ) {

	player = {
		pos: new THREE.Vector3(),
		mesh: Assets.player
	};

	player.mesh.position.copy( player.pos );

	Scene.add( player.mesh );

}

//

const clock = new THREE.Clock();

function gameLoop() {

	const deltaTime = clock.getDelta();

	// move player

	if ( player ) {

		if ( Input.keys.top ) player.pos.y += params.PLAYER_SPEED;
		if ( Input.keys.bottom ) player.pos.y -= params.PLAYER_SPEED;
		if ( Input.keys.right ) player.pos.x += params.PLAYER_SPEED;
		if ( Input.keys.left ) player.pos.x -= params.PLAYER_SPEED;

		player.mesh.position.copy( player.pos );

	}

}

setInterval( gameLoop, ( 1 / 60 ) / params.SIMULATION_STEPS_PER_FRAME );

//

export default {
	initLevel
}