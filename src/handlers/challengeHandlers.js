'use strict'

const STATES = require('./gameStates')
const { checkWord, addLetter } = require('../dictionary/wordFns')

const challengeHandlers = {
  // challenge begun, confirm that a player has been challenged
  'StartChallenge': () => {
    const [unused, challengedPlayer] = getChallengePlayers(this)
    const speechOut = this.t('CHALLENGE', challengedPlayer)

    this.emit(':ask', speechOut, speechOut)
  },
  // if yes, prompt the challenged player for their word
  'AMAZON.YesIntent': () => {
    const [currentPlayer, challengedPlayer] = getChallengePlayers(this)
    const speechOut = this.t('WHAT_CHALLENGED', currentPlayer, challengedPlayer)

    this.emit(':ask', speechOut, speechOut)
  },
  // if no, back to the game
  'AMAZON.NoIntent': () => {
    const speechOut = this.t('NO_CHALLENGE')

    this.handler.state = STATES.PLAY
    this.emit(':tell', speechOut)
    this.emitWithState('PlayerTurn', true)
  },
  // get the challenge word from the challenged player
  'ChallengeWordIntent': () => {
    if (Object.keys(this.attributes) === 0) {
      this.handler.state = STATES.START
      this.emitWithState('StartGame', true)
    }
    // parse word and get variables (names) for the challenge
    const word = getWord(this.event.request.intent)
    const [
      currentPlayer,
      challengedPlayer,
      currentTurn,
      priorTurn
    ] = getChallengePlayers()
    // if a word is parsed, check it using our dict lookup fn, otherwise,
    // prompt the user to say or spell the word again
    if (word) {
      const isValidWord = checkWord(word)
      let speechOut = '',
          letters = ''
      // if the word is valid, the challenger loses the round, otherwise the
      // challenged player loses the round, and either way we update the score
      if (isValidWord) {
        speechOut = `${this.t('CHALLENGE_LOST')}
          ${this.t('CHALLENGE_RESULT', challengedPlayer, currentPlayer)}`
        letters = this.attributes['players'][priorTurn]['letters']

        this.emit(':tell', speechOut)
        this.attributes['players'][priorTurn]['letters'] = addLetter(letters)
      } else {
        speechOut = `${this.t('CHALLENGE_WON')}
          ${this.t('CHALLENGE_RESULT', currentPlayer, challengedPlayer)}`
        letters = this.attributes['players'][currentTurn]['letters']

        this.attributes['players'][currentTurn]['letters'] = addLetter(letters)
      }
      // end the round
      this.emit(':tell', speechOut)
      this.handler.state = STATES.PLAY
      this.emitWithState('RoundOver', true)

    } else {
      const speechOut = this.t('UNHANDLED_WORD')

      this.emit(':ask', speechOut, speechOut)
    }
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
    const huhChallenge = this.t('UNHANDLED')

    this.emit(':ask', huhChallenge, huhChallenge)
  }
}
/**
  @param context the Alexa JS class
  @return array of strings and numbers corresponding to the challenge
  This function computes who the challenger is and who the challenged player
  is based on the turn and returns that information to the handler methods
*/
const getChallengePlayers = game => {
  const players = game.attributes['players']
  const currentTurn = game.attributes['turn']
  const priorTurn = currentTurn - 1 < 0
    ? players.length - 1
    : currentTurn - 1
  const currentPlayer = players[currentTurn]
  const challengedPlayer = players[priorTurn]

  return [currentPlayer, challengedPlayer, currentTurn, priorTurn]
}

/**
  @param JSON Alexa intent object
  @return string the parsed word from the user
*/
const getWord = intent => {
  let intentWord = null,
      challengeWord = null

  if (intent && intent.slot && intent.slot.ChallengeWord && intent.slot.ChallengeWord.value) {
    intentWord = intent.slot.PlayerLetter.value
  }

  if (intentWord) {
    challengeWord = intentWord.match(/\w+/gi).join('').toLowerCase()
  }

  return challengeWord
}

module.exports = challengeHandlers
