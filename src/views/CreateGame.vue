<template>
  <div>
    <form action="">
      <label for="game">Enter a name for your game: </label>
      <input v-model="gameName" type="text" id="game" placeholder="Ex: my-super-fun-game">
    </form>
    <button @click="setupGame()">Create new game</button>
    <p>{{ data.username }}</p>
  </div>
</template>


<script>
import { db } from '@/db.js'
import { wordList } from '@/utils/wordlist.service.js'
// import { teamData } from '@/utils/teamData.service.js'

export default {
  name: 'recent',
  data() {
    return {
      gameName: '',
      data: '',
      gameId: undefined,
      cardList: undefined
      // redCards: undefined,
      // blueCards: undefined
    }
  },

  created: function () {
    const list = new wordList
    this.cardList = list.cardList
    // const teamCards = new teamData
    // const teamCardNums = teamCards.teamCardNums
    // this.redCards = teamCardNums.red
    // this.blueCards = teamCardNums.blue
  },
  computed: {
    startingTurn () {
      return this.getNumCards('red') === 9 ? 'red' : 'blue'
    }
  },
  methods: {
    getNumCards (team) {
      const cards = this.cardList.filter(card => {
        return card.role === team
      })
      return cards.length
    },
    addProp: function (prop) {
      const updates = { username: prop}
      return db.ref(this.gameId).update(updates)
    },
    generateHash: function () {
      const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
      const numOfChars = 4
      const hash = []
      for ( var i = 0; i < numOfChars; i++ ) {
        hash.push(chars.charAt(Math.floor(Math.random() * (chars.length -1))))
      }
      return hash.join('')
    },
    setGameId: function () {
      const hash = this.generateHash()
      const gameId = this.gameName + '-' + hash
      this.gameId = gameId
    },
    setupGame: function () {
      this.setGameId()
      db.ref(this.gameId).set({
        // players: [{dummy : 'dummy'}],
        cardList: this.cardList,
        teamTurn: this.startingTurn
        // redCardsRemaining: this.redCards,
        // blueCardsRemaining: this.blueCards
      })
      // this.getGameInfo()
      const path = '/play/' + this.gameId
      this.$router.push({ path })
    }
  }
}
// reference: https://firebase.google.com/docs/database/web/read-and-write
</script>

