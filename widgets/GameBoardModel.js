/**
 * Tic-tac-toe game board model.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardModel');
dojo.require('dijit._Widget');
dojo.require('ttt.GameTopics');

dojo.declare('ttt.GameBoardModel', [dijit._Widget], {
    // which player's turn to start
    turn: 0,
    // number of players
    players: 2,
    // size of the game
    size: 3,
    postMixInProperties: function() {
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
        var win = [];
        for(i=0; i < this.size; i++) {
            c = i + (row*this.size);
            if(this._cells[c] != player) {break;}
            win.push(c);
            if(i == this.size-1) {return win;}
        }
        
        // check col
        win = [];
        for(i=0; i < this.size; i++) {
            c = col + i*this.size;
            if(this._cells[c] != player) {break;}
            win.push(c);
            if(i == this.size-1) {return win;}
        }

        // check diag
        if(row == col) {
            win = [];
            for(i=0; i < this.size; i++) {
                c = i + i*this.size;
                if(this._cells[c] != player) {break;}
                win.push(c);
                if(i == this.size-1) {return win;}                
            }
        }
        
        if(col == this.size - row - 1) {
            win = [];
            for(i=0; i < this.size; i++) {
                c = (this.size - i - 1) + i*this.size;
                if(this._cells[c] != player) {break;}
                win.push(c);
                if(i == this.size-1) {return win;}
            }
        }
        return null;
    },
    
    getPlayerTurn: function() {
        return this.turn;
    },

    fillCell: function(cell) {
        cell = Number(cell);
        var curr = this._cells[cell];
        if(curr !== undefined) {
            // cell already taken
            dojo.publish(ttt.MODEL_CELL_TAKEN, [cell, curr]);
            return;
        }
        var player = this.turn;
        this._cells[cell] = player;
        // next turn
        this.turn = (this.turn + 1) % this.players;
        // notify of cell taken
        dojo.publish(ttt.MODEL_FILL_CELL, [cell, player]);
        // check for win
        var win = this._checkWin(cell, player);
        if(win !== null) {
            dojo.publish(ttt.MODEL_END_GAME, [player, win]);
            return;
        }
        // tie if no cells left
        var blank = dojo.filter(this._cells, 'return item === undefined;');
        if(blank.length) {
            dojo.publish(ttt.MODEL_NEXT_TURN, [this.turn]);
        } else {
            dojo.publish(ttt.MODEL_END_GAME, [null, null]);
        }
    },
    
    getCell: function(cell) {
        return this._cells[cell];
    }
});