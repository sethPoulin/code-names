<template>
  <div>
    <h1>CODE NAMES</h1>
    <form v-on:submit.prevent="setupGame()">
      <label for="game">Please enter a name for your game: </label>
      <p v-if="checkErrors && errorNumberOfLetters" class="error-message">Please choose a name with at least 4 letters</p>
      <p v-if="checkErrors && errorUsesSymbols" class="error-message">Please use only letters in your name</p>
      <input v-model="gameName" type="text" id="game" placeholder="Ex: kowabunga">
    </form>
    <base-button 
      @click.native="setupGame()"
      :disabled="!inputIsValid && checkErrors" 
      :class="{'no-cursor' : !inputIsValid && checkErrors}">
      Create new game</base-button>
    <p>{{ data.username }}</p>
  </div>
</template>


<script>
import { db } from '@/db.js'
import { wordList } from '@/utils/wordlist.service.js'
import BaseButton from '@/components/BaseButton.vue'
// import { teamData } from '@/utils/teamData.service.js'
// 1. When user clicks create game, run checks and create a watcher
// 2. run checks() creates a watcher to run whenever user changes input

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
      checkErrors: false
    }
  },

  created: function () {
    const list = new wordList
    this.cardList = list.cardList
  },
  computed: {
    startingTurn () {
      return this.getNumCards('red') === 9 ? 'red' : 'blue'
    },
    inputIsValid () {
      return this.errorNumberOfLetters === false && this.errorUsesSymbols === false
    },
    errorNumberOfLetters () {
      return this.gameName.trim().length < 4
    },
    errorUsesSymbols () {
      if (this.gameName.length < 2) return
      const validChars = 'abcdefghijklmnopqrstuvwxyz'
      const gameLetters = this.gameName.split('')
      const invalidChars = gameLetters.filter(letter => {
        return validChars.indexOf(letter) === -1
      })
      return invalidChars.length > 0
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
      this.validateInput()
      if (this.errorNumberOfLetters || this.errorUsesSymbols) return
      this.setGameId()
      db.ref(this.gameId).set({
        cardList: this.cardList,
        teamTurn: this.startingTurn
      })
      const path = '/play/' + this.gameId
      this.$router.push({ path })
    },
    validateInput () {
      this.checkErrors = true
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
    max-width: 31rem
    color: rgba(210, 67, 51, 1)
    font-size: 1.4rem
    font-weight: bold
    background: white
    display: block 
    margin: 0 auto
    border-radius: 8px
    padding: 0.4rem 1.2rem
    margin-bottom: 0.7rem

</style>

