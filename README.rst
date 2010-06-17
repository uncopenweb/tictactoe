===========
Tic-Tac-Toe
===========

:Author: Peter Parente
:Description: Self-voicing tic-tac-toe game using HTML5 speech and sound. Meant as a sample for UNC Open Web developers and minor fun for kids with visual impairments. Requires two human players and has no AI or settings. 

Design notes
============

The game follows a loose model-view-controller separation of widgets. The GameBoardModel tracks the current player's turn, the state of the game board cells, and whether the game is over or not. The model publishes events that GameBoardView, GameBoardAudio, and GameTurnView use to show and speak the progress of the game to the user. The GameBoardKeys and GameBoardMouse classes drive the model based on input from the user. These classes also publish events that the view widgets use to give feedback based on user actions. 

Attribution
===========

Samples used from Freesound, licensed under a `Creative Commons Sampling Plus 1.0 License`__.

* By Robinhood76 (http://www.freesound.org/usersViewSingle.php?id=321967) 00504 brass fanfare 4.wav (http://www.freesound.org/samplesViewSingle.php?id=62176)
* By acclivity (http://www.freesound.org/usersViewSingle.php?id=37876) CloseEncounterSax2.wav (http://www.freesound.org/samplesViewSingle.php?id=26084)
* By altemark (http://www.freesound.org/usersViewSingle.php?id=19852) fm7timp.wav (http://www.freesound.org/samplesViewSingle.php?id=26431)
* By Hell's Sound Guy (http://www.freesound.org/usersViewSingle.php?id=33253) CHAMPAGNE FLUKE .wav (http://www.freesound.org/samplesViewSingle.php?id=15285)
* By indigosierra (http://www.freesound.org/usersViewSingle.php?id=1316563) scribble.mp3 (http://www.freesound.org/samplesViewSingle.php?id=82610)

__ http://creativecommons.org/licenses/sampling+/1.0/