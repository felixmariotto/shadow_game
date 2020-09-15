
import * as THREE from 'three';

import Scene from './core/Scene.js';

import UI from './UI.js';
import LevelControl from './LevelControl.js';

import params from '../data/params.js';

//

let lastLevelAvailable, areShadowLevelsAvailable, ghosts, world;

//

function startNewGame() {

	lastLevelAvailable = 0;
	areShadowLevelsAvailable = false;

	// array in which are stored all the recorded player tracks
	ghosts = [[],[]];

	// object in which is stored the grid information persistant accross all levels
	world = NewWorld();
	// create world meshes
	createWorld( world );

	UI.hideHomeScreen();

}

//

function startLevel( levelID, levelFamily ) {

	// console.log('start level ' + levelID + ' of family ' + levelFamily )

	LevelControl.initLevel( levelID, levelFamily, world, ghosts );

	// update UI

	UI.hideLevelMenu();
	UI.hideMessage();

}

//

function winLevel( levelID, familyID, ghostSamples ) {

	// record ghost

	ghosts[ familyID ][ levelID ] = ghostSamples.slice(0);

	// upgrade last level available

	if (
		levelID === lastLevelAvailable &&
		( familyID === 0 || areShadowLevelsAvailable )
	) {

		lastLevelAvailable ++

		if ( lastLevelAvailable > params.LEVELS_PER_FAMILY - 1 ) {

			areShadowLevelsAvailable = true;

			lastLevelAvailable = 0;

		}

		UI.unlockLevelButton(
			lastLevelAvailable,
			areShadowLevelsAvailable ? 1 : 0
		)

	}

	// update user interface ( win message etc.. )

	UI.showMessage("you finished this level !");

	setTimeout( () => {

		UI.showLevelMenu();

		LevelControl.cleanup();

	}, 1000 );

}

//

function failLevel() {

	UI.showMessage("level failed... try again");

	setTimeout( () => {

		UI.showLevelMenu();

		LevelControl.cleanup();

	}, 1000 );

}

//

function NewWorld() {

	const world = {
		tiles: [],
		doors: {
			top: [],
			right: [],
			bottom: [],
			left: [],
			perID: []
		}
	};

	// create tiles

	for ( let rowID=0 ; rowID<params.WORLD_WIDTH ; rowID++ ) {

		world.tiles.push( [] );

		for ( let tileID=0 ; tileID<params.WORLD_WIDTH ; tileID++ ) {

			let type = params.WORLD_TILES[ rowID ][ tileID ];

			if ( type === 2 ) type = Math.floor( Math.random() * 2 );

			const newTile = {
				row: rowID,
				id: tileID,
				type: type
			}

			world.tiles[ rowID ].push( newTile );
			
		}

	}

	// create doors

	const sides = [
		world.doors.top,
		world.doors.right,
		world.doors.bottom,
		world.doors.left
	];

	let counter = 0;

	for ( let doorsID=0 ; doorsID<params.LEVELS_PER_FAMILY ; doorsID++ ) {

		const doorOut = { type: 'out', id: doorsID };
		const doorIn = { type: 'in', id: doorsID };

		sides[ counter ].push( doorOut );
		sides[ (counter + 2) % 4 ].push( doorIn );

		counter = (counter + 1) % 4;

		world.doors.perID.push({
			out: doorOut,
			in: doorIn
		})

	}

	return world

}

//

function createWorld( world ) {

	// create tiles

	world.tiles.forEach( (row, rowID) => {

		row.forEach( (tile, tileID) => {

			let geometry;

			switch ( tile.type ) {

			case 0 :

				geometry = new THREE.PlaneBufferGeometry(
					params.TILE_WIDTH,
					params.TILE_WIDTH
				);

				geometry.translate(
					params.TILE_WIDTH / 2,
					params.TILE_WIDTH / 2,
					0
				);

				break

			case 1 :

				geometry = new THREE.BoxBufferGeometry(
					params.TILE_WIDTH,
					params.TILE_WIDTH,
					1
				);

				geometry.translate(
					params.TILE_WIDTH / 2,
					params.TILE_WIDTH / 2,
					0.5
				);

				break

			}

			const tileMesh = new THREE.Mesh(
				geometry,
				params.TILES_MAT[ tile.type ]
			)

			tileMesh.position.y = (rowID * params.TILE_WIDTH) - ((params.WORLD_WIDTH * params.TILE_WIDTH) / 2);
			tileMesh.position.x = (tileID * params.TILE_WIDTH) - ((params.WORLD_WIDTH * params.TILE_WIDTH) / 2);

			tileMesh.receiveShadow = true;

			Scene.add( tileMesh );

		})

	})

	// create walls

	function Wall() {
		const geom = new THREE.PlaneBufferGeometry( params.TILE_WIDTH, params.WORLD_WIDTH * params.TILE_WIDTH );
		geom.rotateY( Math.PI / 2 );
		geom.translate( 0, 0, params.TILE_WIDTH / 2 );
		const mesh = new THREE.Mesh( geom, params.WALLS_MAT );
		return mesh
	}

	const topWall = Wall();
	topWall.rotation.z = Math.PI / 2;
	topWall.position.y += params.WORLD_WIDTH / 2;

	const bottomWall = Wall();
	bottomWall.rotation.z = Math.PI / 2;
	bottomWall.position.y -= params.WORLD_WIDTH / 2;

	const leftWall = Wall();
	leftWall.position.x -= params.WORLD_WIDTH / 2;

	const rightWall = Wall();
	rightWall.position.x += params.WORLD_WIDTH / 2;

	Scene.add( topWall, bottomWall, leftWall, rightWall );

	// create doors

	for ( let sideName of Object.keys( world.doors ) ) {

		if ( sideName === "perID" ) return

		const side = world.doors[ sideName ];

		// create side group

		const sideGroup = new THREE.Group();

		Scene.add( sideGroup );

		// position group

		sideGroup.position.z += params.TILE_WIDTH / 2;

		switch ( sideName ) {

		case 'top' :
			sideGroup.position.y += ( params.WORLD_WIDTH / 2 ) - 0.03;
			break

		case 'bottom' :
			sideGroup.position.y -= ( params.WORLD_WIDTH / 2 ) - 0.03;
			break

		case 'left' :
			sideGroup.position.x -= ( params.WORLD_WIDTH / 2 ) - 0.03;
			break

		case 'right' :
			sideGroup.position.x += ( params.WORLD_WIDTH / 2 ) - 0.03;
			break

		}

		// create doors and put it in side groups

		side.forEach( (door, i) => {

			const geometry = new THREE.PlaneBufferGeometry(
				params.DOOR_WIDTH,
				params.TILE_WIDTH
			);

			geometry.rotateX( -Math.PI / 2 );

			if ( sideName == 'left' || sideName == 'right' ) {
				geometry.rotateZ( -Math.PI / 2 );
			}

			const doorMesh = new THREE.Mesh( geometry, params.DOOR_MAT );

			// translate door

			if ( sideName == 'left' || sideName == 'right' ) {

				doorMesh.position.y = i * ( ( params.WORLD_WIDTH - 1.5 ) / side.length);
				doorMesh.position.y -= ( params.WORLD_WIDTH - 1.5 ) / 2;
				doorMesh.position.y += ( (params.WORLD_WIDTH - 1.5 ) / side.length) / 2;

			} else {

				doorMesh.position.x = i * (params.WORLD_WIDTH / side.length);
				doorMesh.position.x -= params.WORLD_WIDTH / 2;
				doorMesh.position.x += (params.WORLD_WIDTH / side.length) / 2;

			}

			//

			door.position = new THREE.Vector3().copy( doorMesh.position );
			door.position.add( sideGroup.position );

			door.mesh = doorMesh;

			//

			sideGroup.add( doorMesh );

		})

	}

}

//

export default {
	startNewGame,
	startLevel,
	winLevel,
	failLevel
}