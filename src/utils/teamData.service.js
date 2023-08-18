class teamData {
  constructor () {
    this.numRedCards = 0
    this.numBlueCards = 0
  }

  getRandomInt = () => {
    return Math.floor(Math.random() * (2))
  }

  get teamCardNums () {
    const value = this.getRandomInt()
    return {
      blue: value === 0 ? 9 : 8,
      red: value === 0 ? 8 : 9
    }
  }
}

export { teamData }