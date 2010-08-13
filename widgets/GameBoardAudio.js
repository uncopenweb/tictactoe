/**
 * Tic-tac-toe game board audio.
 *
 * Copyright UNC Open Web Team 2010. All Rights Reserved.
 */
dojo.provide('ttt.GameBoardAudio');
dojo.require('dojo.i18n');
dojo.require('dijit._Widget');
dojo.requireLocalization('ttt', 'GameBoardView');
dojo.requireLocalization('ttt', 'GameBoardAudio');

dojo.declare('ttt.GameBoardAudio', [dijit._Widget], {
    // reference to the model driving this view
    model: '',
    // reference to audio interface
    audio: null,
    postMixInProperties: function() {
        this.model = dijit.byId(this.model);
        // load labels
        this.labels = dojo.i18n.getLocalization('ttt', 'GameBoardAudio');
        var lbls = dojo.i18n.getLocalization('ttt', 'GameBoardView');
        dojo.mixin(this.labels, lbls);
        // deferred from last fill action
        this._fillSay = null;
        // delayed speech timer
        this._timer = null;
        // lower sound audio
        this.audio.setProperty({name : 'volume', value: 0.1, channel: 'tttSound'});
    },
    
    postCreate: function() {
        // listen to model events
        var a = dojo.subscribe(ttt.MODEL_FILL_CELL, this, '_onFillCell');
        var b = dojo.subscribe(ttt.MODEL_END_GAME, this, '_onEndGame');
        var d = dojo.subscribe(ttt.MODEL_NEXT_TURN, this, '_onNextTurn');
        // listen to controller events
        var c = dojo.subscribe(ttt.CTRL_REGARD_CELL, this, '_onRegardCell');
        // store tokens for later unsubscribe
        this._stoks = [a,b,c, d];
        // announce first turn
        var player = this.model.getPlayerTurn();
        var mark = this.labels.player_marks[player];
        var text = dojo.replace(this.labels.start_game_speech, {mark: mark});
        this.audio.say({text: text, channel : 'tttSpeech'});
    },
    
    uninitialize: function() {
        this._destroyed = true;
        this.audio.stop({channel : 'tttSpeech'});
        this.audio.stop({channel : 'tttSound'});
        dojo.forEach(this._stoks, dojo.unsubscribe);
    },
    
    _onFillCell: function(cell, player) {
        clearTimeout(this._timer);
        // stop previous output
        this.audio.stop({channel : 'tttSpeech'});
        this.audio.stop({channel : 'tttSound'});
        // play scribble sound
        this.audio.play({url : this.labels.fill_cell_sound, channel: 'tttSound'});
        // say player / cell
        var mark = this.labels.player_marks[player];
        var size = this.model.attr('size');
        var row = Math.floor(cell / size);
        var col = cell % size;
        var text = dojo.replace(this.labels.fill_cell_speech, {
            mark: mark, row: row, col: col});
        this._fillSay = this.audio.say({text: text, channel : 'tttSpeech'});
    },
    
    _onNextTurn: function(player) {
        var mark = this.labels.player_marks[player];
        var text = dojo.replace(this.labels.turn_speech, {mark: mark});
        this.audio.say({text: text, channel : 'tttSpeech'});
    },
    
    _onEndGame: function(player, win) {
        // wait for fill cell sound + speech to finish
        this._fillSay.callAfter(dojo.hitch(this, function() {
            clearTimeout(this._timer);
            if(!this.domNode.parentNode) {return;}
            // play win / tie sound
            var url = (player !== null) ? this.labels.win_game_sound : this.labels.tie_game_sound;
            this.audio.play({url : url, channel : 'tttSound'});
            // say winner / tie
            var text = (player !== null) ? this.labels.win_game_speech : this.labels.tie_game_speech;
            var mark = this.labels.player_marks[player];
            text = dojo.replace(text, {mark : mark});
            this.audio.say({text : text, channel : 'tttSpeech'});
            // announce how to restart
            text = this.labels.reset_game_speech;
            this.audio.say({text : text, channel : 'tttSpeech'})
        }));
    },
    
    _onRegardCell: function(newCell, oldCell) {
        clearTimeout(this._timer);
        // stop previous output
        this.audio.stop({channel : 'tttSpeech'});
        this.audio.stop({channel : 'tttSound'});
        // @todo: do this after an idle on the cell after sound is impl
        //   too annoying if immediate
        var player = this.model.getCell(newCell);
        var text, ntext, url;
        var size = this.model.attr('size');
        var row = Math.floor(newCell / size);
        var col = newCell % size;
        // current player turn speech
        var nplayer = this.model.getPlayerTurn();
        var nmark = this.labels.player_marks[nplayer];
        var ntext = dojo.replace(this.labels.turn_speech, {mark: nmark});
        if(player !== undefined) {
            // current cell occupant and location speech
            var mark = this.labels.player_marks[player];
            text = dojo.replace(this.labels.filled_cell_speech, {
                mark: mark, row: row, col: col});
            url = this.labels.filled_cell_sound;
            this.audio.say({text : mark, channel : 'tttSpeech'});
        } else {
            // blank cell location speech
            text = dojo.replace(this.labels.blank_cell_speech, {
                row: row, col: col, turn: nmark});
            url = this.labels.blank_cell_sound;
        }
        // detailed speech delay
        this._timer = setTimeout(dojo.hitch(this, function() {
            this.audio.say({text : text, channel : 'tttSpeech'});
            this.audio.say({text : ntext, channel : 'tttSpeech'});
        }), 500);
        // short sound
        this.audio.play({url : url, channel : 'tttSound'});
    }
});