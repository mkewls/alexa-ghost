'use strict'

const STATES = require('./gameStates')

// note that 'this' context is the Alexa skills JS class
const newSessionHandlers = {
  // create new session
  'LaunchRequest': () => {
    const welcome = this.t('INTRO')
    this.handler.state = STATES.START
    this.emit(':tell', welcome)
    this.emitWithState('StartGame', true)
  },

  'AMAZON.StartOverIntent': () => {
    this.handler.state = STATES.START
    this.emitWithState('StartGame', true)
  },

  'AMAZON.HelpIntent': () => {
    this.handler.state = STATES.HELP
    this.emitWithState('HelpUser', true)
  },

  'Unhandled': () => {
    const huh = this.t('UNHANDLED_START')
    this.emit(':ask', huh, huh)
  }
}

module.exports = newSessionHandlers
