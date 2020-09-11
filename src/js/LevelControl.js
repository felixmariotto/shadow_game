
import * as THREE from 'three';

import Assets from './Assets.js';
import Input from './Input.js';
import GameControl from './GameControl.js';

import Scene from './core/Scene.js';

import params from '../data/params.js';

//

const worldGroup = new THREE.Group();
Scene.add( worldGroup );

let player, ghosts, endDoor, levelID, familyID, hasWon, ghostSampleTime, ghostSamples;
let startTime, elapsedTime = 0;

const clock = new THREE.Clock();

const playerVelocity = new THREE.Vector3();

const TARGET_STEP_DURATION = ( 1 / 60 ) / params.SIMULATION_STEPS_PER_FRAME;

//

function initLevel( lvlID, fmID, world, recordedGhosts ) {

	// init variables

	levelID = lvlID;
	familyID = fmID;
	hasWon = false;
	ghostSampleTime = 0;
	ghostSamples = [];
	ghosts = [];
	startTime, elapsedTime = 0;

	// create ghosts ( if any )

	recordedGhosts.forEach( (family) => {

		family.forEach( (ghostTrack) => {

			const ghost = {
				pos: new THREE.Vector3(),
				mesh: Assets.Ghost(),
				track: ghostTrack,
				duration: ghostTrack[ ghostTrack.length - 1 ].time
			};

			ghosts.push( ghost );

			Scene.add( ghost.mesh );

		})

	})

	// create player

	player = {
		pos: new THREE.Vector3(),
		mesh: Assets.player
	};

	// put player in front of the right door

	player.pos.copy( world.doors.perID[ levelID ].in.position );

	ghostSamples.push({
		x: player.pos.x,
		y: player.pos.y,
		time: elapsedTime
	})

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

	const deltaTime = clock.getDelta();

	const speedRatio = deltaTime / TARGET_STEP_DURATION;

	ghostSampleTime += deltaTime * 1000;

	elapsedTime += deltaTime * 1000;

	// move player

	if ( player ) {

		// update player velocity

		const targetVelY = ( Input.keys.top ? params.PLAYER_SPEED : 0 ) - ( Input.keys.bottom ? params.PLAYER_SPEED : 0 );
		const targetVelX = ( Input.keys.right ? params.PLAYER_SPEED : 0 ) - ( Input.keys.left ? params.PLAYER_SPEED : 0 );

		playerVelocity.x += ( targetVelX - playerVelocity.x ) * 0.07;
		playerVelocity.y += ( targetVelY - playerVelocity.y ) * 0.07;

		// move player

		player.pos.add( playerVelocity );

		// apply constraints

			// external walls

			const limit = ( params.WORLD_WIDTH / 2 ) - params.PLAYER_RADIUS;

			if ( player.pos.x > limit ) player.pos.x = limit;
			if ( player.pos.x < -limit ) player.pos.x = -limit;

			if ( player.pos.y > limit ) player.pos.y = limit;
			if ( player.pos.y < -limit ) player.pos.y = -limit;


		// update player mesh

		updatePlayerMesh();

	}

	// move ghosts

	if ( ghosts ) {

		ghosts.forEach( (ghost) => {

			const targetTime = elapsedTime % ghost.duration;

			const currentPosIdx = ghost.track.findIndex( sample => sample.time >= targetTime );

			const startSample = ghost.track[ currentPosIdx - 1 ];
			const endSample = ghost.track[ currentPosIdx ];

			const t = ( targetTime - startSample.time ) / ( endSample.time - startSample.time );

			ghost.pos.x = THREE.MathUtils.lerp( startSample.x, endSample.x, t );
			ghost.pos.y = THREE.MathUtils.lerp( startSample.y, endSample.y, t );

			ghost.mesh.position.copy( ghost.pos );

		})

	}

	// test if player is on end door

	if (
		endDoor &&
		player.pos.distanceTo( endDoor.position ) < ( params.PLAYER_RADIUS + endDoor.radius )
	) {

		hasWon = true;

		ghostSamples.push({
			x: player.pos.x,
			y: player.pos.y,
			time: elapsedTime
		})

		GameControl.winLevel( levelID, familyID, ghostSamples );

	}

	// sample player moves for later ghost

	if ( player ) {

		if ( ghostSampleTime > params.TIME_STEP_GHOST_SAMPLE ) {

			ghostSampleTime = 0;

			ghostSamples.push({
				x: player.pos.x,
				y: player.pos.y,
				time: elapsedTime
			})

		}

	}

}

setInterval( gameLoop, TARGET_STEP_DURATION );

//

function updatePlayerMesh() {

	if ( player ) player.mesh.position.copy( player.pos );

};

//

function cleanup() {

	ghosts = player = undefined;

};

//

export default {
	initLevel,
	cleanup
}