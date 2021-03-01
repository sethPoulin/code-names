import originalWordsList from '@/assets/original-words.txt'
import duetWordsList from '@/assets/duet.txt'
import undercoverWordsList from '@/assets/undercover.txt'

class wordList {
  constructor (winner, remainingWordsArr, wordsArr) {
    if (remainingWordsArr) {
      this.wordsArray = remainingWordsArr
    } else {
      const [duetWords, originalWords, undercoverWords] = [duetWordsList, originalWordsList, undercoverWordsList].map(list => {
        return list.split('\n')
      })
      const newWordList = []
      const wordlistOptions = {
        duet: duetWords,
        original: originalWords,
        undercover: undercoverWords
      }
      for (let list in wordlistOptions) {
        if (wordsArr.indexOf(list) > -1) {
          newWordList.push(...wordlistOptions[list])
        }
      }
      this.wordsArray = newWordList
    }
    this.cardAssignments = []
    this.winner = winner
  }

  getRandomIndex = (array) => {
    return Math.floor(Math.random() * (array.length - 1))
  }

  assignCardRoles = (quantity, role) => {
    for(let i = quantity; i > 0; i--) {
      const index = this.getRandomIndex(this.wordsArray)
      const assignment = {}
      assignment.role = role
      assignment.word = this.wordsArray[index]
      assignment.solved = false
      this.cardAssignments.push(assignment)
      this.wordsArray.splice(index, 1)
    }
  }

  getRandomInt = () => {
    return Math.floor(Math.random() * (2))
  }

  assignCardNums () {
    if (this.winner) {
      return this.winner === 'red' ? { numRedSpies: 9, numBlueSpies: 8 } : { numBlueSpies: 9, numRedSpies: 8}
    }
    const value = this.getRandomInt()
    return {
      numBlueSpies: value === 0 ? 9 : 8,
      numRedSpies: value === 0 ? 8 : 9
    }
  }

  assignAllRoles = () => {
    const { numRedSpies, numBlueSpies } = this.assignCardNums()
    this.assignCardRoles(numRedSpies, 'red')
    this.assignCardRoles(numBlueSpies, 'blue')
    this.assignCardRoles(1, 'assassin')
    this.assignCardRoles(7, 'civilian')
  }

  randomizeWordOrder = () => {
    const cardOrder = []
    const cardAssignmentsCopy = [...this.cardAssignments]
    for(let i = this.cardAssignments.length; i > 0; i--) {
      const index = this.getRandomIndex(cardAssignmentsCopy)
      const item = cardAssignmentsCopy[index]
      cardOrder.push(item)
      cardAssignmentsCopy.splice(index, 1)
    }
    return cardOrder
  }

  get remainingWords () {
    return this.wordsArray
  }

  get cardList () {
    this.assignCardNums()
    this.assignAllRoles()
    return this.randomizeWordOrder()
  }
}

export { wordList }