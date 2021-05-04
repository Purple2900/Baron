/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)
*/

"use strict";

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

const G = ( function () {
	const _GRID_X = 16;
	const _GRID_Y = 16;
	const _GROUND_COLOR = 0x964B00;
	const _ACTOR_COLOR = PS.COLOR_GRAY;
	const _WALL_COLOR = PS.COLOR_YELLOW;
	const _BOOK_COLOR = PS.COLOR_WHITE;
	const _EXIT_COLOR = PS.COLOR_RED;
	const _MAP_WALL = 0;
	const _MAP_GROUND = 1;
	const _MAP_BOOK = 2;
	const _MAP_EXIT = 3;

	const MAP_PLANE = 0;
	const DARKNESS_PLANE = 1;
	const ACTOR_PLANE = 2;

	let _actor_x = 1;
	let _actor_y = 14;
	let _timer_id;
	let _actor_sprite = "";

	//let MAP_PLANE = 0;
	//let BOOK_PLANE = 1;
	//let BOOK_COUNT = 5;
	//let BOOK_MARKER = "book";
	let books_found = 0;


	let _actor_path = null;
	let _actor_position;
	let _pathmap;

	let _imagemap = {
		width : _GRID_X,
		height : _GRID_Y,
		pixelSize : 1,
		data : [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0,
			0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]
	};

	let _imagemap2 = {
		width : _GRID_X,
		height : _GRID_Y,
		pixelSize : 1,
		data : [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0,
			0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]
	};

	const _is_wall = function ( x, y ) {
		//let data = _imagemap.data[ ( y * _GRID_X ) + x ];
		return ( PS.color(x, y) === _WALL_COLOR );
	};

	const _is_exit = function ( x, y ) {
		//let data = _imagemap.data[ ( y * _GRID_X ) + x ];
		return ( PS.color(x, y) === _EXIT_COLOR );
	};

	const _is_book = function (x, y) {
		//let data = _imagemap.data[ ( y * _GRID_X ) + x ];
		return (PS.color(x, y) === _BOOK_COLOR);
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

	const _actor_place = function ( x, y ) {

		//PS.spriteMove( _actor_sprite, x, y );

		PS.color( _actor_x, _actor_y, _GROUND_COLOR );
		PS.color( x, y, _ACTOR_COLOR );
		_actor_x = x;
		_actor_y = y;

		illuminate( x, y );
	};

	let _done = false;

	const _actor_step = function ( h, v ) {
		// Calculate proposed new location.

		let nx = _actor_x + h;
		let ny = _actor_y + v;

		if ( _is_wall( nx, ny ) ) {
			return;
		}

		if(_is_exit(nx, ny)){
			PS.audioPlay("fx_tada");
			_done = true;
			PS.statusText("More levels coming soon");
		};

		if(_is_book(nx, ny)){
			books_found = books_found + 1;
			PS.audioPlay("fx_hoot");
			if(books_found === 1){
				PS.statusText("I");

			}
			if(books_found === 2) {
				PS.statusText("I am");

			}
			if(books_found === 3) {
				PS.statusText("I am trapped.");

			}
			if(books_found === 4) {
				PS.statusText("I am trapped. Help");

			}
			if(books_found === 5) {
				PS.statusText("I am trapped. Help me!");

				if(_is_exit(nx, ny)){
					PS.audioPlay("fx_tada");
					_done = true;
					PS.statusText("More levels coming soon");
				};
			};




		};





		// Is new location off the grid?
		// If so, exit without moving.

		if ( ( nx < 0 ) || ( nx >= _GRID_X ) || ( ny < 0 ) || ( ny >= _GRID_Y ) ) {
			return;
		}

		_actor_path = null;
		_actor_place( nx, ny );
	};

	// const _path_print = function () {
	// 	PS.debugClear();
	// 	let len = _actor_path.length;
	// 	let str = "_actor_path length = " + len + "\n";
	// 	for ( let i = 0; i < len; i += 1 ) {
	// 		let point = _actor_path[ i ];
	// 		str += ( "\t" + i + ": x = " + point[ 0 ] + ", y = " + point[ 1 ] + "\n" );
	// 	}
	// 	PS.debug( str );
	// };

	const _actor_animate = function () {
		if ( _actor_path ) {
			let point = _actor_path[ _actor_position ];
			let x = point[ 0 ];
			let y = point[ 1 ];
			// if ( _is_wall( x, y ) ) {
			// 	_actor_path = null;
			// 	return;
			// }
			_actor_place( x, y );
			_actor_position += 1;
			if ( _actor_position >= _actor_path.length ) {
				_actor_path = null;
			}
		}
	};

	const _draw_map = function ( map ) {
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
					case _MAP_BOOK:
						color = _BOOK_COLOR;
						break;
					case _MAP_EXIT:
						color = _EXIT_COLOR;
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

	return {
		init : function () {

			//_actor_sprite = PS.spriteSolid( 1, 1 );
			//PS.spritePlane( _actor_sprite, ACTOR_PLANE );
			//PS.spriteSolidColor( _actor_sprite, _ACTOR_COLOR );

			// PS.debug( "PS.init() called\n" );
			PS.gridSize( _GRID_X, _GRID_Y );
			// PS.color( PS.ALL, PS.ALL, _GROUND_COLOR );
			PS.border( PS.ALL, PS.ALL, 0 );
			_draw_map( _imagemap );
			_actor_place( _actor_x, _actor_y );

			//PS.gridPlane( DARKNESS_PLANE );
			//PS.color( PS.ALL, PS.ALL, PS.COLOR_BLACK );
			//PS.alpha( PS.ALL, PS.ALL, PS.ALPHA_OPAQUE );

			PS.statusColor(PS.COLOR_WHITE);
			PS.statusText("Collect the Books to Complete the Message");
			PS.gridColor(PS.COLOR_BLACK);
			// PS.color( _GRID_X / 2, PS.ALL, _WALL_COLOR );
			// PS.color( _GRID_X / 2, _GRID_Y / 2, _GROUND_COLOR );
			_pathmap = PS.pathMap( _imagemap );
			_timer_id = PS.timerStart( 6, _actor_animate );

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
			}, { active : true } );
		},

		keyDown : function ( key ) {
			//PS.debug( "PS.keyDown(): key=" + key + "\n" );
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
} () );

PS.init = G.init;
PS.keyDown = G.keyDown;

