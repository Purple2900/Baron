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
	const _GROUND_COLOR = PS.COLOR_GRAY;
	const _ACTOR_COLOR = 0x964B00;

	const _WALL_COLOR = PS.COLOR_BLACK;
	const _EXIT_COLOR = PS.COLOR_RED;
	const _MAP_WALL = 0;
	const _MAP_GROUND = 1;
	const _MAP_EXIT = 2;

	const MAP_PLANE = 0;
	const DARKNESS_PLANE = 1;
	const ACTOR_PLANE = 2;

	const EXIT_COLOR = PS.COLOR_RED;
	const EXIT_MARKER = "exit";

	let _actor_x = 1;
	let _actor_y = 1;
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
		PS.spriteMove( _actor_sprite, x, y );
		_actor_x = x;
		_actor_y = y;

		illuminate( x, y );

		if ( _is_exit( x, y  ) ) {
			_level += 1;
			if ( _level === _LEVELS.length ) {
				_done = true; // stops actor from moving; set to false to release keys!
				PS.statusText( "You have escaped the Labyrinth!" );
				PS.audioPlay( "fx_tada" );
				return;
			}
			PS.audioPlay( "fx_coin1" );
			_next_level();
		}
	};

	const _actor_step = function ( h, v ) {
		// Calculate proposed new location.

		let nx = _actor_x + h;
		let ny = _actor_y + v;

		if ( _is_wall( nx, ny ) ) {
			return;
		}

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
					default:
						color = PS.COLOR_WHITE;
						break;
				}
				PS.color( x, y, color );
				i += 1;
			}
		}
	};

	let _level = 0;

	const _LEVELS = [
		"Images/MinotaursRaze_Maze1 (1) (1).gif",
		"Images/MinotaursRaze_Maze2.gif",
		"Images/MinotaursRaze_Maze3.gif",
		"Images/MinotaursRaze_Maze4.gif",
		"Images/MinotaursRaze_Maze5.gif",
		"Images/MinotaursRaze_Maze6.gif",
		"Images/MinotaursRaze_Maze7.gif",
		"Images/MinotaursRaze_Maze8.gif",
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
						//case SHARD_COLOR:
						//shard_place( x, y ); // found a shard!
						//break;
						case _ACTOR_COLOR:
							_actor_x = x; // establish initial location of actor
							_actor_y = y;
							break;
						case EXIT_COLOR:
							data = _MAP_EXIT;
							break;
						default:
							PS.debug( "onMapLoad(): unrecognized pixel value\n" );
							break;
					}
					_imagemap.data[ i ] = data; // install translated data
					i += 1; // update array pointer
				}
			}

			_draw_map( _imagemap );

			PS.gridPlane( DARKNESS_PLANE );
			PS.color( PS.ALL, PS.ALL, PS.COLOR_BLACK );
			PS.alpha( PS.ALL, PS.ALL, PS.ALPHA_OPAQUE );

			_actor_place( _actor_x, _actor_y );

			PS.statusColor( PS.COLOR_WHITE );
			if ( !_level ) {
				PS.statusText( "Use WASD to escape the Labyrinth!" );
			}
			else {
				PS.statusText( "Level " + ( _level + 1 ) + "!" );
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

