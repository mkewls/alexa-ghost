'use strict'

const STATES = require('./gameStates')

/*********** New Session Handler Fn Collection at Skill Launch ****************/

const newSessionHandlers = {
  // create new session at skill launch, then switch to game setup (START)
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
