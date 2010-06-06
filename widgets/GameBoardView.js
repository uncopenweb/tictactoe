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
dojo.require('ttt.GameTopics');
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
        dojo.subscribe(ttt.MODEL_FILL_CELL, this, '_onFillCell');
        // listen to controller events
        dojo.subscribe(ttt.CTRL_REGARDL_CELL, this, '_onRegardCell');
        // blank cell char
        this._blank = '&nbsp;';
        // board labels
        this.labels = dojo.i18n.getLocalization('ttt', 'GameBoardView');
        // border sizes between cells
        this._offset = {w : 0, h : 0};
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
                if(col) {
                    dojo.addClass(td, 'tttLeftBorder');
                }
                if(row) {
                    dojo.addClass(td, 'tttTopBorder');
                }
            }
        }
        // save computed style border properties of bottom, right cell
        var css = dojo.getComputedStyle(td);
        this._offset.w = parseInt(css['border-left-width']);
        this._offset.h = parseInt(css['border-top-width']);
    },
    
    /**
     * Called when the container resizes. Recomputes the size of the game grid
     * and all tile cells. Imperfect because it doesn't account for margins
     * and padding of the table, but good enough.
     *
     * @param size Box object
     */
    resize: function() {
        var size = dojo.contentBox(this.domNode);
        var cols = this.model.attr('size');
        // bound cells by width
        var cs = (size.w - cols * this._offset.w) / cols;
        if(cs * (cols+1) > (size.h - cols * this._offset.h)) {
            // bound by height
            cs = (size.h - cols * this._offset.h) / cols;
        }
        
        // resize all the cells
        var box = {w: cs, h: cs};
        dojo.query('td', this.containerNode).forEach(function(td) {
            dojo.contentBox(td, box);
            dojo.style(td, 'fontSize', (box.w-10) + 'px');
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
     * Gets the DOM nodes representing cells in this view.
     */
    getCellNodes: function() {
        return dojo.query('td', this.containerNode);
    },
    
    /**
     * Called when a cell is filled in the model.
     */
    _onFillCell: function(cell, player) {
        var td = this.getCellNodes()[cell];
        td.innerHTML = this.labels.player_marks[player];
        dojo.addClass(td, 'tttFilled');
        dojo.removeClass(td, 'tttBlank');
    },
    
    /**
     * Called when the player regards / focuses / activates a cell.
     */
    _onRegardCell: function(newCell, oldCell) {
        var cells = this.getCellNodes();
        var node = cells[newCell];
        node.innerHTML = this.labels.player_marks[player];
        dojo.toggleClass(node, 'tttRegarded');
        node = cells[oldCell];
        node.innerHTML = this._blank;
        dojo.toggleClass(node, 'tttRegarded');
    }
});
