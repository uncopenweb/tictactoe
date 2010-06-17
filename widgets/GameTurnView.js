/**
 * Tic-tac-toe game board view.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameTurnView');
dojo.require('dojo.i18n');
dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('ttt.GameTopics');
dojo.requireLocalization('ttt', 'GameTurnView');
dojo.requireLocalization('ttt', 'GameBoardView');

dojo.declare('ttt.GameTurnView', dijit.layout.BorderContainer, {
    // reference to the model driving this view
    model: '',
    // no gutters
    gutters: false,
    /**
     * Called after the attributes passed to the constructor are available.
     */
    postMixInProperties: function() {
        this.inherited(arguments);
        this.model = dijit.byId(this.model);
        // board and turn labels
        this.labels = dojo.i18n.getLocalization('ttt', 'GameTurnView');
        var lbls = dojo.i18n.getLocalization('ttt', 'GameBoardView');
        dojo.mixin(this.labels, lbls);
        // track if the game is over
        this._ended = false;
    },
    
    postCreate: function() {
        this.inherited(arguments);
        // add custom classname
        dojo.addClass(this.domNode, 'tttGameTurnView');
        
        // build panes
        this.leftPane = new dijit.layout.ContentPane({region: 'left'});
        this.addChild(this.leftPane);
        this.rightPane = new dijit.layout.ContentPane({region: 'right'});
        this.addChild(this.rightPane);
        
        this._onNextTurn();
        // listen to model events 
        var a = dojo.subscribe(ttt.MODEL_NEXT_TURN, this, '_onNextTurn');
        var b = dojo.subscribe(ttt.MODEL_END_GAME, this, '_onEndGame');
        this._stoks = [a, b];        
    },
    
    uninitialize: function() {
        this.inherited(arguments);
        dojo.forEach(this._stoks, dojo.unsubscribe);
    },
    
    _onNextTurn: function(player) {
        player = player || this.model.getPlayerTurn();
        var mark = this.labels.player_marks[player];
        var txt = dojo.replace(this.labels.turn_label, {player : mark});
        this.leftPane.attr('content', txt);
    },
    
    _onEndGame: function(player) {
        var txt;
        if(player !== null) {
            var mark = this.labels.player_marks[player];
            txt = dojo.replace(this.labels.win_label, {player : mark});
        } else {
            txt = this.labels.tie_label;
        }
        this.leftPane.attr('content', txt);
        this.rightPane.attr('content', this.labels.reset_game_label);
    }
});