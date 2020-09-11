
const keys = {
	top: false,
	right: false,
	bottom: false,
	left: false
};

//

addEventListener( 'keydown', (e) => {

	switch ( e.code ) {

	case 'KeyA' :
	case 'ArrowLeft' :
		keys.left = true;
		break

	case 'KeyD' :
	case 'ArrowRight' :
		keys.right = true;
		break

	case 'KeyW' :
	case 'ArrowUp' :
		keys.top = true;
		break

	case 'KeyS' :
	case 'ArrowDown' :
		keys.bottom = true;
		break

	}

})

//

addEventListener( 'keyup', (e) => {

	switch ( e.code ) {

	case 'KeyA' :
	case 'ArrowLeft' :
		keys.left = false;
		break

	case 'KeyD' :
	case 'ArrowRight' :
		keys.right = false;
		break

	case 'KeyW' :
	case 'ArrowUp' :
		keys.top = false;
		break

	case 'KeyS' :
	case 'ArrowDown' :
		keys.bottom = false;
		break

	}

})

//

export default {
	keys
}