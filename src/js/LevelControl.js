
import * as THREE from 'three';

import Assets from './Assets.js';
import Scene from './core/Scene.js';
import params from '../data/params.js';

//

const worldGroup = new THREE.Group();
Scene.add( worldGroup );

//

function initLevel( levelID, familyID, world, ghosts ) {

	world.forEach( (row, rowID) => {

		row.forEach( (tile, tileID) => {

			// console.log( tile.type )

			const geometry = new THREE.PlaneBufferGeometry(
				params.TILE_WIDTH,
				params.TILE_WIDTH
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

}

//

export default {
	initLevel
}