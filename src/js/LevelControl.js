
import * as THREE from 'three';

import Assets from './Assets.js';
import Input from './Input.js';
import GameControl from './GameControl.js';

import Scene from './core/Scene.js';

import params from '../data/params.js';

//

const worldGroup = new THREE.Group();
Scene.add( worldGroup );

let player, endDoor, levelID, familyID, hasWon;

const clock = new THREE.Clock();

const playerVelocity = new THREE.Vector3();

const TARGET_STEP_DURATION = ( 1 / 60 ) / params.SIMULATION_STEPS_PER_FRAME;

//

function initLevel( lvlID, fmID, world, ghosts ) {

	// console.log( world )

	levelID = lvlID;
	familyID = fmID;
	hasWon = false;

	player = {
		pos: new THREE.Vector3(),
		mesh: Assets.player
	};

	// put player in front of the right door

	player.pos.copy( world.doors.perID[ levelID ].in.position );

	// create end door

	endDoor = {
		position: world.doors.perID[ levelID ].out.position,
		radius: params.DOOR_WIDTH / 2
	};

	endDoor.position.z = 0;

	//

	updatePlayerMesh();

	Scene.add( player.mesh );

}

//

function gameLoop() {

	if ( hasWon ) return

	const speedRatio = clock.getDelta() / TARGET_STEP_DURATION;

	// move player

	if ( player ) {

		const targetVelY = ( Input.keys.top ? params.PLAYER_SPEED : 0 ) - ( Input.keys.bottom ? params.PLAYER_SPEED : 0 );
		const targetVelX = ( Input.keys.right ? params.PLAYER_SPEED : 0 ) - ( Input.keys.left ? params.PLAYER_SPEED : 0 );

		playerVelocity.x += ( targetVelX - playerVelocity.x ) * 0.07;
		playerVelocity.y += ( targetVelY - playerVelocity.y ) * 0.07;

		player.pos.add( playerVelocity );

		updatePlayerMesh();

	}

	// test if player is on end door

	if (
		endDoor &&
		player.pos.distanceTo( endDoor.position ) < ( params.PLAYER_RADIUS + endDoor.radius )
	) {
		hasWon = true;
		GameControl.winLevel( levelID, familyID )
	}

}

setInterval( gameLoop, TARGET_STEP_DURATION );

//

function updatePlayerMesh() {

	if ( player ) player.mesh.position.copy( player.pos );

};

//

function cleanup() {

	console.log('cleanup level')

};

//

export default {
	initLevel,
	cleanup
}