
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

	UI.hideHomeScreen();

}

//

function startLevel( levelID, levelFamily ) {

	// console.log('start level ' + levelID + ' of family ' + levelFamily )

	LevelControl.initLevel( levelID, levelFamily, world, ghosts );

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

export { winLevel }
export default {
	startNewGame,
	startLevel
}