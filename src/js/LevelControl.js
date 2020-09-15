
import * as THREE from 'three';

import Assets from './Assets.js';
import Input from './Input.js';
import GameControl from './GameControl.js';

import Scene from './core/Scene.js';

import params from '../data/params.js';

//

const testBox = new THREE.Box3();
const testSphere = new THREE.Sphere();
testSphere.radius = params.PLAYER_RADIUS;

const vec = new THREE.Vector3();
const vec2 = new THREE.Vector3();

const worldGroup = new THREE.Group();
Scene.add( worldGroup );

let player, tiles, ghosts, endDoor, levelID, familyID, gameIsDone, ghostSampleTime, ghostSamples;
let startTime, elapsedTime = 0;

const clock = new THREE.Clock();

const playerVelocity = new THREE.Vector3();

const TARGET_STEP_DURATION = ( 1 / 60 ) / params.SIMULATION_STEPS_PER_FRAME;

//

function initLevel( lvlID, fmID, world, recordedGhosts ) {

	// init variables

	levelID = lvlID;
	familyID = fmID;
	gameIsDone = false;
	ghostSampleTime = 0;
	ghostSamples = [];
	ghosts = [];
	startTime = 0;
	elapsedTime = 0;
	tiles = world.tiles;

	// reset doors materials

	world.doors.perID.forEach( (door) => {

		door.out.mesh.material = params.DOOR_MAT;

	});

	// create ghosts ( if any )

	recordedGhosts.forEach( (family, familyID) => {

		family.forEach( (ghostTrack, trackID) => {

			// skip ghost of existing level
			if ( familyID === fmID && trackID === lvlID ) return

			const ghost = {
				pos: new THREE.Vector3( 0, 0, 0.5 ),
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

	world.doors.perID[ levelID ].out.mesh.material = params.TARGET_DOOR_MAT;

	//

	updatePlayerMesh();

	Scene.add( player.mesh );

}

//

function gameLoop() {

	const deltaTime = clock.getDelta();

	if ( gameIsDone ) return

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

			// no-step tiles

			tiles.forEach( (tilesRow) => {

				tilesRow.forEach( (tile) => {
 
					if ( tile.type === 1 ) {

						const tilePos = {
							x: tile.id * params.TILE_WIDTH - ( params.WORLD_WIDTH * params.TILE_WIDTH / 2 ) + ( params.TILE_WIDTH / 2 ),
							y: tile.row * params.TILE_WIDTH - ( params.WORLD_WIDTH * params.TILE_WIDTH / 2 ) + ( params.TILE_WIDTH / 2 )
						};

						const min = {
							x: tilePos.x - ( params.TILE_WIDTH / 2 ),
							y: tilePos.y - ( params.TILE_WIDTH / 2 )
						};

						const max = {
							x: tilePos.x + ( params.TILE_WIDTH / 2 ),
							y: tilePos.y + ( params.TILE_WIDTH / 2 )
						};

						testBox.min.x = min.x;
						testBox.min.y = min.y;
						testBox.min.z = 0;
						testBox.max.x = max.x;
						testBox.max.y = max.y;
						testBox.max.z = 1;

						testSphere.center.copy( player.pos );

						if ( testBox.intersectsSphere( testSphere ) ) {

							// player.pos.sub( playerVelocity );

							// compute how axis-aligned the two objects are.

							const xDif = Math.abs( player.pos.x - tilePos.x ) / ( params.TILE_WIDTH / 2 + params.PLAYER_RADIUS ) ;
							const yDif = Math.abs( player.pos.y - tilePos.y ) / ( params.TILE_WIDTH / 2 + params.PLAYER_RADIUS ) ;

							// at 0, the player is at the closest of the box center.
							// at 1, they are at the farthest.
							const angleRatio = xDif * yDif;

							// copy box position in 'vec'
							testBox.getCenter( vec );

							// get diff vector between player and box center
							vec2.copy( player.pos ).sub( vec );

							// normalize diff vector, and multiply to right value
							vec2.normalize().multiplyScalar( ( params.TILE_WIDTH / 2 + params.PLAYER_RADIUS ) + ( params.TILE_WIDTH * 0.4 * ( angleRatio * angleRatio ) ) );

							// copy to player position
							player.pos.copy( vec ).add( vec2 );

						}

						// console.log( min, max )
						// debugger	

					}

				})

			})

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
		player && endDoor &&
		player.pos.distanceTo( endDoor.position ) < ( params.PLAYER_RADIUS + endDoor.radius )
	) {

		gameIsDone = true;

		ghostSamples.push({
			x: player.pos.x,
			y: player.pos.y,
			time: elapsedTime
		})

		GameControl.winLevel( levelID, familyID, ghostSamples );

	}

	// test if player collides a ghost

	if ( player ) {

		ghosts.forEach( (ghost) => {

			if ( ghost.pos.distanceTo( player.pos ) < params.PLAYER_RADIUS * 1.9 ) {

				gameIsDone = true;

				GameControl.failLevel();

			}

		})

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

	player = undefined;

	ghosts.forEach( (ghost) => {

		ghost.mesh.geometry.dispose();
		ghost.mesh.material.dispose();

		Scene.remove( ghost.mesh )

	});

};

//

export default {
	initLevel,
	cleanup
}