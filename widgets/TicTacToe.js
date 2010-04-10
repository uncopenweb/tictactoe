/**
 * TicTacToe game board widget.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('widgets.TicTacToe');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.declare('widgets.TicTacToe', [dijit._Widget, dijit._Templated], {
    // size of the game board (not yet supported)
    size: 3,
    // template markup for the widget
    templatePath: dojo.moduleUrl('widgets', 'templates/TicTacToe.html'),
    /**
     * Called after the attributes passed to the constructor are available.
     */
    postMixInProperties: function() {
        this._nextTurn = 'X';
    },
    
    /**
     * Called after the widget template is inserted into the DOM.
     */
    postCreate: function() {
        // get all the table cells and attach onclick listeners
        dojo.query('td', this.domNode).connect('onclick', this, '_onClickCell');
        
        // long hand ways of iterating these
        /*for(var i=0; i < tds.length; i++) {
            tds[i].innerHTML = 'x';
        }*/
        //tds.forEach('item.innerHTML = "x";');
        /*function(td, i, arr) {
            td.innerHTML = i;
        });*/

        // other functions we discussed
        // dojo.connect(target, event, function|instance, function_name)
        // this.connect(target, event, function_name)
        // dojo.hitch(this, func)
    },
    
    /**
     * Called after all the child widgets (if there are any) are ready.
     */
    startup: function() {
        
    },
    
    /**
     * Called when destroy() is invoked on this widget.
     */
    uninitialize: function() {
        
    },
    
    /** 
     * Called when the user clicks a cell (td) in the table game board.
     * Connected with code in postCreate().
     */
    _onClickCell: function(event) {
        // @todo: insert the next character, not always X
        event.target.innerHTML = 'x';
        //console.log(x);
    }
});
