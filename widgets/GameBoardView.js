/**
 * Tic-tac-toe game board view.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardView');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit._Contained');

dojo.declare('ttt.GameBoardView', [dijit._Widget, dijit._Templated, dijit._Contained], {
    // reference to the model driving this view
    model: null,
    // template markup for the widget
    templatePath: dojo.moduleUrl('ttt', 'templates/GameBoardView.html'),
    /**
     * Called after the attributes passed to the constructor are available.
     */
    postMixInProperties: function() {
        this.model = dijit.byNode(this.model);
        // list to model events
        this.connect(this.model, 'onFill', '_onFillSlot');
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
                var td = dojo.create('td', {innerHTML : '&nbsp;'}, tr);
                td.setAttribute('data-cell', (row * size) + col);
                this.connect(td, 'onclick', '_onClickCell');
                if(col) {
                    dojo.style(td, {borderLeftWidth : '1px'});
                }
                if(row) {
                    dojo.style(td, {borderTopWidth : '1px'});
                }
            }
        }
    },
    
    /**
     * Called when the container resizes. Recomputes the size of the game grid
     * and all tile cells.
     *
     * @param size Box object
     */
    resize: function() {
        var size = dojo.contentBox(this.domNode);
        var cols = this.model.attr('size');
        // bound cells by width
        var cs = size.w / (cols);
        if(cs * (cols+1) > size.h) {
            // bound by height
            cs = size.h / (cols);
        }
        
        // resize all the cells
        var box = {w: cs, h: cs};
        dojo.query('td', this.containerNode).forEach(function(td) {
            dojo.marginBox(td, box);
            dojo.style(td, 'font-size', box.w + 'px');
        });

        // center the table
        var ts = dojo.marginBox(this.tableNode);
        box = {
            top: (size.h - ts.h) / 2 + 'px',
            left: (size.w - ts.w) / 2 + 'px'
        };
        dojo.style(this.tableNode, box);
    },

    /** 
     * Called when the user clicks a cell (td) in the table game board.
     * Connected with code in postCreate().
     */
    _onClickCell: function(event) {
        var cell = event.target.getAttribute('data-cell');
        if(!cell) {return;}
        event.target.removeAttribute('data-cell');
        this.model.fill(cell);
    },
    
    _onFillSlot: function(slot, mark) {
        console.debug(slot, mark);
        var td = dojo.query('td', this.containerNode)[slot];
        td.innerHTML = mark;
    }
});
