<template>
  <div class="container">
    <div class="header flex">
      <!-- <h1>This is your game page</h1> -->
      <!-- <h2>Send other players this link so they can join the game:</h2> -->
      <div class="blue-cards-remain-container">
        <p class=blue-cards-remain>Blue spies remaining:</p>
        <p class=blue-cards-remain>{{ this.data.blueCardsRemaining }}</p>
      </div>
      <div class="center-header-container">
        <h2 class="game-link">https://code-names/play/{{ gameId }}</h2>
        <p class="turn-message">It's {{data.teamTurn}}'s turn</p>
      </div>
      <div class="red-cards-remain-container">
        <p class=red-cards-remain>Red spies remaining:</p>
        <p class=red-cards-remain>{{ this.data.redCardsRemaining }}</p>
      </div>  
    </div>
    <div class="game">
      <game-card
        class="card" 
        v-for="card in data.cardList" 
        :key="card.word" 
        :word="card.word" 
        :role="card.role"
        :isSolved="card.solved"
        :isSpymaster="!playerIsAgent"
        @revealCard="[solveCard(card.word), updateCards()]">
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
  data() {
    return {
      gameId: '',
      data: '',
      playerIsAgent: true
    }
  },
  created: function () {
    this.getGameId()
    this.getGameInfo()
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
        }
      })
    },
    updateCards () {
      const updates = {}
      updates[this.gameId] = this.data;
      return db.ref().update(updates);
    },
    switchLayout () {
      this.playerIsAgent = !this.playerIsAgent
    },
    endCurrentTurn () {
      // YOU ARE HERE
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
  .turn-message
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

</style>