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

	const _GRID_X = 15;
	const _GRID_Y = 15;
	const _GROUND_COLOR = PS.COLOR_GRAY;
	const _ACTOR_COLOR = 0x964B00;

	const _WALL_COLOR = PS.COLOR_BLACK;
	const _EXIT_COLOR = PS.COLOR_RED;
	const _MAP_WALL = 0;
	const _MAP_GROUND = 1;
	const _MAP_EXIT = 2;

	const MAP_PLANE = 0;
	const ACTOR_PLANE = 5;
	const DARKNESS_PLANE = 4;

	let _actor_x = 7;
	let _actor_y = 7;
	let _timer_id;

	let _actor_path = null;
	let _actor_position;
	let _pathmap;

	let mapdata;

	const _imagemap = {
		width : _GRID_X,
		height : _GRID_Y,
		pixelSize : 1,
		data : [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
			0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
			0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
			0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0,
			0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,
			0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0,
			0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0,
			0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0
		]
	};

	const _is_wall = function ( x, y ) {
		return( PS.color( x, y) === _WALL_COLOR );
	};

	const _is_exit = function (x, y) {
		return( PS.color(x, y) === _EXIT_COLOR);
	}





	//const illuminate = function ( x, y ) {
		//let oplane, zone, i, j, offset, dx, dy;

		//const ZONES = [
			//[
				//[ -1, -1 ], [ 0, -1 ], [ 1, -1 ],
				//[ -1, 0 ], [ 1, 0 ],
				//[ -1, 1 ], [ 0, 1 ], [ 1, 1 ]
			//],
			//[
				//[ -2, -2 ], [ -1, -2 ], [ 0, -2 ], [ 1, -2 ], [ 2, -2 ],
				//[ -2, -1 ], [ 2, -1 ],
				//[ -2, 0 ], [ 2, 0 ],
				//[ -2, 1 ], [ 2, 1 ],
				//[ -2, 2 ], [ -1, 2 ], [ 0, 2 ], [ 1, 2 ], [ 2, 2 ]
			//],
			//[
				//[ -1, -3 ], [ 0, -3 ], [ 1, -3 ],
				//[ -3, -1 ], [ 3, -1 ],
				//[ -3, 0 ], [ 3, 0 ],
				//[ -3, 1 ], [ 3, 1 ],
				//[ -1, 3 ], [ 0, 3 ], [ 1, 3 ]
			//]
		//];

		//oplane = PS.gridPlane();
		//PS.gridPlane( DARKNESS_PLANE );

		//for ( j = 0; j < ZONES.length; j += 1 ) {
			//zone = ZONES[ j ];
			//for ( i = 0; i < zone.length; i += 1 ) {
				//offset = zone[ i ];
				//dx = x + offset[ 0 ];
				//dy = y + offset[ 1 ];
				//if ( ( dx >= 0 ) && ( dx < _GRID_X ) && ( dy >= 0 ) && ( dy < _GRID_Y ) ) {
					//if ( PS.alpha( dx, dy ) !== PS.ALPHA_TRANSPARENT ) {
						//PS.alpha( dx, dy, PS.ALPHA_TRANSPARENT );
						// seen[ ( dy * GRID_Y ) + dx ] = PS.ALPHA_TRANSPARENT;
					//}
				//}
			//}
		//}

		//PS.gridPlane( oplane );
	//};



	const _actor_place = function ( x, y ) {
		PS.color( _actor_x, _actor_y, _GROUND_COLOR );
		PS.color( x, y, _ACTOR_COLOR );
		_actor_x = x;
		_actor_y = y;

		//illuminate( x, y );

	};

	const _actor_step = function ( h, v ) {
		// Calculate proposed new location.

		let nx = _actor_x + h;
		let ny = _actor_y + v;

		if ( _is_wall( nx, ny ) ) {
			return;
		}

		if( _is_exit(nx, ny)){
			PS.statusText("You have escaped the Labyrinth");
			PS.audioLoad("fx_tada");
			PS.audioPlay("fx_tada");
			return;
		}

		// Is new location off the grid?
		// If so, exit without moving.

		if ( ( nx < 0 ) || ( nx >= _GRID_X ) || ( ny < 0 ) || ( ny >= _GRID_Y ) ) {
			return;
		}

		_actor_path = null;
		_actor_place( nx, ny );
	};

	const _path_print = function () {
		PS.debugClear();
		let len = _actor_path.length;
		let str = "_actor_path length = " + len + "\n";
		for ( let i = 0; i < len; i += 1 ) {
			let point = _actor_path[ i ];
			str += ( "\t" + i + ": x = " + point[ 0 ] + ", y = " + point[ 1 ] + "\n" );
		}
		PS.debug( str );

	};

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
			// PS.debug( "PS.init() called\n" );


			PS.gridPlane(ACTOR_PLANE);
			PS.gridSize( _GRID_X, _GRID_Y );
			PS.color( PS.ALL, PS.ALL, _GROUND_COLOR );
			PS.color(7, 14, PS.COLOR_RED);
			PS.border( PS.ALL, PS.ALL, 0 );
			_actor_place( _actor_x, _actor_y );
			_draw_map( _imagemap );
			PS.statusText("Use WASD to Escape the Labyrinth!");
			PS.statusColor(PS.COLOR_WHITE);
			PS.gridColor(PS.COLOR_BLACK);

			//PS.gridPlane( DARKNESS_PLANE );
			//PS.color( PS.ALL, PS.ALL, PS.COLOR_BLACK );
			//PS.alpha( PS.ALL, PS.ALL, PS.ALPHA_OPAQUE );



			_pathmap = PS.pathMap( _imagemap );
			_timer_id = PS.timerStart( 6, _actor_animate );

			// This code should be the last thing
			// called by your PS.init() handler.
			// DO NOT MODIFY IT, except for the change
			// explained in the comment below.

			PS.dbLogin("imgd2900", TEAM, function (id, user) {
				if (user === PS.ERROR) {
					return;
				}
				PS.dbEvent(TEAM, "startup", user);
				PS.dbSend(TEAM, PS.CURRENT, {discard: true});
			}, {active: true});

			// Change the false in the final line above to true
			// before deploying the code to your Web site.
		},
		touch : function ( x, y ) {
			//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

			//let path = PS.pathFind( _pathmap, _actor_x, _actor_y, x, y );
			//if ( path.length > 0 ) {
				//_actor_position = 0;
				//_actor_path = path;
			//}
			//_path_print();
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
PS.touch = G.touch;
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

