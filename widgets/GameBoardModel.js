/**
 * Tic-tac-toe game board model.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardModel');
dojo.require('dijit._Widget');

dojo.declare('ttt.GameBoardModel', [dijit._Widget], {
    // number of players
    players: 2,
    // size of the game
    size: 4,
    postMixInProperties: function() {
        // who's turn
        this._turn = 0;
        // number of slots
        this._cells = [];
        // init the array to the proper size
        this._cells[this.size*this.size-1] = undefined;
    },
    
    _checkWin: function(cell, player) {
        var row = Math.floor(cell / this.size);
        var col = cell % this.size;
        var i, c;
        // check row
        for(i=0; i < this.size; i++) {
            c = i + (row*this.size);
            if(this._cells[c] != player) {break;}
            if(i == this.size-1) {return true;}
        }
        
        // check col
        for(i=0; i < this.size; i++) {
            c = col + i*this.size;
            if(this._cells[c] != player) {break;}
            if(i == this.size-1) {return true;}
        }

        // check diag
        if(row == col) {
            for(i=0; i < this.size; i++) {
                c = i + i*this.size;
                if(this._cells[c] != player) {break;}
                if(i == this.size-1) {return true;}                
            }
        }
        
        if(col == this.size - row - 1) {
            for(i=0; i < this.size; i++) {
                c = (this.size - i - 1) + i*this.size;
                if(this._cells[c] != player) {break;}
                if(i == this.size-1) {return true;}                
            }
        }
        return false;
    },
    
    getPlayerTurn: function() {
        return this._turn;
    },

    fillCell: function(cell) {
        var player = this._turn;
        this._cells[cell] = player;
        // next turn
        this._turn = (this._turn + 1) % this.players;
        // notify of cell taken
        this.onFillCell(cell, player);
        // check for win
        if(this._checkWin(cell, player)) {
            this.onGameEnd(player);
            return;
        }
        // tie if no cells left
        var blank = dojo.filter(this._cells, 'return item === undefined;');
        if(blank.length) {
            this.onNextTurn(this._turn);
        } else {
            this.onGameEnd();
        }
    },
    
    onFillCell: function(cell, player) {
        // extension point
    },
    
    onNextTurn: function(player) {
        // extension point
    },
    
    onGameEnd: function(win) {
        // extension point
    }
});