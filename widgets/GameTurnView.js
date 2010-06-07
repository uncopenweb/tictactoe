/**
 * Tic-tac-toe game board view.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameTurnView');
dojo.require('dojo.i18n');
dojo.require('dijit._Widget');
dojo.require('dijit._Contained');
dojo.require('ttt.GameTopics');
dojo.requireLocalization('ttt', 'GameTurnView');
dojo.requireLocalization('ttt', 'GameBoardView');

dojo.declare('ttt.GameTurnView', [dijit._Widget, dijit._Contained], {
    // reference to the model driving this view
    model: '',
    /**
     * Called after the attributes passed to the constructor are available.
     */
    postMixInProperties: function() {
        this.model = dijit.byId(this.model);
        // board and turn labels
        this.labels = dojo.i18n.getLocalization('ttt', 'GameTurnView');
        var lbls = dojo.i18n.getLocalization('ttt', 'GameBoardView');
        dojo.mixin(this.labels, lbls);
    },
    
    postCreate: function() {
        this._onNextTurn();
        // listen to model events 
        var a = dojo.subscribe(ttt.MODEL_NEXT_TURN, this, '_onNextTurn');
        var b = dojo.subscribe(ttt.MODEL_END_GAME, this, '_onEndGame');
        this._stoks = [a, b];        
    },
    
    uninitialize: function() {
        dojo.forEach(this._stoks, dojo.unsubscribe);
    },
    
    _onNextTurn: function(player) {
        player = player || this.model.getPlayerTurn();
        var mark = this.labels.player_marks[player];
        var txt = dojo.replace(this.labels.turn_label, {player : mark});
        this.domNode.innerHTML = txt;
    },
    
    _onEndGame: function(player) {
        if(player !== null) {
            var mark = this.labels.player_marks[player];
            var txt = dojo.replace(this.labels.win_label, {player : mark});
        } else {
            var txt = this.labels.tie_label;
        }
        this.domNode.innerHTML = txt;
    }
});