<template>
  <div class="container">
    <div class="header">
      <!-- <h1>This is your game page</h1> -->
      <!-- <h2>Send other players this link so they can join the game:</h2> -->
      <h2>https://code-names/play/{{ gameId }}</h2>
    </div>
    <div class="game">
      <game-card
        class="card" 
        v-for="card in data.cardList" 
        :key="card.word" 
        :word="card.word" 
        :role="card.role"
        :isHidden="!card.solved"
        :isSpymaster="!playerIsAgent"
        @revealCard="[solveCard(card.word), updateCards()]">
      </game-card>
    </div>
    <div class="player-type-container">
      <base-button class="player-role" 
        v-if="playerIsAgent"
        @click.native="modifyLayout('Spymaster')">
          PLAY AS SPYMASTER
      </base-button>
      <base-button class="player-role"
        v-else
        @click.native="modifyLayout('Agent')">
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
      blueCardsRemaining: undefined,
      redCardsRemaining: undefined,
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
    modifyLayout (playerType) {
      this.playerIsAgent = !this.playerIsAgent
      console.log(playerType)
    }
  }
}


</script>

<style lang="stylus" scoped>
  
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