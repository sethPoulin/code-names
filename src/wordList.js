const wordsArray = ['string', 'soap', 'shampoo', 'potato', 'caramel', 'knife', 'toothpaste', 'rabbit', 'salmon', 'eagle', 'capitol', 'building', 'army', 'weapon', 'cannon', 'leaf', 'summer', 'beach', 'ear', 'palm', 'hand', 'hole', 'mount', 'coal', 'fort', 'tree', 'frisbee', 'basketball', 'tennis', 'shoe', 'ski', 'breakfast', 'coffee', 'meeting', 'photocopier', 'ink', 'bandage', 'muffler', 'employee', 'doctor', 'category', 'game', 'spirit', 'voodoo', 'magic', 'loch-ness', 'critter', 'viking', 'bell', 'ship', 'barrel', 'inspector', 'eyeglasses', 'pipe', 'notepad', 'calligraphy', 'letter', 'smile', 'soup']

const cardsOnGrid = 25

const assignmentQuantities = {
  redSpies: 8,
  blueSpies: 9,
  assassins:1,
  civilians: 7
}
const words = [...wordsArray]

const cardAssignments = []

const getRandomIndex = array => {
  return Math.floor(Math.random() * (array.length - 1))
}

const assignCardRoles = (quantity, role) => {
  for(let i = quantity; i > 0; i--) {
    const index = getRandomIndex(words)
    const assignment = {}
    assignment[words[index]] = role
    cardAssignments.push(assignment)
    words.splice(index, 1)
  }
}

const { redSpies, blueSpies, assassins, civilians } = assignmentQuantities
const assignAllRoles = () => {
  assignCardRoles(redSpies, 'red')
  assignCardRoles(blueSpies, 'blue')
  assignCardRoles(assassins, 'assassin')
  assignCardRoles(civilians, 'civilian')
}

assignAllRoles()
console.log(cardAssignments)

const randomizeWordOrder = () => {
  const cardOrder = []
  const cardAssignmentsCopy = [...cardAssignments]
  for(let i = cardAssignments.length; i > 0; i--) {
    const index = getRandomIndex(cardAssignmentsCopy)
    const item = cardAssignmentsCopy[index]
    cardOrder.push(item)
    cardAssignmentsCopy.splice(index, 1)
  }
  return cardOrder
}
console.log(randomizeWordOrder())

// export default wordList