
import GameControl from './GameControl.js';
import params from '../data/params.js';

//

const domStartBtn = document.querySelector('#start-button');
const domHomeScreen = document.querySelector('#home-screen');
const domGameUI = document.querySelector('#game-ui');
const domLevelBtns = document.querySelectorAll('.level-btn');
const domLevelMenu = document.querySelector('#level-menu');
const domWinMessage = document.querySelector('#win-message');
const domFirstLevels = document.querySelector('#first-levels');
const domSecondLevels = document.querySelector('#second-levels');

const firstLevelsButtons = [];
const secondLevelsButtons = [];

// start new game on click home screen button

domStartBtn.addEventListener('click', () => {

	GameControl.startNewGame();

});






/*

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

*/


for ( let i=0 ; i<params.LEVELS_PER_FAMILY ; i++ ) {

	const domFirstBtn = document.createElement('DIV');
	domFirstBtn.innerHTML = i + 1;
	domFirstBtn.classList.add('level-btn', String(i+1) );

	domFirstLevels.append( domFirstBtn );

	firstLevelsButtons.push( domFirstBtn );

	//

	const domSecondBtn = document.createElement('DIV');
	domSecondBtn.innerHTML = i + 1;
	domSecondBtn.classList.add('level-btn', i+1 + '-2' );

	domSecondLevels.append( domSecondBtn );

	secondLevelsButtons.push( domSecondBtn );

}




// add event listener on buttons to start levels on click
// + add them to the 'disabled' class but the first one

firstLevelsButtons.forEach( (button, i) => {

	if ( i ) button.classList.add('disabled');

	button.addEventListener( 'click', () => {

		GameControl.startLevel( i, 0 );

	});

});

secondLevelsButtons.forEach( (button, i) => {

	button.classList.add('disabled');

	button.addEventListener( 'click', () => {

		GameControl.startLevel( i, 1 );

	});

});

// show/hide home screen. called by GameControl

function hideHomeScreen() {

	domHomeScreen.style.display = 'none';

}

// show/hide level menu. called by GameControl

function hideLevelMenu() {

	domLevelMenu.style.display = 'none';

}

function showLevelMenu() {

	domLevelMenu.style.display = 'flex';

}

// show/hide win message. called by GameControl

function showWinMessage() {

	domWinMessage.style.display = 'inherit';

}

function hideWinMessage() {

	domWinMessage.style.display = 'none';

}

// unlock the next level button after the player finished a level

function unlockLevelButton( btnID, rowID ) {

	const btnArr = rowID ? secondLevelsButtons : firstLevelsButtons;

	btnArr[ btnID ].classList.remove( 'disabled' );

}

//

export default {
	hideHomeScreen,
	showLevelMenu,
	hideLevelMenu,
	showWinMessage,
	hideWinMessage,
	unlockLevelButton
}