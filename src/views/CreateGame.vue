<template>
  <div>
    <h1>CODE NAMES</h1>
    <form v-on:submit.prevent="setupGame()">
      <label for="game">Please enter a name for your game: </label>
      <p v-if="checkErrors && errorNumberOfLetters" class="error-message">Please choose a name with at least 4 letters</p>
      <p v-if="checkErrors && errorUsesSymbols" class="error-message">Please use only letters in your name</p>
      <input v-model="gameName" type="text" id="game" placeholder="Ex: kowabunga">
      <fieldset>
        <legend>Select the word lists you'd like to include:</legend>
        <div class="word-option">
          <label for="standard">Standard words</label>
          <input type="checkbox" id="standard" value="original"  v-model="wordlists">
        </div>
        <div class="word-option">
          <label for="duet">Duet words</label>
          <input type="checkbox" id="duet" value="duet" v-model="wordlists">
        </div>
        <div class="word-option">
          <label for="undercover">Undercover words (NSFW)</label>
          <input type="checkbox" id="undercover" value="undercover" v-model="wordlists">
        </div>
      </fieldset>
      <base-button 
        @click="setupGame()"
        :disabled="!inputIsValid && checkErrors" 
        :class="{'no-cursor' : !inputIsValid && checkErrors}">
        Create new game
      </base-button>
    </form>
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
  filters: {
    charsOnly: function (str) {
      return str.replace(/\s+/g, '')
    }
  },
  data() {
    return {
      gameName: '',
      data: '',
      gameId: undefined,
      cardList: undefined,
      checkErrors: false,
      wordlists: ['original']
    }
  },

  created: function () {
    
  },
  computed: {
    startingTurn () {
      return this.getNumCards('red') === 9 ? 'red' : 'blue'
    },
    inputIsValid () {
      return this.errorNumberOfLetters === false
      && this.errorUsesSymbols === false
    },
    errorNumberOfLetters () {
      return this.gameName.replace(/\s+/g, '').length < 4
    },
    errorUsesSymbols () {
      if (this.gameName.length < 4) return
      const validChars = ' abcdefghijklmnopqrstuvwxyz'
      const spacesRemoved = this.gameName.replace(/\s+/g, '')
      const gameLetters = spacesRemoved.toLowerCase().split('')
      const invalidChars = gameLetters.filter(letter => {
        return validChars.indexOf(letter) === -1
      })
      return invalidChars.length > 0
    },
    // selectedWordlists () {
    //   const selectedWords = []
    //   for (const list in this.wordlists) {
    //     console.log(list === true)
    //     if (list === true) selectedWords.push(list)
    //     console.log(selectedWords)
    //   }
    //   console.log(selectedWords)
    //   return selectedWords
    // }
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
    createCardlist: function () {
      const list = new wordList(undefined, undefined, this.wordlists)
      this.cardList = list.cardList
      this.remainingWords = list.remainingWords
    },
    generateHash: function () {
      const chars = '23456789'
      const numOfChars = 4
      const hash = []
      for ( var i = 0; i < numOfChars; i++ ) {
        hash.push(chars.charAt(Math.floor(Math.random() * (chars.length -1))))
      }
      return hash.join('')
    },
    setGameId: function () {
      const hash = this.generateHash()
      const gameId = this.gameName.replace(/\s+/g, '') + '-' + hash
      this.gameId = gameId
    },
    setupGame: function () {
      this.validateInput()
      if (this.errorNumberOfLetters || this.errorUsesSymbols) return
      this.setGameId()
      this.createCardlist()
      db.ref(this.gameId).set({
        triggerResetToAgent: 0,
        cardList: this.cardList,
        teamTurn: this.startingTurn,
        winner: 'empty',
        startedCurrentGame: this.startingTurn,
        remainingWords: this.remainingWords
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
  label,
  legend
    color: rgb(198, 198, 198)

  label,
  input 
    display: block
    margin: 0 auto
    font-size: 1.6rem

  label 
    font-weight: bold
    letter-spacing: 0.1rem
    margin-bottom: 2rem

  input 
    padding: 0.8rem 1.2rem 
    text-align: center 
    color: rgb(64, 64, 64)
    border-radius: 8px
    margin-bottom: 3rem

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

  fieldset 
    display: flex
    flex-direction: column
    // align-items: center
    padding: 1rem 1.1rem
    border: none
    width: 32rem
    margin: 0 auto

  legend 
    font-size: 1.6rem
    font-weight: 700
    text-align: center
    padding-bottom: 1rem

  .word-option 
    display: flex
    justify-content: space-between
    margin-left: 2rem
    margin-right: 0
    width: 25rem
    text-align: center

    input 
      margin-left: 0
      margin-right: 0

    label
      width: 343px
      text-align: left
      margin-right: 0
      margin-left: 0
      font-weight: normal

</style>

