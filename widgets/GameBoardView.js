/**
 * Tic-tac-toe game board view.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardView');
dojo.require('dojo.i18n');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit._Contained');
dojo.requireLocalization('ttt', 'GameBoardView');

dojo.declare('ttt.GameBoardView', [dijit._Widget, dijit._Templated, dijit._Contained], {
    // reference to the model driving this view
    model: '',
    // template markup for the widget
    templatePath: dojo.moduleUrl('ttt', 'templates/GameBoardView.html'),
    /**
     * Called after the attributes passed to the constructor are available.
     */
    postMixInProperties: function() {
        this.model = dijit.byId(this.model);
        // listen to model events
        this.connect(this.model, 'onFillCell', '_onFillCell');
        // blank cell char
        this._blank = '&nbsp;';
        // board labels
        this.labels = dojo.i18n.getLocalization('ttt', 'GameBoardView');
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
                var td = dojo.create('td', {
                    innerHTML : this._blank,
                    className: 'tttBlank'
                }, tr);
                td.setAttribute('data-cell', (row * size) + col);
                this.connect(td, 'onclick', '_onClickCell');
                this.connect(td, 'onmouseover', '_onHoverCell');
                this.connect(td, 'onmouseout', '_onUnhoverCell');
                if(col) {
                    dojo.addClass(td, 'tttLeftBorder');
                }
                if(row) {
                    dojo.addClass(td, 'tttTopBorder');
                }
            }
        }
    },
    
    /**
     * Called when the container resizes. Recomputes the size of the game grid
     * and all tile cells. Imperfect because it doesn't account for borders,
     * margins, padding of the table, but good enough.
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
            dojo.style(td, 'fontSize', box.w + 'px');
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
        this.model.fillCell(cell);
    },
    
    _onFillCell: function(cell, player) {
        var td = dojo.query('td', this.containerNode)[cell];
        td.innerHTML = this.labels.player_marks[player];
        dojo.addClass(td, 'tttFilled');
        dojo.removeClass(td, 'tttBlank');
    },
    
    _onHoverCell: function(event) {
        var cell = event.target.getAttribute('data-cell');
        if(cell === null) {
            return;
        }
        var td = event.target;
        var player = this.model.getPlayerTurn();
        td.innerHTML = this.labels.player_marks[player];
    },
    
    _onUnhoverCell: function(event) {
        var cell = event.target.getAttribute('data-cell');
        if(cell === null) {
            return;
        }
        var td = event.target;
        td.innerHTML = this._blank;
    }
});
