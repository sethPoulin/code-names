<template>
  <div>
    <h1>CODE NAMES</h1>
    <form v-on:submit.prevent="setupGame()">
      <label for="game">Enter a name for your game: </label>
      <p v-if="!inputIsValid" class="error-message">Please enter a name with at least 3 characters</p>
      <input v-model="gameName" type="text" id="game" placeholder="Ex: kowabunga">
    </form>
    <base-button @click.native="setupGame()">Create new game</base-button>
    <p>{{ data.username }}</p>
  </div>
</template>


<script>
import { db } from '@/db.js'
import { wordList } from '@/utils/wordlist.service.js'
import BaseButton from '@/components/BaseButton.vue'
// import { teamData } from '@/utils/teamData.service.js'

export default {
  name: 'recent',
  components: {
    BaseButton
  },
  data() {
    return {
      gameName: '',
      data: '',
      gameId: undefined,
      cardList: undefined,
      inputIsValid: false
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

<style lang="stylus" scoped>

  * 
   margin-top: 0

  h1 
    margin-top: 8rem
    font-size: 3rem
    letter-spacing: 0.3rem


  h1,
  label
    color: rgb(198, 198, 198)

  label 
    font-weight: bold
    letter-spacing: 0.1rem
  
  label,
  input 
    display: block
    margin: 0 auto
    margin-bottom: 2rem
    font-size: 1.6rem

  input 
    padding: 0.8rem 1.2rem 
    text-align: center 
    color: rgb(64, 64, 64)
    border-radius: 8px

  button 
    text-transform: uppercase
    font-weight: bold
    font-size: 1.1rem

  .error-message 
    color: rgba(210, 67, 51, 1)
    font-size: 1.4rem
    font-weight: bold
    background: white
    display: inline-block 
    text-align: center
    border-radius: 8px
    padding: 0.4rem 1.2rem

</style>

