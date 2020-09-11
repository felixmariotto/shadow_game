
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
	ghosts = [];

	// object in which is stored the grid information persistant accross all levels
	world = NewWorld();

	// create world meshes
	createWorld( world );

	UI.hideHomeScreen();

}

//

function startLevel( levelID, levelFamily ) {

	// console.log('start level ' + levelID + ' of family ' + levelFamily )

	LevelControl.initLevel( ghosts );

	// update UI

	UI.hideLevelMenu();
	UI.hideWinMessage();

}

//

function winLevel( levelID, levelFamily ) {

	// upgrade last level available

	if (
		levelID === lastLevelAvailable &&
		( levelFamily === 0 || areShadowLevelsAvailable )
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

	UI.showWinMessage();

	setTimeout( () => {

		UI.showLevelMenu();

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
			left: []
		}
	};

	// create tiles

	for ( let rowID=0 ; rowID<params.WORLD_WIDTH ; rowID++ ) {

		world.tiles.push( [] );

		for ( let tileID=0 ; tileID<params.WORLD_WIDTH ; tileID++ ) {

			const newTile = {
				row: rowID,
				id: tileID,
				type: 0
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

	for ( let doorsID=0 ; doorsID<params.LEVELS_PER_FAMILY-1 ; doorsID++ ) {

		sides[ counter ].push({ type: 'out', id: doorsID })
		sides[ (counter + 1) % 4 ].push({ type: 'in', id: doorsID })

		counter = (counter + 1) % 4;

	}

	return world

}

//

function createWorld( world ) {

	// create tiles

	world.tiles.forEach( (row, rowID) => {

		row.forEach( (tile, tileID) => {

			// console.log( tile.type )

			const geometry = new THREE.PlaneBufferGeometry(
				params.TILE_WIDTH,
				params.TILE_WIDTH
			);

			geometry.translate(
				params.TILE_WIDTH / 2,
				params.TILE_WIDTH / 2,
				0
			);

			const tileMesh = new THREE.Mesh(
				geometry,
				new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() })
			)

			tileMesh.position.y = (rowID * params.TILE_WIDTH) - ((params.WORLD_WIDTH * params.TILE_WIDTH) / 2);
			tileMesh.position.x = (tileID * params.TILE_WIDTH) - ((params.WORLD_WIDTH * params.TILE_WIDTH) / 2);

			Scene.add( tileMesh );

		})

	})

	// create walls

	for ( let sideName of Object.keys( world.doors ) ) {

		const side = world.doors[ sideName ];

		const sideGroup = new THREE.Group();

		Scene.add( sideGroup );

		side.forEach( (door, i) => {

			const geometry = new THREE.PlaneBufferGeometry(
				params.TILE_WIDTH,
				params.TILE_WIDTH
			);

			geometry.rotateX( -Math.PI / 2 );

			if ( sideName == 'left' || sideName == 'right' ) {
				geometry.rotateZ( -Math.PI / 2 );
			}

			const material = new THREE.MeshBasicMaterial({
				color: 0xffffff * Math.random(),
				side: THREE.DoubleSide
			});

			const doorMesh = new THREE.Mesh( geometry, material );

			// translate door

			if ( sideName == 'left' || sideName == 'right' ) {

				doorMesh.position.y = i * (params.WORLD_WIDTH / side.length);
				doorMesh.position.y -= params.WORLD_WIDTH / 2;
				doorMesh.position.y += (params.WORLD_WIDTH / side.length) / 2;

			} else {

				doorMesh.position.x = i * (params.WORLD_WIDTH / side.length);
				doorMesh.position.x -= params.WORLD_WIDTH / 2;
				doorMesh.position.x += (params.WORLD_WIDTH / side.length) / 2;

			}

			//

			sideGroup.add( doorMesh );

		})

		// position group

		sideGroup.position.z += params.TILE_WIDTH / 2;

		switch ( sideName ) {

		case 'top' :
			sideGroup.position.y += params.WORLD_WIDTH / 2;
			break

		case 'bottom' :
			sideGroup.position.y -= params.WORLD_WIDTH / 2;
			break

		case 'left' :
			sideGroup.position.x -= params.WORLD_WIDTH / 2;
			break

		case 'right' :
			sideGroup.position.x += params.WORLD_WIDTH / 2;
			break

		}

	}

}

//

export { winLevel }
export default {
	startNewGame,
	startLevel
}