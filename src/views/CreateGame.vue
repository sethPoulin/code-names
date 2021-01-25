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
import { teamData } from '@/utils/teamData.service.js'

export default {
  name: 'recent',
  data() {
    return {
      gameName: '',
      data: '',
      gameId: undefined,
      cardList: undefined,
      redCards: undefined,
      blueCards: undefined
    }
  },

  created: function () {
    const list = new wordList
    this.cardList = list.cardList
    const teamCards = new teamData
    const teamCardNums = teamCards.teamCardNums
    this.redCards = teamCardNums.red
    this.blueCards = teamCardNums.blue
  },
  computed: {
    startingTurn () {
      return this.redCards === 9 ? 'red' : 'blue'
    }
  },
  methods: {
    addProp: function (prop) {
      // From the docs:
      // Write the new post's data simultaneously in the posts list and the user's post list.
      // var updates = {};
      // updates['/posts/' + newPostKey] = postData;
      // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
      // return firebase.database().ref().update(updates);
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
      console.log(this.gameId)
    },
    // add to createGame the whose turn is it property
    setupGame: function () {
      this.setGameId()
      db.ref(this.gameId).set({
        players: [{dummy : 'dummy'}],
        cardList: this.cardList,
        teamTurn: this.startingTurn,
        redCardsRemaining: this.redCards,
        blueCardsRemaining: this.blueCards
      })
      // this.getGameInfo()
      const path = '/play/' + this.gameId
      this.$router.push({ path })
    }
  }
}
// reference: https://firebase.google.com/docs/database/web/read-and-write
</script>

