
import UI from './UI.js';

//

function startNewGame() {

	UI.hideHomeScreen();

}

//

function startLevel( levelID, levelFamily ) {

	console.log('start level ' + levelID + ' of family ' + levelFamily )

	UI.hideLevelMenu();

}

//

export default {
	startNewGame,
	startLevel
}