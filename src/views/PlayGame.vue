<template>
  <div class="container">
        <h2 class="game-link">This is your game link: https://code-names/play/{{ gameId }}</h2>
    <div class="header flex">
      <!-- <h2>Send other players this link so they can join the game:</h2> -->
      <div class="blue-cards-remain-container">
        <p class=blue-cards-remain>Blue spies remaining:</p>
        <p class=blue-cards-remain>{{ blueCardsRemaining }}</p>
      </div>
      <div class="center-header-container">
        <div v-if="winner" class="win-container">
          <p class="win-message">Woot! {{winner | capitalize}} wins!</p>
          <base-button
            class="new-game"
            @click.native="startNewGame()">
            New Game
          </base-button>
        </div>
        <div v-else class="turn-container">
          <p 
            v-if="data.teamTurn" 
            class="turn-message">
            <span :class="data.teamTurn">
              {{ data.teamTurn | capitalize }} 
            </span>
            is playing
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
    <div class="player-type-container flex">
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
      <base-button 
        class="start-new"
        @click.native="startNewGame()">
          START NEW GAME
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
      this.$router.push('/create').catch(() => {});
    },
    destroyGame () {
      const updates = {}
      updates[this.gameId] = null;
      return db.ref().update(updates)
    }
  },
  beforeRouteLeave (to, from, next) {
  console.log(to, from)
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
    this.destroyGame()
  } else {
    next(false)
  }
}
}


</script>

<style lang="stylus" scoped>

  * 
    margin-top: 0

  .header 
    max-width: 1000px
    margin: 0 auto

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
    border-radius: 8px
    max-width: 300px

    // p:nth-of-type(2)
    //   margin-bottom: 0
  
  .center-header-container 
    max-width: 350px

    button
      margin 0 1.5rem 1rem 1.5rem
  
  .blue-cards-remain,
  .red-cards-remain,
  .turn-message,
  .turn-message--end,
  .win-message,
  .new-game
    font-size: 1.2rem
    font-weight: 900
    padding: 0 1.5rem
    margin-bottom 1rem
    border-radius: 3px
    // display: inline
    text-transform: uppercase

    &:first-of-type 
      padding-top: 1rem
    
    &:nth-of-type(2)
      border-radius: 3px
      background-color white
      display inline-block
  
  .blue-cards-remain,
  .red-cards-remain
    padding: 0.5rem 1.5rem

  .turn-message 
    span 
      &.red 
        color: rgba(210, 67, 51, 1)
      &.blue 
        color: rgba(37, 150, 190, 1)
    // span 
    //   display: block

  .turn-message--end,
  .new-game 
    background-color white
    // margin-right 1rem
    padding 1rem
    margin: 2rem
  
  .blue-cards-remain 
    color: rgba(37, 150, 190, 1)

  .red-cards-remain 
    color: rgba(210, 67, 51, 1)

  .game-link 
    padding: 1rem 2rem
    margin-bottom 0
    color: rgb(198, 198, 198)
  
  .container 
    max-width 95%
    margin: 0 auto

  .player-type-container  
    margin-bottom: 2rem
    max-width: 1000px
    margin: 0 auto

  .player-role,
  .start-new 
    font-weight: bold

  // .player-role 
  //   margin: 0 auto
  
  .game 
    max-width: 1000px
    margin: 0 auto 1.6rem
    display: grid
    // grid-template-columns: 180px 180px 180px 180px 180px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr
    grid-gap: 0.6rem

    &.ended 
      opacity: 0.7

  

</style>