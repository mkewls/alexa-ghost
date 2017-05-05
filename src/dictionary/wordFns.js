/**
  @name addLetter
  @param string
  @returns string

  The 'addLetter' helper function takes a player's current score
  (e.g., 'GHO') and adds the next letter in GHOST to it.

  Assumes valid input from DynamoDB database cell, i.e., a string
  that is not already GHOST (which is checked to end game in the
  referring method from playGameHandlers)
*/
const addLetter = partialGHOST => {
  const GHOST = ['G','H','O','S','T']
  const letterToAddIdx = partialGHOST === '' ? 0 : partialGHOST.length

  return partialGHOST + GHOST[letterToAddIdx]
}

/**
  @name checkWord
  @param string
  @returns bool
  @depends on trieDict

  The 'checkWord' helper function is a workhorse in thise code. It
  is refered from several methods to ensure the player has either
  not spelled a word (playGameHandlers) or is attempting to spell
  a valid word (challengeHandlers).

  (1) Sets the root/parent node of the trie dictionary using the first
    letter of the word
  (2) Iterates through the word, consuming it from the front, resetting
    the parent node and checking for a '$' char in the children nodes,
    which indicates the end of a valid word
  (3) If valid word is found during iteration, returns out true, else
    returns false after exiting loop
  NB: word must be at least 3 letters to be valid; checked at outset
  and during iteration
*/
const checkWord = word => {
  const wordLen = word.length

  if (wordLen < 4) {
    return false
  }

  let letter = word[0],
      shrinkingWord = word,
      wordLenPosition = 1
  const trieDict = require(`./tries/${letter}-trie.json`)
  let trieChildren = trieDict[letter]

  while(wordLenPosition <= wordLen) {
    const childrenKeys = Object.keys(trieChildren)

    if (wordLenPosition >= 4 && childrenKeys.includes('$')) {
      return true
    }

    shrinkingWord = shrinkingWord.length > 1
      ? shrinkingWord.slice(1)
      : shrinkingWord
    letter = shrinkingWord[0]

    if (childrenKeys.includes(letter)) {
      trieChildren = trieChildren[letter]
      wordLenPosition += 1
    } else {
      return false
    }
  }

  return false
}

module.exports = { addLetter, checkWord }
