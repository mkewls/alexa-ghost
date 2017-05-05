'use strict'
// this object can be extended to be i18n compliant
// see, https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
const languageResources = {
  "en": {
    "translation": {
      INTRO: 'Welcome to Ghost, the game where you don\'t want to spell a word!',
      SETUP_OR_INSTRUCT: 'Would you like to hear the instructions?',
      CONTINUE_OLD_GAME: 'A saved game exists. Say play game to continue,'
        + 'or no thanks to start over',
      SETUP_GAME: 'Great, then let\'s start your game. Who\'s your first player?',
      CONTINUE_SETUP: 'Player %s is in the game! Who is your next player?',
      CONTINUE_OR_PLAY: 'Player %s is in the game! You have %s players.'
        + 'Say Add Player for more players or Play Game to get going!',
      MORE_PLAYERS_NEEDED: 'Sorry, but you have %s players. You need at least 2!'
        + 'Please say Add Player to continue or Quit to exit',

      PLAY_START: 'We\re ready to play! At any time, you can ask me for'
        + 'the Current Score, the Current Letters, or for Help.'
        + 'You can also initiate a player challenge by saying Challenge.',
      PLAY_TURN: '%s, it\'s your turn. Please say a letter. or say challenge.',
      CONFIRM_TURN: '%s, you said %s, is that correct?',
      REPLAY_TURN: 'Sorry about that. Please say your letter again',
      CURRENT_LETTERS: 'The current letters are, %s',
      NO_LETTERS: 'There are no letters yet',
      CURRENT_SCORE: 'The current score is, ',
      PLAYER_AND_SCORE: '%s has %s',
      END_PLAY: '%s, you spelled a word! %s. You now have %s.',
      PLAYER_OUT: '%s, you spelled Ghost and are out of the game',
      ROUND_OVER: 'That was fun! Time for a new round.',

      CHALLENGE: '%s, you have been challenged. Is that correct?',
      WHAT_CHALLENGED: 'Got it, %s is challenging %s. What\'s your word?',
      UNHANDLED_WORD: 'Sorry, can you please spell that?',
      CHALLENGE_WON: 'That\'s not a word!',
      CHALLENGE_LOST: 'That is a valid word!',
      CHALLENGE_RESULT: '%s wins the challenge. %s now has %s',

      INSTRUCT: 'Here\'s how to play. The objective of the game is to not spell'
        + 'a complete word of three letters or more. Each player says a letter on her'
        + 'her turn that could spell a dictionary word, but doesn\'t complete that'
        + 'word. The player who provides the letter does not have to disclose'
        + 'the word she is trying to spell, unless challenged',
      INSTRUCT_SCORING: 'If a player spells a dictionary word, I will stop the game'
        + 'to let you know. That player will get a letter from the word Ghost.'
        + 'Once a player spells the full word Ghost, she is out.'
        + 'The last player standing wins!',
      INSTRUCT_CHALLENGES: 'The player who\'s turn follows can challenge the played'
        + 'letter if she doesn\'t believe a valid word is possible. The player who'
        + 'loses the challenge will get a letter from Ghost added to her score.',
      REPLAY: 'Do you want to hear the instructions again?',

      BASIC_HELP: 'You can add a player, get the current score, challenge, or start a new game.'
      + 'Please say one of those commands.',
      MORE_HELP: 'Here are some things you can say,'
        + ' add player.'
        + ' what are the current letters.'
        + ' tell me the score.'
        + ' challenge'
        + ' new game.'
        + ' reset.'
        + ' and exit.',

      RESTART: 'OK, I\'m restarting the game',
      RESET: 'OK. I\'m resetting this round.',
      STOP: 'OK. Whenever you\'re ready, you can restart this game.',
      UNHANDLED: 'Sorry, I didn\'t get that, please say it again.'
    }
  }
}


module.exports = languageResources
