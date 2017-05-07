'use strict'

const STATES = require('./gameStates')
// checkWord is the lookup function for our word dictionary
// addLetter simply adds another letter from GHOST to the player score
const { checkWord, addLetter } = require('../dictionary/wordFns')

/**************** HELPER Fn to Handler Fn Collection below ********************/

/**
  @param JSON alexa intent object
  @returns string the parsed letter
  This function attempts to parse the user's provided letter and provide it
  back to the handlers for confirmation and to put it in play
*/
const getPlayerLetter = intent => {
  let intentLetter = null,
      newLetter = null

  if (intent && intent.slot && intent.slot.PlayerLetter && intent.slot.PlayerLetter.value) {
    intentLetter = intent.slot.PlayerLetter.value
  }

  if (intentLetter) {
    newLetter = intentLetter.match(/A-Z/)
      ? intentLetter.match(/A-Z/).toString()
      : null
  }

  return newLetter
}

/********** Game Play Handler Fn Collection for Play Game State ***************/

const playGameHandlers = {
  // start game play
  'PlayTheGame': () => {
    const startUp = this.t('PLAY_START')

    this.emit(':tell', startUp)
    this.emit('PlayerTurn')
  },
  // check whose turn it is and then prompt
  'PlayerTurn': () => {
    const currentTurn = this.attributes['turn']
    const currentPlayer = this.attributes['players'][currentTurn]
    const speechOut = this.t('PLAY_TURN', currentPlayer)

    this.emit(':ask', speechOut, speechOut)
  },
  // parse the user's spoken letter
  'LetterIntent': () => {
    const letter = getPlayerLetter(this.event.request.intent)
    const currentTurn = this.attributes['turn']
    const currentPlayer = this.attributes['players'][currentTurn]
    // confirm the letter once parsed
    if (letter) {
      const speechOut = this.t('CONFIRM_TURN', currentPlayer, letter)

      this.attributes['letters'] += letter
      this.emit(':ask', speechOut, speechOut)
    } else {
      this.emit('Unhandled')
    }
  },
  // process the user's letter once parsed and confirmed by 'LetterIntent' vove
  'AMAZON.YesIntent': () => {
    const currentLetters = this.attributes['letters'].toLowerCase()
    const roundOver = checkWord(currentLetters) // checkWord uses lowercase
    // if user spelled a valid word, then the round ends and scoring is updated
    if (roundOver) {
      const currentTurn = this.attributes['turn']
      const currentPlayer = this.attributes['players'][currentTurn]
      const currentPlayerScore = this.attributes['players'][currentTurn]['score']
      const speechOut = this.t('END_PLAY', currentPlayer, currentLetters)

      this.attributes['players'][currentTurn]['score'] = addLetter(currentPlayerScore)
      this.emit(':tell', speechOut)
      this.emit('RoundOver')
      // otherwise, we continue forward!
    } else {
      const currentLetters = this.attributes['letters']
      const speechOut = this.t('CURRENT_LETTERS', currentLetters)

      if (this.attributes['turn'] >= this.attributes['players'].length - 1) {
        this.attributes['turn'] = 0
      } else {
        this.attributes['turn'] += 1
      }

      this.emit(':tell', speechOut)
      this.emit('PlayerTurn')
    }
  },
  // at the end of the round, we let the players know their scores and kick out
  // any player's who have spelled GHOST
  'RoundOver': () => {
    const players = this.attributes['players']
    let losingPlayerPos = null,
        losingPlayerName = null

    players.forEach((player, idx) => {
      if (player['score'] === 'GHOST') {
        losingPlayerPos = idx
        losingPlayerName = player['name']
      }
    })

    if (typeof losingPlayerPos === 'number') {
      players.splice(losingPlayerPos, 1)
      this.attributes['players'] = players
      this.emit(':tell', this.t('PLAYER_OUT', losingPlayerName))
    }

    this.attributes['letters'] = ''
    this.emit(':tell', this.t('ROUND_OVER'))
    this.emit('PlayerTurn')
  },
  // if the user confirms in the negative after we check the parsed letter,
  // we'll try again
  'AMAZON.NoIntent': () => {
    const speechOut = this.t('REPLAY_TURN')
    const currentLetters = this.attributes['letters']

    this.attributes['letters'] = currentLetters.slice(0, -1)
    this.emit(':ask', speechOut, speechOut)
  },
  // respond to a user prompt to hear the current letters in play
  'CurrentLettersIntent': () => {
    if (Object.keys(this.attributes) === 0) {
      this.handler.state = STATES.START
      this.emitWithState('StartGame', true)
    }

    const letters = this.attributes['letters']
    const speechOut = letters.length > 0
      ? this.t('CURRENT_LETTERS', letters)
      : this.t('NO_LETTERS')

    this.emit(':tell', speechOut)
    this.emit('PlayerTurn')
  },
  // respond to a user prompt to hear the current score for all players
  'CurrentScoreIntent': () => {
    if (Object.keys(this.attributes) === 0) {
      this.handler.state = STATES.START
      this.emitWithState('StartGame', true)
    }

    const players = this.attributes['players']
    const scoreIntro = this.t('CURRENT_SCORE')
    let speechOut = '',
        player = ''

    this.emit(':tell', scoreIntro)

    for (player of players) {
      speechOut = this.t('PLAYER_AND_SCORE', player['name'], player['score'])
      this.emit(':tell', speechOut)
    }

    this.emit('PlayerTurn')
  },
  // initiate a challenge, change state, and move over to those handler methods
  'ChallengeIntent': () => {
    if (Object.keys(this.attributes) === 0) {
      this.handler.state = STATES.START
      this.emitWithState('StartGame', true)
    }

    this.handler.state = STATES.CHALLENGE
    this.emitWithState('StartChallenge', true)
  },

  'AMAZON.HelpIntent': () => {
    this.handler.state = STATES.HELP
    this.emitWithState('HelpUser', true)
  },

  'SessionEndedRequest': () => {
    console.log(`Session ended during set-up. Reason: ${this.event.request.reason}`)
    this.emit(':saveState', true)
  },

  'Unhandled': () => {
    const huhPlay = this.t('UNHANDLED')

    this.emit(':ask', huhPlay, huhPlay)
  }
}

module.exports = playGameHandlers
