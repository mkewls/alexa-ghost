'use strict'

const STATES = require('./gameStates')

/**************** HELPER Fn to Handler Fn Collection below ********************/

/**
  @param JSON intent object
  @returns string, a player's name
  This function takes the input provided by the user and parses whether Alexa
  validly captured a name as part of the 'AddPlayerIntent' method
*/
const getPlayerName = intent => {
  const slotFilled = intent && intent.slots && intent.slots.PlayerName && intent.slots.PlayerName.value
  // error test
  if (!slotFilled) {
    return null
  }
  const recognizedPlayerName = intent.slots.PlayerName.value
  // if first name, then assign to return value, else parse first name
  const split = recognizedPlayerName.indexOf(' ')
  const newName = split < 0 ? recognizedPlayerName : recognizedPlayerName.slice(0, split)
  // error test
  if (newName === 'player' || newName === 'players') {
    return null
  }

  return newName
}

/************ Game Setup Handler Fn Collection for Start Game State ***********/

const startGameHandlers = {
  // If no saved game exists, prompt to hear instructions, else prompt to
  // continue saved game or start over
  'StartGame': () => {
    if (Object.keys(this.attributes).length === 0) {
      const instructions = this.t('SETUP_OR_INSTRUCT')

      this.emit(':ask', instructions, instructions)
    } else {
      const resetOrPlay = this.t('CONTINUE_OR_PLAY')

      this.emit(':ask', resetOrPlay, resetOrPlay)
    }
  },
  // 'No' means set-up a new game for any user prompt
  'AMAZON.NoIntent': () => {
    const startSetup = this.t('SETUP_GAME')
    // clear any saved game
    this.attributes = {
      'players': [],
      'letters': '',
      'turn': 0
    }
    this.emit(':ask', startSetup, startSetup)
  },
  // 'Yes' means instructions
  'AMAZON.YesIntent': () => {
    const instructOne = this.t('INSTRUCT')
    const instructTwo = this.t('INSTRUCT_SCORING')
    const instructThree = this.t('INSTRUCT_CHALLENGES')
    const repeatThat = this.t('REPLAY')

    this.emit(':tell', instructOne)
    this.emit(':tell', instructTwo)
    this.emit(':tell', instructThree)
    this.emit(':ask', repeatThat, repeatThat)
  },
  // check if game setup has started, then add players if given a name
  'AddPlayerIntent': () => {
    if (Object.keys(this.attributes) === 0) {
      this.handler.state = STATES.START
      this.emitWithState('StartGame', true)
    }

    const playerName = getPlayerName(this.event.request.intent)

    if (!playerName) {
      const tryAgain = this.t('UNHANDLED')
      this.emit(':ask', tryAgain, tryAgain)
    } else {
      const players = this.attributes['players']
      players.push({ 'name': playerName, 'score': '' })

      const speechOut = players.length < 2
        ? this.t('CONTINUE_SETUP', playerName)
        : this.t('CONTINUE_OR_PLAY', playerName, players.length)
      this.emit(':ask', speechOut, speechOut)
    }
  },
  // move over to the play game state and its handlers
  'PlayGameIntent': () => {
    if (Object.keys(this.attributes) === 0) {
      this.handler.state = STATES.START
      this.emitWithState('StartGame', true)
    }

    const playerCount = this.attributes['players'].length
    if (playerCount >= 2) {
      this.handler.state = STATES.PLAY
      this.emitWithState('PlayTheGame', true)
    } else {
      const morePlayers = this.t('MORE_PLAYERS_NEEDED')
      this.emit(':ask', morePlayers, morePlayers)
    }
  },

  'AMAZON.HelpIntent': () => {
    this.handler.state = STATES.HELP
    this.emitWithState('HelpUser', true)
  },

  'SessionEndedRequest': () => {
    console.log(`Session ended during set-up. Reason: ${this.event.request.reason}`)
  },

  'Unhandled': () => {
    const huhStart = this.t('UNHANDLED')
    this.emit(':ask', huhStart, huhStart)
  }
}

module.exports = startGameHandlers
