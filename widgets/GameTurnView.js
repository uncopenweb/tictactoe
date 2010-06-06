/**
 * Tic-tac-toe game board view.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameTurnView');
dojo.require('dojo.i18n');
dojo.require('dijit._Widget');
dojo.require('dijit._Contained');
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
        // listen to model events
        this.connect(this.model, 'onNextTurn', '_onNextTurn');
        this.connect(this.model, 'onGameEnd', '_onGameEnd');
        // board and turn labels
        this.labels = dojo.i18n.getLocalization('ttt', 'GameTurnView');
        var lbls = dojo.i18n.getLocalization('ttt', 'GameBoardView');
        dojo.mixin(this.labels, lbls);
    },
    
    postCreate: function() {
        this._onNextTurn();
    },
    
    _onNextTurn: function(player) {
        player = player || this.model.getPlayerTurn();
        var mark = this.labels.player_marks[player];
        var txt = dojo.replace(this.labels.turn_label, {player : mark});
        this.domNode.innerHTML = txt;
    },
    
    _onGameEnd: function(player) {
        if(player !== undefined) {
            var mark = this.labels.player_marks[player];
            var txt = dojo.replace(this.labels.win_label, {player : mark});
        } else {
            var txt = this.labels.tie_label;
        }
        this.domNode.innerHTML = txt;
    }
});