
import * as THREE from 'three';

import Assets from './Assets.js';
import Input from './Input.js';

import Scene from './core/Scene.js';

import params from '../data/params.js';

//

const worldGroup = new THREE.Group();
Scene.add( worldGroup );

let player;

const clock = new THREE.Clock();

const playerVelocity = new THREE.Vector3();

const TARGET_STEP_DURATION = ( 1 / 60 ) / params.SIMULATION_STEPS_PER_FRAME;

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

function gameLoop() {

	const speedRatio = clock.getDelta() / TARGET_STEP_DURATION;

	// move player

	if ( player ) {

		const targetVelY = ( Input.keys.top ? params.PLAYER_SPEED : 0 ) - ( Input.keys.bottom ? params.PLAYER_SPEED : 0 );
		const targetVelX = ( Input.keys.right ? params.PLAYER_SPEED : 0 ) - ( Input.keys.left ? params.PLAYER_SPEED : 0 );

		/*
		if ( Input.keys.top ) player.pos.y += params.PLAYER_SPEED;
		if ( Input.keys.bottom ) player.pos.y -= params.PLAYER_SPEED;
		if ( Input.keys.right ) player.pos.x += params.PLAYER_SPEED;
		if ( Input.keys.left ) player.pos.x -= params.PLAYER_SPEED;
		*/

		playerVelocity.x += ( targetVelX - playerVelocity.x ) * 0.07;
		playerVelocity.y += ( targetVelY - playerVelocity.y ) * 0.07;

		player.mesh.position.add( playerVelocity );

	}

}

setInterval( gameLoop, TARGET_STEP_DURATION );

//

export default {
	initLevel
}