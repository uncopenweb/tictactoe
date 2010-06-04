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
    // mark symbols
    marks : ['X', 'O'],
    postMixInProperties: function() {
        // who's turn
        this._turn = 0;
        // number of slots
        this._slots = [];
        // init the array to the proper size
        this._slots[this.size*this.size] = undefined;
    },
    
    fill: function(slot) {
        var mark = this.marks[this._turn];
        this._slots[slot] = mark;
        this.onFill(slot, mark);
        this._turn = (this._turn + 1) % this.marks.length;
    },
    
    onFill: function(slot, mark) {
        // extension point
        console.debug(slot, mark);
    }
});