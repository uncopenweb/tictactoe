/**
 * Tic-tac-toe game board keyboard controller.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardKeys');
dojo.require('dijit._Widget');

dojo.declare('ttt.GameBoardKeys', [dijit._Widget], {
    // view containing the cells to keyboard control
    view: '',
    // reference to the model driving this view
    model: '',
    /**
     * Called after the attributes passed to the constructor are available.
     */
    postMixInProperties: function() {
        this.model = dijit.byId(this.model);
        this.view = dijit.byId(this.view);
        // track last regarded cell
        this._lastRegard = null;
        // track if game ended
        this._ended = false;
    },
    
    postCreate: function() {
        // listen to global key events
        uow.ui.connectKeys();
        var a = dojo.subscribe('/uow/key/up', this, '_onKeyUp');
        // add data attributes to cells
        dojo.forEach(this.view.getCellNodes(), function(node, i) {
            node.setAttribute('data-cell', i);
        }, this);
        // connect to model events
        var b = dojo.subscribe(ttt.MODEL_END_GAME, this, '_onEndGame');
        // connect to other controller events
        var c = dojo.subscribe(ttt.CTRL_REGARD_CELL, this, '_onRegardCell');
        // store tokens for later unsubscribe
        this._stoks = [a,b,c];
    },
    
    uninitialize: function() {
        uow.ui.disconnectKeys();
        dojo.forEach(this._stoks, dojo.unsubscribe);
    },
    
    _onKeyUp: function(event) {
        if(this._ended) {
            // reset the game if ended 
            dojo.publish(ttt.CTRL_RESET_GAME);
            return;
        }
        if(this._lastRegard === null) {
            // jump into the grid top-left on any key to start
            dojo.publish(ttt.CTRL_REGARD_CELL, [0, null]);
            return;
        }
        var size = this.model.attr('size');
        var cell = Number(this._lastRegard);
        switch(event.keyCode) {
        case dojo.keys.ENTER:
        case dojo.keys.SPACE:
            this.model.fillCell(cell);
            break;
        case dojo.keys.UP_ARROW:
            if(cell < size) {
                dojo.publish(ttt.CTRL_CANT_REGARD_CELL);
            } else {
                cell -= size;
                dojo.publish(ttt.CTRL_REGARD_CELL, [cell, this._lastRegard]);
            }
            break;
        case dojo.keys.DOWN_ARROW:
            if(cell >= size*size - size) {
                dojo.publish(ttt.CTRL_CANT_REGARD_CELL);
            } else {
                cell += size;
                dojo.publish(ttt.CTRL_REGARD_CELL, [cell, this._lastRegard]);
            }
            break;
        case dojo.keys.LEFT_ARROW:
            if(cell % size === 0) {
                dojo.publish(ttt.CTRL_CANT_REGARD_CELL);
            } else {
                cell -= 1;
                dojo.publish(ttt.CTRL_REGARD_CELL, [cell, this._lastRegard]);
            }
            break;
        case dojo.keys.RIGHT_ARROW:
            if(cell % size === size - 1) {
              dojo.publish(ttt.CTRL_CANT_REGARD_CELL);
            } else {
                cell += 1;
                dojo.publish(ttt.CTRL_REGARD_CELL, [cell, this._lastRegard]);
            }
            break;
        }
    },
    
    /**
     * Called when some controller regards a new cell.
     */
    _onRegardCell: function(newCell, oldCell) {
        this._lastRegard = Number(newCell);
    },
    
    /**
     * Called when the game ends.
     */
    _onEndGame: function() {
        this._ended = true;
    }
});