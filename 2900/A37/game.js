/*
 game.js for Perlenspiel 3.3.xd
 Last revision: 2021-04-08 (BM)

 Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
 This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
 Perlenspiel is Copyright © 2009-21 Brian Moriarty.
 This file is part of the standard Perlenspiel 3.3.x devkit distribution.

 Perlenspiel is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published
 by the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Perlenspiel is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Lesser General Public License for more details.

 You may have received a copy of the GNU Lesser General Public License
 along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
 */

/*
 This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
 Add code to the event handlers required by your project.
 Any unused event-handling function templates can be safely deleted.
 Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
 */

/*
 The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
 You may find them useful if your development environment is configured to support JSHint.
 If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
 */

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

const G = ( function () {

	let _GRID_X = 0;
	let _GRID_Y = 0;
	const _GROUND_COLOR = 0x964B00;
	const _ACTOR_COLOR = 0x808080;
	const _EXIT_COLOR = 0xFF0000;
	const _BOOK_COLOR = PS.COLOR_WHITE;
	//const BOOKOrange_COLOR = 0xFF7F00;
	//const BOOKGreen_COLOR = 0x00FF00;
	//const BOOKLightBlue_COLOR = 0x00FFFF;
	//const BOOKDarkBlue_COLOR = 0x0000FF;
	//const BOOKPink_COLOR = 0xFF00FF;
	//const BOOKPurple_COLOR = 0x8000FF;
	//const BOOKDarkPink_COLOR = 0xFF007F;
	//let bookCount;

	const _WALL_COLOR = 0xF3E306;
	//const _EXIT_COLOR = PS.COLOR_RED;
	const _MAP_WALL = 0;
	const _MAP_GROUND = 1;
	const _MAP_EXIT = 2;
	const _MAP_BOOK = 3;
	//const BOOKGreen = 4;
	//const BOOKLightBlue = 5;
	//const BOOKDarkBlue = 6;
	//const BOOKPink = 7;
	//const BOOKPurple = 8;
	//const BOOKDarkPink = 9;
	//const _MAP_EXIT = 2;

	const MAP_PLANE = 0;
	const BOOK_PLANE = 1;
	const EXIT_PLANE = 2;
	const DARKNESS_PLANE = 4;
	const ACTOR_PLANE = 5;


	//const EXIT_COLOR = PS.COLOR_RED;
	//const EXIT_MARKER = "exit";

	const BOOK_MARKER = "book";
	let books_found = 0;
	const BOOK_COUNT = 66;

	let _actor_x = 1;
	let _actor_y = 14;
	let _actor_sprite = "";

	let mapdata;

	const _imagemap = {
		width : _GRID_X,
		height : _GRID_Y,
		pixelSize : 1,
		data : []
	};

	const _is_wall = function ( x, y ) {
		let data = _imagemap.data[ ( y * _GRID_X ) + x ];
		return ( data === _MAP_WALL );
	};



	//const _is_book = function ( x, y ) {
	//let data = _imagemap.data[ ( y * _GRID_X ) + x ];
	//return ( data === _MAP_BOOK );
	//};



	const _is_exit = function ( x, y ) {
		let data = _imagemap.data[ ( y * _GRID_X ) + x ];
		return ( data === _MAP_EXIT );
	};

	const ZONES = [
		[
			[ -1, -1 ], [ 0, -1 ], [ 1, -1 ],
			[ -1, 0 ], [ 1, 0 ],
			[ -1, 1 ], [ 0, 1 ], [ 1, 1 ]
		],
		[
			[ -2, -2 ], [ -1, -2 ], [ 0, -2 ], [ 1, -2 ], [ 2, -2 ],
			[ -2, -1 ], [ 2, -1 ],
			[ -2, 0 ], [ 2, 0 ],
			[ -2, 1 ], [ 2, 1 ],
			[ -2, 2 ], [ -1, 2 ], [ 0, 2 ], [ 1, 2 ], [ 2, 2 ]
		],
		[
			[ -1, -3 ], [ 0, -3 ], [ 1, -3 ],
			[ -3, -1 ], [ 3, -1 ],
			[ -3, 0 ], [ 3, 0 ],
			[ -3, 1 ], [ 3, 1 ],
			[ -1, 3 ], [ 0, 3 ], [ 1, 3 ]
		]
	];

	const book_find = function (x, y) {
		let oplane, zone2, len, i, offset, dx, dy, data;

		//let findings = [
		//"You found a shiny thing!",
		//"Another shiny thing!",
		//"Your third shiny thing.",
		//"Yet a fourth thing of shininess.",
		//"Five things that shine!",
		//"Six! So much shiny goodness.",
		//"Seven shall be the number of shinies."
		//];

		oplane = PS.gridPlane();

		PS.gridPlane( BOOK_PLANE );
		PS.alpha( x, y, PS.ALPHA_TRANSPARENT );
		PS.data( x, y, PS.DEFAULT );
		PS.audioPlay("fx_hoot");

		books_found += 1;

		if(books_found === 1){
			PS.statusText("Hello.");
		}

		if(books_found === 2){
			PS.statusText("Hello. Welcome");
		}

		if(books_found === 3){
			PS.statusText("Hello. Welcome to");
		}

		if(books_found === 4){
			PS.statusText("Hello. Welcome to the");
		}

		if(books_found === 5){
			PS.statusText("Hello. Welcome to the Library");
		}

		if(books_found === 6){
			PS.statusText("I");
		}

		if(books_found === 7){
			PS.statusText("I am");
		}

		if(books_found === 8){
			PS.statusText("I am the");
		}

		if(books_found === 9){
			PS.statusText("I am the overseer");
		}

		if(books_found === 10){
			PS.statusText("I am the overseer of");
		}

		if(books_found === 11){
			PS.statusText("I am the overseer of this");
		}

		if(books_found === 12){
			PS.statusText("I am the overseer of this place");
		}

		if(books_found === 13){
			PS.statusText("My");
		}

		if(books_found === 14){
			PS.statusText("My j");
		}

		if(books_found === 15){
			PS.statusText("My job");
		}

		if(books_found === 16){
			PS.statusText("My job is");
		}

		if(books_found === 17){
			PS.statusText("My job is to");
		}

		if(books_found === 18){
			PS.statusText("My job is to keep");
		}

		if(books_found === 19){
			PS.statusText("My job is to keep the");
		}

		if(books_found === 20){
			PS.statusText("My job is to keep the boo");
		}

		if(books_found === 21){
			PS.statusText("My job is to keep the books");
		}

		if(books_found === 22){
			PS.statusText("My job is to keep the books safe");
		}

		if(books_found === 23){
			PS.statusText("My job is to keep the books safe from");
		}

		if(books_found === 24){
			PS.statusText("My job is to keep the books safe from harm");
		}

		if(books_found === 25){
			PS.statusText("The");
		}

		if(books_found === 26){
			PS.statusText("These");
		}

		if(books_found === 27){
			PS.statusText("These boo");
		}

		if(books_found === 28){
			PS.statusText("These books");
		}

		if(books_found === 29){
			PS.statusText("These books a");
		}

		if(books_found === 30){
			PS.statusText("These books are");
		}

		if(books_found === 31){
			PS.statusText("These books are im");
		}

		if(books_found === 32){
			PS.statusText("These books are impor");
		}

		if(books_found === 33){
			PS.statusText("These books are importa");
		}

		if(books_found === 34){
			PS.statusText("These books are important");
		}

		if(books_found === 35){
			PS.statusText("These books are important to");
		}

		if(books_found === 36){
			PS.statusText("These books are  important to ma");
		}

		if(books_found === 37){
			PS.statusText("These books are important to many");
		}

		if(books_found === 38){
			PS.statusText("These books are important to many pe");
		}

		if(books_found === 39){
			PS.statusText("These books are important to many peop");
		}

		if(books_found === 40){
			PS.statusText("These books are important to many people");
		}

		if(books_found === 41){
			PS.statusText("Stu");
		}

		if(books_found === 42){
			PS.statusText("Students");
		}

		if(books_found === 43){
			PS.statusText("Students to");
		}

		if(books_found === 44){
			PS.statusText("Students to sci");
		}

		if(books_found === 45){
			PS.statusText("Students to scien");
		}

		if(books_found === 46){
			PS.statusText("Students to scientists");
		}

		if(books_found === 47){
			PS.statusText("Students to scientists. They");
		}

		if(books_found === 48){
			PS.statusText("Students to scientists. They all");
		}

		if(books_found === 49){
			PS.statusText("Students to scientists. They all need");
		}

		if(books_found === 50){
			PS.statusText("Students to scientists. They all need books");
		}

		if(books_found === 51){
			PS.statusText("Yo");
		}

		if(books_found === 52){
			PS.statusText("You");
		}

		if(books_found === 53){
			PS.statusText("You c");
		}

		if(books_found === 54){
			PS.statusText("You can");
		}

		if(books_found === 55){
			PS.statusText("You can re");
		}

		if(books_found === 56){
			PS.statusText("You can read");
		}

		if(books_found === 57){
			PS.statusText("You can read boo");
		}

		if(books_found === 58){
			PS.statusText("You can read books");
		}

		if(books_found === 59){
			PS.statusText("You can read books to");
		}

		if(books_found === 60){
			PS.statusText("You can read books to lea");
		}

		if(books_found === 61){
			PS.statusText("You can read books to learn");
		}

		if(books_found === 62){
			PS.statusText("You can read books to learn ab");
		}

		if(books_found === 63){
			PS.statusText("You can read books to learn about");
		}

		if(books_found === 64){
			PS.statusText("You can read books to learn about ev");
		}

		if(books_found === 65){
			PS.statusText("You can read books to learn about every");
		}

		if(books_found === 66){
			PS.statusText("You can read books to learn about everythi");
		}

		if(books_found === 67){
			PS.statusText("You can read books to learn about everything");
		}

		if(books_found === 68){
			PS.statusText("I");
		}

		if(books_found === 69){
			PS.statusText("I lo");
		}

		if(books_found === 70){
			PS.statusText("I love");
		}

		if(books_found === 71){
			PS.statusText("I love to");
		}

		if(books_found === 72){
			PS.statusText("I love to re");
		}

		if(books_found === 73){
			PS.statusText("I love to read");
		}

		if(books_found === 74){
			PS.statusText("I love to read and");
		}

		if(books_found === 75){
			PS.statusText("I love to read and lea");
		}

		if(books_found === 76){
			PS.statusText("I love to read and learn");
		}

		if(books_found === 77){
			PS.statusText("I love to read and learn ab");
		}

		if(books_found === 78){
			PS.statusText("I love to read and learn about");
		}

		if(books_found === 79){
			PS.statusText("I love to read and learn about owls");
		}

		if(books_found === 80){
			PS.statusText("Ow");
		}

		if(books_found === 81){
			PS.statusText("Owls");
		}

		if(books_found === 82){
			PS.statusText("Owls a");
		}

		if(books_found === 83){
			PS.statusText("Owls are");
		}

		if(books_found === 84){
			PS.statusText("Owls are co");
		}

		if(books_found === 85){
			PS.statusText("Owls are cool");
		}

		if(books_found === 86){
			PS.statusText("Owls are cool. Th");
		}

		if(books_found === 87){
			PS.statusText("Owls are  cool. They");
		}

		if(books_found === 88){
			PS.statusText("Owls are cool. They are");
		}

		if(books_found === 89){
			PS.statusText("Owls are cool. They are the");
		}

		if(books_found === 90){
			PS.statusText("Owls are cool. They are the sma");
		}

		if(books_found === 91){
			PS.statusText("Owls are cool. They are the smart");
		}

		if(books_found === 92){
			PS.statusText("Owls are cool. They are the smartest");
		}

		if(books_found === 93){
			PS.statusText("Owls are cool. They are the smartest an");
		}

		if(books_found === 94){
			PS.statusText("Owls are cool. They are the smartest anim");
		}

		if(books_found === 95){
			PS.statusText("Owls are cool. They are the smartest animal");
		}

		if(books_found === 96){
			PS.statusText("Yo");
		}

		if(books_found === 97){
			PS.statusText("You");
		}

		if(books_found === 98){
			PS.statusText("You can");
		}

		if(books_found === 99){
			PS.statusText("You can al");
		}

		if(books_found === 100){
			PS.statusText("You can also");
		}

		if(books_found === 101){
			PS.statusText("You can also re");
		}

		if(books_found === 102){
			PS.statusText("You can also read");
		}

		if(books_found === 103){
			PS.statusText("You can also read for");
		}

		if(books_found === 104){
			PS.statusText("You can also read for fun");
		}

		if(books_found === 105){
			PS.statusText("You can also read for fun. I");
		}

		if(books_found === 106){
			PS.statusText("You can also read for fun. I love");
		}

		if(books_found === 107){
			PS.statusText("You can also read for fun. I love fant");
		}

		if(books_found === 108){
			PS.statusText("You can also read for fun. I love fantasy");
		}

		if(books_found === 109){
			PS.statusText("You can also read for fun. I love fantasy books");
		}

		if(books_found === 110){
			PS.statusText("Boo");
		}

		if(books_found === 111){
			PS.statusText("Books");
		}

		if(books_found === 112){
			PS.statusText("Books are");
		}

		if(books_found === 113){
			PS.statusText("Books are fun");
		}

		if(books_found === 114){
			PS.statusText("Books are fun to");
		}

		if(books_found === 115){
			PS.statusText("Books are fun to read");
		}

		if(books_found === 116){
			PS.statusText("Books are fun to read and");
		}

		if(books_found === 117){
			PS.statusText("Books are fun to read and sup");
		}

		if(books_found === 118){
			PS.statusText("Books are fun to read and super");
		}

		if(books_found === 119){
			PS.statusText("Books are fun to read and super im");
		}

		if(books_found === 120){
			PS.statusText("Books are fun to read and super impor");
		}

		if(books_found === 121){
			PS.statusText("Books are fun to read and super important");
		}

		if(books_found === 122){
			PS.statusText("Everyone");
		}

		if(books_found === 123){
			PS.statusText("Everyone should");
		}

		if(books_found === 124){
			PS.statusText("Everyone should be");
		}

		if(books_found === 125){
			PS.statusText("Everyone should be reading books");
		}



		PS.gridPlane( oplane );
	};

	//const exit_find = function (x, y) {
		//let oplane;

		//oplane = PS.gridPlane();

		//PS.gridPlane( EXIT_PLANE );

	//}

	const illuminate = function ( x, y ) {
		let zone, i, j, offset, dx, dy;

		PS.gridPlane( DARKNESS_PLANE );

		for ( j = 0; j < ZONES.length; j += 1 ) {
			zone = ZONES[ j ];
			for ( i = 0; i < zone.length; i += 1 ) {
				offset = zone[ i ];
				dx = x + offset[ 0 ];
				dy = y + offset[ 1 ];
				if ( ( dx >= 0 ) && ( dx < _GRID_X ) && ( dy >= 0 ) && ( dy < _GRID_Y ) ) {
					PS.alpha( dx, dy, PS.ALPHA_TRANSPARENT );
				}
			}
		}

		PS.gridPlane( MAP_PLANE );
	};

	let _done = false; // set to true when exit reached; stop keys from working

	const _actor_place = function ( x, y ) {
		PS.spriteMove(_actor_sprite, x, y);
		_actor_x = x;
		_actor_y = y;

		if (PS.data(x, y) === BOOK_MARKER) {
			book_find(x, y);
		}

		illuminate(x, y);

		if (books_found === 5 | books_found === 12 | books_found === 24 | books_found === 40 | books_found === 50 | books_found === 67 | books_found === 79 | books_found === 95 | books_found === 109 | books_found === 125 | books_found === 141 | books_found === 155 ) {

		if (_is_exit(x, y)) {
			_level += 1;
			if (_level === _LEVELS.length) {
				_done = true; // stops actor from moving; set to false to release keys!
				PS.statusText("You have made it to the end of the Library");
				PS.audioPlay("fx_tada");
				return;
			}
			PS.audioPlay("fx_hoot");
			_next_level();
		}
	}
	};

	const _actor_step = function ( h, v ) {
		// Calculate proposed new location.

		let nx = _actor_x + h;
		let ny = _actor_y + v;

		if ( _is_wall( nx, ny ) ) {
			return;
		}

		//if (_is_book(nx, ny)){
		//bookCount++;
		//return;
		//}



		// Is new location off the grid?
		// If so, exit without moving.

		if ( ( nx < 0 ) || ( nx >= _GRID_X ) || ( ny < 0 ) || ( ny >= _GRID_Y ) ) {
			return;
		}

		PS.audioPlay( "fx_click" );
		_actor_place( nx, ny );
	};

	const _draw_map = function ( map ) {
		PS.gridPlane( MAP_PLANE );

		let i = 0;
		for ( let y = 0; y < map.height; y += 1 ) {
			for ( let x = 0; x < map.width; x += 1 ) {
				let data = map.data[ i ];
				let color;
				switch ( data ) {
					case _MAP_GROUND:
						color = _GROUND_COLOR;
						break;
					case _MAP_WALL:
						color = _WALL_COLOR;
						break;
					case _MAP_EXIT:
						color = _EXIT_COLOR;
						break;
					case _MAP_BOOK:
						color = _BOOK_COLOR;
						break;

					default:
						color = PS.COLOR_WHITE;
						break;
				}
				PS.color( x, y, color );
				i += 1;
			}
		}
	};

	const book_place = function ( x, y ) {
		let oplane = PS.gridPlane();

		PS.gridPlane( BOOK_PLANE );
		PS.color( x, y, _BOOK_COLOR );
		PS.alpha( x, y, PS.ALPHA_OPAQUE );
		PS.data( x, y, BOOK_MARKER );

		PS.gridPlane( oplane );
	};

	let _level = 0;

	const _LEVELS = [
		"Images/OwlLibrary1_grey.gif",
		"Images/OwlLibrary2_grey.gif",
		"Images/OwlLibrary3_grey.gif",
		"Images/OwlLibrary4_grey.gif",
		"Images/OwlLibrary5_grey.gif",
		"Images/OwlLibrary6_grey.gif",
		"Images/OwlLibrary7_grey.gif",
		"Images/OwlLibrary8_grey.gif",
		"Images/OwlLibrary9_grey.gif",
		"Images/OwlLibrary10_grey.gif",

	];

	const _next_level = function () {
		const onMapLoad = function ( image ) {
			let i, x, y, data, pixel;

			if ( image === PS.ERROR ) {
				PS.debug( "onMapLoad(): image load error\n" );
				return;
			}

			mapdata = image; // save map data for later

			_imagemap.width = _GRID_X = image.width;
			_imagemap.height = _GRID_Y = image.height;

			PS.gridSize( _GRID_X, _GRID_Y );
			PS.gridColor( PS.COLOR_BLACK );
			PS.border( PS.ALL, PS.ALL, 0 );
			PS.color( PS.ALL, PS.ALL, _GROUND_COLOR );

			i = 0;
			for ( y = 0; y < _GRID_Y; y += 1 ) {
				for ( x = 0; x < _GRID_X; x += 1 ) {
					data = _MAP_GROUND; // assume ground
					pixel = image.data[ i ];
					switch ( pixel ) {
						case _GROUND_COLOR:
							break; // no need to do anything
						case _WALL_COLOR:
							data = _MAP_WALL; // found a wall!
							break;
						//case _BOOK_COLOR:
						//data = _MAP_BOOK;
						//bookCount++;
						//break;

						case _BOOK_COLOR:
							book_place( x, y ); // found a shard!
							break;
						case _ACTOR_COLOR:
							_actor_x = x; // establish initial location of actor
							_actor_y = y;
							break;
						case _EXIT_COLOR:
							data = _MAP_EXIT;
							break;
						default:
							//PS.debug( "onMapLoad(): unrecognized pixel value\n" );
							break;
					}
					_imagemap.data[ i ] = data; // install translated data
					i += 1; // update array pointer
				}
			}

			_draw_map( _imagemap );

			//PS.gridPlane( DARKNESS_PLANE );
			//PS.color( PS.ALL, PS.ALL, PS.COLOR_BLACK );
			//PS.alpha( PS.ALL, PS.ALL, PS.ALPHA_OPAQUE );

			_actor_place( _actor_x, _actor_y );

			PS.statusColor( PS.COLOR_WHITE );
			if ( !_level ) {
				PS.statusText( "Find the Books to get to the next room" );
			}
			else {
				//PS.statusText( "Level " + ( _level + 1 ) + "!" );
			}

			PS.gridRefresh();
		};

		PS.imageLoad( _LEVELS[ _level ], onMapLoad, 1 );
	};

	return {
		init : function () {
			// PS.debug( "PS.init() called\n" );

			_actor_sprite = PS.spriteSolid( 1, 1 );
			PS.spritePlane( _actor_sprite, ACTOR_PLANE );
			PS.spriteSolidColor( _actor_sprite, _ACTOR_COLOR );

			_next_level();

			const TEAM = "Pawn";

			// This code should be the last thing
			// called by your PS.init() handler.
			// DO NOT MODIFY IT, except for the change
			// explained in the comment below.

			//PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
			//if ( user === PS.ERROR ) {
			//return;
			//}
			//PS.dbEvent( TEAM, "startup", user );
			//PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
			//}, { active : true } );
		},
		keyDown : function ( key ) {
			//PS.debug( "PS.keyDown(): key=" + key + "\n" );
			if ( _done ) {
				return; // don't allow movement if exit is reached
			}

			switch ( key ) {
				case PS.KEY_ARROW_UP:
				case 119:
				case 87: {
					_actor_step( 0, -1 ); // move UP (v = -1)
					break;
				}
				case PS.KEY_ARROW_DOWN:
				case 115:
				case 83: {
					_actor_step( 0, 1 ); // move DOWN (v = 1)
					break;
				}
				case PS.KEY_ARROW_LEFT:
				case 97:
				case 65: {
					_actor_step( -1, 0 ); // move LEFT (h = -1)
					break;
				}
				case PS.KEY_ARROW_RIGHT:
				case 100:
				case 68: {
					_actor_step( 1, 0 ); // move RIGHT (h = 1)
					break;
				}
			}
		}
	};

}() );

PS.init = G.init;
PS.keyDown = G.keyDown;

/*
 PS.init( system, options )
 Called once after engine is initialized but before event-polling begins.
 This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
 If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
 Any value returned is ignored.
 [system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
 [options : Object] = A JavaScript object with optional data properties; see API documentation for details.
 */

const TEAM = "Pawn";

// This code should be the last thing
// called by your PS.init() handler.
// DO NOT MODIFY IT, except for the change
// explained in the comment below.

PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
	if ( user === PS.ERROR ) {
		return;
	}
	PS.dbEvent( TEAM, "startup", user );
	PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
}, { active : false } );



