<template>
  <div class="container">
    <div class="header flex">
      <!-- <h2>Send other players this link so they can join the game:</h2> -->
      <div class="blue-cards-remain-container">
        <p class=blue-cards-remain>Blue spies remaining:</p>
        <p class=blue-cards-remain>{{ blueCardsRemaining }}</p>
      </div>
      <div class="center-header-container">
        <h2 class="game-link">https://code-names/play/{{ gameId }}</h2>
        <div v-if="winner" class="win-container flex">
          <p class="win-message">Woot! {{winner | capitalize}} wins!</p>
          <base-button
            class="new-game"
            @click.native="startNewGame()">
            New Game
          </base-button>
        </div>
        <div v-else class="turn-container flex">
          <p 
            v-if="data.teamTurn" 
            class="turn-message">
            {{ data.teamTurn | capitalize }} is playing
          </p>
          <base-button 
            @click.native="endCurrentTurn()"
            v-if="data.teamTurn" 
            class="turn-message--end">
            End {{data.teamTurn}}'s turn
          </base-button>
        </div>
      </div>
      <div class="red-cards-remain-container">
        <p class=red-cards-remain>Red spies remaining:</p>
        <p class=red-cards-remain>{{ this.redCardsRemaining }}</p>
      </div>  
    </div>
    <div 
      :class="['game', {'ended' : winner}]">
      <game-card
        class="card" 
        v-for="card in data.cardList" 
        :key="card.word" 
        :word="card.word" 
        :role="card.role"
        :isSolved="card.solved"
        :isSpymaster="!playerIsAgent"
        :gameIsOver="winner"
        @revealCard="solveCard(card.word)">
      </game-card>
    </div>
    <div class="player-type-container">
      <base-button class="player-role" 
        v-if="playerIsAgent"
        @click.native="switchLayout()">
          PLAY AS SPYMASTER
      </base-button>
      <base-button class="player-role"
        v-else
        @click.native="switchLayout()">
          PLAY AS AGENT
      </base-button>
    </div>
  </div>
</template>

<script>

import GameCard from '@/components/GameCard'
import { db } from '@/db'
import BaseButton from '@/components/BaseButton.vue'

export default {
  name: 'play',
  components: {
    GameCard,
    BaseButton
  },
  filters: {
    capitalize: function (word) {
      if (!word) return ''
      word = word.toString()
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
  },
  data() {
    return {
      gameId: '',
      data: '',
      playerIsAgent: true,
      winner: undefined,
      cardSolvedRole: undefined
    }
  },
  created: function () {
    this.getGameId()
    this.getGameInfo()
  },
  mounted: function () {
  },
  watch: {
    turnShouldEnd: function (val) {
      if (val === true) {
        this.cardSolvedRole = undefined
        this.endCurrentTurn()
      }
    },
    redCardsRemaining: function (val) {
      if (val === 0) {
        this.winner = 'red'
      }
    },
    blueCardsRemaining: function (val) {
      if (val === 0) {
        this.winner = 'blue'
      }
    }
  },
  computed: {
    blueCardsRemaining () {
      if (!this.data.cardList) return
      return this.getCardsRemaining('blue')
    },
    redCardsRemaining () {
      if (!this.data.cardList) return
      return this.getCardsRemaining('red')
    },
    turnShouldEnd () {
      return (this.cardSolvedRole === 'civilian') || (this.cardSolvedRole === 'red' && this.data.teamTurn === 'blue') || (this.cardSolvedRole === 'blue' && this.data.teamTurn === 'red')
    }
  },
  methods: {
    getGameId () {
      this.gameId = this.$route.params.game
    },
    getGameInfo: function () {
      if(db.ref(this.gameId)) {
        const currentGame = db.ref(this.gameId)
        currentGame.on('value', (snapshot) => {
          this.data = snapshot.val()
        })
      }
    },
    solveCard (wordStr) {
      this.data.cardList.forEach(card => {
        if (card.word === wordStr) {
          card.solved = true
          this.cardSolvedRole = card.role
          if (card.role === 'assassin') this.endGame()
        }
      })
      this.updateCards() 
    },
    updateCards () {
      const updates = {}
      updates[this.gameId + '/cardList'] = this.data.cardList;
      return db.ref().update(updates)
    },
    switchLayout () {
      this.playerIsAgent = !this.playerIsAgent
    },
    updateTurn (team) {
      const updates = {}
      updates[this.gameId + '/teamTurn'] = team
      return db.ref().update(updates)
    },
    endCurrentTurn () {
      if (this.data.teamTurn === 'red') this.updateTurn('blue')
      else {
        this.updateTurn('red')
      }
    },
    getCardsRemaining (team) {
      const solvedCards = this.data.cardList.filter(card => {
        return card.role === team && card.solved === false
      })
      return solvedCards.length
    },
    endGame () {
      this.winner = this.data.teamTurn === 'red' ? 'blue' : 'red'
    },
    startNewGame () {
      this.$router.push('/create')
      const updates = {}
      updates[this.gameId] = null;
      return db.ref().update(updates)
    }
  }
}


</script>

<style lang="stylus" scoped>

  * 
    margin-top: 0

  .flex 
    display: flex
    width: 100%
    justify-content: space-between

  .turn-message 
    font-size: 1.5rem
    font-weight: 900

  .blue-cards-remain-container,
  .red-cards-remain-container,
  .center-header-container 
    background-color: rgb(235, 234, 234)
    margin-bottom: 1.7rem
    box-shadow: 6px 6px 12px rgba(0,0,0,0.2)
  
  .blue-cards-remain,
  .red-cards-remain,
  .turn-message,
  .turn-message--end,
  .win-message,
  .new-game
    font-size: 1.5rem
    font-weight: 900
    padding: 0 1.5rem
    margin-bottom 1rem
    border-radius: 3px

    &:first-of-type 
      padding-top: 1rem
    
    &:nth-of-type(2)
      border-radius: 3px
      background-color white
      display inline-block

  .turn-message--end,
  .new-game 
    background-color white
    margin-right 1rem
    padding-bottom 1rem
  
  .blue-cards-remain 
    color: rgba(37, 150, 190, 1)

  .red-cards-remain 
    color: rgba(210, 67, 51, 1)

  .game-link 
    padding: 1rem 2rem
    margin-bottom 0
  
  .container 
    max-width 95%
    margin: 0 auto

  .player-type-container  
    margin-bottom: 2rem

  .player-role 
    font-weight: bold
  
  .game 
    max-width: 1200px
    margin: 0 auto 2rem
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 1rem

    &.ended 
      opacity: 0.7

  

</style>