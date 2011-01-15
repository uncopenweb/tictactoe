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
        // last known preferences
        this._prefs = {};
        // @todo: first player, alternates between games
        this._player = 0;
        // listen for pause notices from container
        dojo.subscribe('/org/hark/pause', this, '_onPause');
        // listen for preference changes from container
        dojo.subscribe('/org/hark/prefs/response', this, '_onPrefChange');
        // listen for game reset
        dojo.subscribe(ttt.CTRL_RESET_GAME, this, 'resetGame');
        // build an audio instance with caching enabled
        var def = uow.getAudio({defaultCaching: true});
        // when audio is ready, kick off a game reset
        def.addCallback(dojo.hitch(this, '_onAudioReady'));
    },
    
    _onAudioReady: function(audio) {
        this._audio = audio;
        // ask for initial prefs
        dojo.publish('/org/hark/prefs/request');
        // kick off the game
        this.resetGame();
    },
    
    _onPrefChange: function(prefs, name) {
        this._prefs = prefs;
        if(name) {
            var value = prefs[name];
            var slug = name[0].toUpperCase() + name.slice(1)
            this['_on'+slug](value);
        }
    },
    
    _onPause: function(paused) {
        dojo.forEach(this._gameWidgets, function(widget) {
            if(widget.pause) {
                widget.pause(paused);
            }
        });
    },
    
    _onMouseEnabled: function(value) {
        if(this._mctrl) {
            this._mctrl.destroyRecursive();
            this._mctrl = null;
        } else {
            var mctrl = new ttt.GameBoardMouse({model : 'game', view : 'board'});
            this._mctrl = mctrl;
            mctrl.placeAt(dojo.body(), 'last');
            this._gameWidgets.push(mctrl);
        }
    },
    
    _onSpeechEnabled: function(value) {
        if(!value) {
            // just mute it
            this._audio.setProperty({
                name : 'volume', 
                value: 0.0,
                channel: 'tttSpeech'
            });
        } else {
            // restore volume
            this._onSpeechVolume(this._prefs.speechVolume);
        }
    },
    
    _onVolume: function(value) {
        // master volume multiplier against individual volumes
        this._audio.setProperty({
            name : 'volume',
            value: value*this._prefs.speechVolume,
            channel: 'tttSpeech'
        });
        this._audio.setProperty({
            name : 'volume',
            value: value*this._prefs.soundVolume,
            channel: 'tttSound'
        });
    },
    
    _onSpeechVolume: function(value) {
        this._audio.setProperty({
            name : 'volume',
            value: value*this._prefs.volume,
            channel: 'tttSpeech'
        });        
    },
    
    _onSoundVolume: function(value) {
        this._audio.setProperty({
            name : 'volume',
            value: value*this._prefs.volume,
            channel: 'tttSound'
        });        
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
        if(this._prefs.mouseEnabled) {
            var mctrl = new ttt.GameBoardMouse({model : 'game', view : 'board'});
            this._mctrl = mctrl;
            mctrl.placeAt(dojo.body(), 'last');
            this._gameWidgets.push(mctrl);
        }
        var kctrl = new ttt.GameBoardKeys({model : 'game', view : 'board'});
        kctrl.placeAt(dojo.body(), 'last');
        this._gameWidgets.push(kctrl);
    }
});

dojo.ready(function() {
    var app = new ttt.Main();
});