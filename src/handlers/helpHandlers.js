'use strict'

const helpHandlers = {
  'HelpUser': () => {
    const speechOut = this.t('BASIC_HELP')
    const speechAgain = this.t('MORE_HELP')

    this.emit(':ask', speechOut, speechAgain)
  },

  'AMAZON.HelpIntent': () => {
    this.emit('HelpUser')
  },

  'SessionEndedRequest': () => {
    console.log(`Session ended during set-up. Reason: ${this.event.request.reason}`)
  },

  'Unhandled': () => {
    const huhHelp = this.t('UNHANDLED')
    this.emit(':ask', huhHelp, huhHelp)
  }
}

module.exports = helpHandlers
