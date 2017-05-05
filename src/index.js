/**
  *  Copyright 2016 Michael E. Williams
  *
  *  Super Important Legalese (i.e., the MIT License) =>
  *
  *  Permission is hereby granted, free of charge, to any person obtaining a
  *  copy of this software and associated documentation files (the "Software"),
  *  to deal in the Software without restriction, including without limitation
  *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
  *  and/or sell copies of the Software, and to permit persons to whom the
  *  Software is furnished to do so, subject to the following conditions:
  *
  *  The above copyright notice and this permission notice shall be included
  *  in all copies or substantial portions of the Software.
  *
  *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  *  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  *  THE SOFTWARE.
  *
  **/

/**
  *           _              _       _    _            _          _
  *          /\ \           / /\    / /\ /\ \         / /\       /\ \
  *         /  \ \         / / /   / / //  \ \       / /  \      \_\ \
  *        / /\ \_\       / /_/   / / // /\ \ \     / / /\ \__   /\__ \
  *       / / /\/_/      / /\ \__/ / // / /\ \ \   / / /\ \___\ / /_ \ \
  *      / / / ______   / /\ \___\/ // / /  \ \_\  \ \ \ \/___// / /\ \ \
  *     / / / /\_____\ / / /\/___/ // / /   / / /   \ \ \     / / /  \/_/
  *    / / /  \/____ // / /   / / // / /   / / /_    \ \ \   / / /
  *   / / /_____/ / // / /   / / // / /___/ / //_/\__/ / /  / / /
  *  / / /______\/ // / /   / / // / /____\/ / \ \/___/ /  /_/ /
  *  \/___________/ \/_/    \/_/ \/_________/   \_____\/   \_\/
  *
  *  Thanks to Patrick Gillespie for creating an ASCII text art generator!
  *  http://patorjk.com
  *
  *  Ghost is a classic word game, where each player provides a single letter in
  *  the aim of spelling a real (dictionary) word, but not completing it. The player
  *  who does complete the word on his or her turn is penalized with a letter from
  *  G-H-O-S-T (just like HORSE in basketball). If a player gets to the T in ghost,
  *  he or she is out! Some nuances, as adapted here:
  *  (1) any words of three or fewer letters do not count toward "completing" a
  *  word for a penalty; and (2) on his or her turn, a player may challenge to
  *  find out if the player on the prior turn has a real word in mind (if not,
  *  the challenged player receives a ghost letter; if so, the challenger
  *  receives a ghost letter.) Enjoy!
  *
  **/

/********** INDEX FILE ************
 *
 **/
'use strict'
// Alexa config/requires
const Alexa = require('alexa-sdk')
const { APP_ID, DYNAMODB_TABLE_NAME } = require('../secrets')
const languageResources = require('./language/languageResources')
// Helper functions for user intent handling
const STATES = require('./handlers/gameStates')
const startGameHandlerFunctions = require('./handlers/startGameHandlers')
const playGameHandlerFunctions = require('./handlers/playGameHandlers')
const challengeHandlerFunctions = require('./handlers/challengeHandlers')
const helpHandlerFunctions = require('./handlers/helpHandlers')
// Handlers: note four are stateful
const newSessionHandlers = require('./handlers/newSessionHandlers')
const startGameHandlers = Alexa.CreateStateHandler(STATES.START, startGameHandlerFunctions)
const playGameHandlers = Alexa.CreateStateHandler(STATES.PLAY, playGameHandlerFunctions)
const challengeHandlers = Alexa.CreateStateHandler(STATES.CHALLENGE, challengeHandlerFunctions)
const helpHandlers = Alexa.CreateStateHandler(STATES.HELP, helpHandlerFunctions)
// Put it all together
exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context)
  alexa.appId = APP_ID
  alexa.resources = languageResources
  alexa.dynamoDBTableName = DYNAMODB_TABLE_NAME
  alexa.registerHandlers(
    newSessionHandlers,
    startGameHandlers,
    playGameHandlers,
    challengeHandlers,
    helpHandlers
  )
  alexa.execute()
}
