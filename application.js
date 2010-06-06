/**
 * Startup script for TicTacToe.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.Main');
dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dojo.parser');
dojo.require('ttt.GameBoardView');
dojo.require('ttt.GameTurnView');
dojo.require('ttt.GameBoardModel');

dojo.ready(function() {
    // force a layout after page load, but outside the load event handler
    // Firefox doesn't layout properly if we do it right away
    setTimeout(function() {dijit.byId('layout').resize();}, 0);
});