
import * as THREE from 'three';

import Assets from './Assets.js';
import Scene from './core/Scene.js';
import params from '../data/params.js';

//

const worldGroup = new THREE.Group();
Scene.add( worldGroup );

//

function initLevel( levelID, familyID, world, ghosts ) {

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

export default {
	initLevel
}