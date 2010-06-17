/**
 * Startup script for TicTacToe.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.Main');
dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dojo.parser');
dojo.require('ttt.GameBoardAudio');
dojo.require('ttt.GameBoardView');
dojo.require('ttt.GameTurnView');
dojo.require('ttt.GameBoardModel');
dojo.require('ttt.GameBoardMouse');
dojo.require('ttt.GameBoardKeys');
dojo.require('ttt.GameTopics');

dojo.declare('ttt.Main', null, {
    constructor: function() {
        // audio api
        this._audio = null;
        // game widgets
        this._gameWidgets = [];
        // @todo: first player, alternates between games
        this._player = 0;
        // listen for game reset
        dojo.subscribe(ttt.CTRL_RESET_GAME, this, 'resetGame');
        // build an audio instance with caching enabled
        var def = uow.getAudio({defaultCaching: true});
        // when audio is ready, kick off a game reset
        def.addCallback(dojo.hitch(this, '_onAudioReady'));
    },
    
    _onAudioReady: function(audio) {
        this._audio = audio;
        // kick off the game
        this.resetGame();
    },
    
    resetGame: function() {
        // destroy existing game widgets
        dojo.forEach(this._gameWidgets, function(widget) {
            widget.destroyRecursive();
        });
        this._gameWidgets = [];
        
        // fetch layout widgets in markup
        var layout = dijit.byId('layout');

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
        var tview = new ttt.GameTurnView({model : 'game', region: 'bottom'});
        tview.placeAt(layout, 'last');
        this._gameWidgets.push(tview);
        var aview = new ttt.GameBoardAudio({model : 'game', audio: this._audio});
        aview.placeAt(dojo.body(), 'last');
        this._gameWidgets.push(aview);
        var mctrl = new ttt.GameBoardMouse({model : 'game', view : 'board'});
        mctrl.placeAt(dojo.body(), 'last');
        this._gameWidgets.push(mctrl);
        var kctrl = new ttt.GameBoardKeys({model : 'game', view : 'board'});
        kctrl.placeAt(dojo.body(), 'last');
        this._gameWidgets.push(kctrl);
    }
});

dojo.ready(function() {
    var app = new ttt.Main();
});