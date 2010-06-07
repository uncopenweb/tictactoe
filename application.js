/**
 * Startup script for TicTacToe.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.Main');
dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dojo.parser');
dojo.require('ttt.GameBoardView');
dojo.require('ttt.GameTurnView');
dojo.require('ttt.GameBoardModel');
dojo.require('ttt.GameBoardMouse');
dojo.require('ttt.GameBoardKeys');
dojo.require('ttt.GameTopics');

dojo.declare('ttt.Main', null, {
    constructor: function() {
        // force a layout after page load, but outside the load event handler
        // Firefox doesn't layout properly if we do it right away
        //setTimeout(function() {dijit.byId('layout').resize();}, 0);
        // game widgets
        this._gameWidgets = [];
        // reset the game components to start
        this.resetGame();
        // listen for game end to show reset message
        dojo.subscribe(ttt.MODEL_END_GAME, this, '_onEndGame');
    },
    
    resetGame: function() {
        // destroy existing game widgets
        dojo.forEach(this._gameWidgets, dojo, 'destroy');
        this._gameWidgets = [];
        
        // fetch layout widgets in markup
        var layout = dijit.byId('layout');
        var footer = dijit.byId('footer');

        // build all new game components
        var model = new ttt.GameBoardModel({id : 'game'});
        model.placeAt(dojo.body(), 'first');
        this._gameWidgets.push(model);
        var bview = new ttt.GameBoardView({
            model : 'game', 
            region: 'center',
            id : 'board'
        });
        bview.placeAt(layout, 1);
        this._gameWidgets.push(bview);
        var tview = new ttt.GameTurnView({model : 'game', region: 'left'});
        tview.placeAt(footer, 'first');
        this._gameWidgets.push(tview);
        var mctrl = new ttt.GameBoardMouse({model : 'game', view : 'board'});
        mctrl.placeAt(dojo.body(), 'last');
        this._gameWidgets.push(mctrl);
        var kctrl = new ttt.GameBoardKeys({model : 'game', view : 'board'});
        kctrl.placeAt(dojo.body(), 'last');
        this._gameWidgets.push(kctrl);
    },

    _onEndGame: function(player, win) {
        // rebuild game components
    }
});

dojo.ready(function() {
    var app = new ttt.Main();
});