/**
 * Tic-tac-toe MVC pub/sub topics.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
// int: cell number, int: player number
ttt.MODEL_FILL_CELL = '/ttt/model/fill_cell';
// int: cell number, int: player number
ttt.MODEL_CELL_TAKEN = '/ttt/model/cell_taken';
// int: player number
ttt.MODEL_NEXT_TURN = '/ttt/model/next_turn';
// int: winning player number
ttt.MODEL_END_GAME = '/ttt/model/end_game';
// int: new cell number, int: old cell number
ttt.CTRL_REGARD_CELL = '/ttt/ctrl/regard_cell';