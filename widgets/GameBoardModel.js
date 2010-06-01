/**
 * Tic-tac-toe game board model.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardModel');
dojo.require('dijit._Widget');

dojo.declare('ttt.GameBoardModel', [dijit._Widget], {
    // size of the game
    size: 3,
    postMixInProperties: function() {
        // who's turn
        this._knownTurn = 'X';
        // number of slots
        this._slots = [];
        // init the array to the proper size
        this._slots[this.size*this.size] = undefined;
    },
    
    fill: function(slot) {
        this._slots[slot]
    }
});