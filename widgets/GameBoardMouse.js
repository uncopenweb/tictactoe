/**
 * Tic-tac-toe game board mouse controller.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardMouse');
dojo.require('dijit._Widget');

dojo.declare('ttt.GameBoardMouse', [dijit._Widget], {
    // view containing the cells to mouse control
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
    },
    
    postCreate: function() {
        // connect to DOM nodes for mouse events
        dojo.forEach(this.view.getCellNodes(), function(node, i) {
            node.setAttribute('data-cell', i);
            this.connect(node, 'onclick', '_onClickCell');
            this.connect(node, 'onmouseover', '_onHoverCell');
        }, this);
        // connect to model events
        var a = dojo.subscribe(ttt.MODEL_END_GAME, this, '_onEndGame');
        // connect to other controller events
        var b = dojo.subscribe(ttt.CTRL_REGARD_CELL, this, '_onRegardCell');
        // store tokens for later unsubscribe
        this._stoks = [a,b];
    },
    
    uninitialize: function() {
        dojo.forEach(this._stoks, dojo.unsubscribe);
    },
    
    /** 
     * Called when the user clicks a cell node in the game board.
     */
    _onClickCell: function(event) {
        var cell = event.target.getAttribute('data-cell');
        this.model.fillCell(Number(cell));
    },

    /** 
     * Called when the user hovers over a cell node in the game board.
     */
    _onHoverCell: function(event) {
        var node = event.target;
        var cell = node.getAttribute('data-cell');
        dojo.publish(ttt.CTRL_REGARD_CELL, [Number(cell), this._lastRegard]);
    },
    
    /**
     * Called when some controller regards a new cell.
     */
    _onRegardCell: function(newCell) {
        this._lastRegard = Number(newCell);
    },
    
    /**
     * Called when the game ends.
     */
    _onEndGame: function() {
        this.destroy();
    }
});