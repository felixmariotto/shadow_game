
import * as THREE from 'three';

//

const params = {
	LEVELS_PER_FAMILY: 10,
	PLAYER_RADIUS: 0.4,
	WORLD_WIDTH: 7,
	TILE_WIDTH: 1,
	DOOR_WIDTH: 1,
	SIMULATION_STEPS_PER_FRAME: 3,
	TIME_STEP_GHOST_SAMPLE: 100, // in ms
	PLAYER_SPEED: 0.01,
	TILES_MAT: [
		new THREE.MeshBasicMaterial({ color: 0xff00ff })
	],
	DOOR_MAT: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
	TARGET_DOOR_MAT: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
}

//

setInterval( () => {

	params.TARGET_DOOR_MAT.color.setRGB(
		0,
		( Math.sin( Date.now() / 100 ) + 1 ) / 2,
		( Math.sin( Date.now() / 100 ) + 1 ) / 2
	)

}, 20 );

//

export default params