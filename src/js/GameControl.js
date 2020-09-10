
import UI from './UI.js';

import params from '../data/params.js';

//

let lastLevelAvailable = 0;
let areShadowLevelsAvailable = false;

//

function startNewGame() {

	UI.hideHomeScreen();

}

//

function startLevel( levelID, levelFamily ) {

	console.log('start level ' + levelID + ' of family ' + levelFamily )

	UI.hideLevelMenu();
	UI.hideWinMessage();

	setTimeout( () => {

		winLevel( levelID, levelFamily )

	}, 1000 );

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

export default {
	startNewGame,
	startLevel
}