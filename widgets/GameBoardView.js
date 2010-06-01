/**
 * Tic-tac-toe game board view.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardView');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit._Contained');

dojo.declare('ttt.GameBoardView', [dijit._Widget, dijit._Templated, dijit_Contained], {
    // reference to the model driving this view
    model: null,
    // template markup for the widget
    templatePath: dojo.moduleUrl('widgets', 'templates/GameBoardView.html'),
    /**
     * Called after the attributes passed to the constructor are available.
     */
    postMixInProperties: function() {
        this.model = dijit.byId('model');
    },
    
    /**
     * Called after the widget template is inserted into the DOM.
     */
    postCreate: function() {
        var size = this.model.attr('size');
        // build the right number of rows and columns
        for(var row=0; row < size; row++) {
            var tr = dojo.create('tr', null, this.containerNode);
            for(var col=0; col < size; col++) {
                var td = dojo.create('td', null, tr);
                td.setAttribute('data-cell', (row * size) + col);
                this.connect(td, 'onclick', '_onClickCell');
            }
        }
    },

    /** 
     * Called when the user clicks a cell (td) in the table game board.
     * Connected with code in postCreate().
     */
    _onClickCell: function(event) {
        var cell = event.target.getAttribute('data-cell');
        this.model.fill(cell);
    }
});
