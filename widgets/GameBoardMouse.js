/**
 * Tic-tac-toe game board mouse controller.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardView');
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
    },
    
    /** 
     * Called when the user clicks a cell node in the game board.
     */
    _onClickCell: function(event) {
        var cell = event.target.getAttribute('data-cell');
        this.model.fillCell(cell);
    },

    /** 
     * Called when the user hovers over a cell node in the game board.
     */
    _onHoverCell: function(event) {
        var node = event.target;
        var cell = node.getAttribute('data-cell');
        dojo.publish(ttt.CTRL_REGARD_CELL, [cell, this._lastRegard]);
        this._lastRegard = cell;
    }
});