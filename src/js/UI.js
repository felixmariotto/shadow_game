
import GameControl from './GameControl.js';

//

const domStartBtn = document.querySelector('#start-button');
const domHomeScreen = document.querySelector('#home-screen');
const domGameUI = document.querySelector('#game-ui');
const domLevelBtns = document.querySelectorAll('.level-btn');
const domLevelMenu = document.querySelector('#level-menu');

const firstLevelsButtons = [];
const secondLevelsButtons = [];

// start new game on click home screen button

domStartBtn.addEventListener('click', () => {

	GameControl.startNewGame();

});

// add level buttons to arrays and sort those arrays

domLevelBtns.forEach( (button) => {

	if ( button.id.indexOf('-') === -1 ) {

		firstLevelsButtons.push( button );

	} else {

		secondLevelsButtons.push( button );

	}

});

firstLevelsButtons.sort( sortButtons );
secondLevelsButtons.sort( sortButtons );

function sortButtons( a, b ) {
	if ( Number( a.id[0] ) > Number( b.id[0] ) ) return 1
	else return -1
};

// add event listener on buttons to start levels on click

firstLevelsButtons.forEach( (button, i) => {

	button.addEventListener( 'click', () => {

		GameControl.startLevel( i, 0 );

	});

});

secondLevelsButtons.forEach( (button, i) => {

	button.addEventListener( 'click', () => {

		GameControl.startLevel( i, 1 );

	});

});

// hide home screen. called by GameControl on game start

function hideHomeScreen() {

	domHomeScreen.style.display = 'none';

}

// hide level menu. called by GameControl

function hideLevelMenu() {

	domLevelMenu.style.display = 'none';

}

//

export default {
	hideHomeScreen,
	hideLevelMenu
}