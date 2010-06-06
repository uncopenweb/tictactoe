/**
 * Tic-tac-toe game board audio.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardAudio');
dojo.require('dojo.i18n');
dojo.require('dijit._Widget');
dojo.requireLocalization('ttt', 'GameBoardAudio');

dojo.declare('ttt.GameBoardView', [dijit._Widget], {
    // reference to the model driving this view
    model: ''
});