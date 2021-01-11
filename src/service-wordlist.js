class wordList {
  constructor () {
    this.wordsArray = ['string', 'soap', 'shampoo', 'potato', 'caramel', 'knife', 'toothpaste', 'rabbit', 'salmon', 'eagle', 'capitol', 'building', 'army', 'weapon', 'cannon', 'leaf', 'summer', 'beach', 'ear', 'palm', 'hand', 'hole', 'mount', 'coal', 'fort', 'tree', 'frisbee', 'basketball', 'tennis', 'shoe', 'ski', 'breakfast', 'coffee', 'meeting', 'photocopier', 'ink', 'bandage', 'muffler', 'employee', 'doctor', 'category', 'game', 'spirit', 'voodoo', 'magic', 'loch-ness', 'critter', 'viking', 'bell', 'ship', 'barrel', 'inspector', 'eyeglasses', 'pipe', 'notepad', 'calligraphy', 'letter', 'smile', 'soup']
    this.assignmentQuantities = {
      numRedSpies: 8,
      numBlueSpies: 9,
      numAssassins:1,
      numCivilians: 7
    }
    this.cardAssignments = []
  }

  getRandomIndex = (array) => {
    return Math.floor(Math.random() * (array.length - 1))
  }

  assignCardRoles = (quantity, role) => {
    const words = [...this.wordsArray]
    for(let i = quantity; i > 0; i--) {
      const index = this.getRandomIndex(words)
      const assignment = {}
      assignment.role = role
      assignment.word = words[index]
      assignment.inPlay = true
      this.cardAssignments.push(assignment)
      words.splice(index, 1)
    }
  }

  assignAllRoles = () => {
    const { numRedSpies, numBlueSpies, numAssassins, numCivilians } = this.assignmentQuantities
    this.assignCardRoles(numRedSpies, 'red')
    this.assignCardRoles(numBlueSpies, 'blue')
    this.assignCardRoles(numAssassins, 'assassin')
    this.assignCardRoles(numCivilians, 'civilian')
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

  get cardList () {
    this.assignAllRoles()
    return this.randomizeWordOrder()
  }
}

export { wordList }

// export default wordList