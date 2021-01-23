<template>
  <div class="container">
    <div class="header">
      <!-- <h1>This is your game page</h1> -->
      <h2>Send other players this link so they can join the game:</h2>
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
        @revealCard="[solveCard(card.word), updateCards()]">
      </game-card>
    </div>
  </div>
</template>

<script>

import GameCard from '@/components/GameCard'
import { db } from '@/db'

export default {
  name: 'play',
  components: {
    GameCard
  },
  data() {
    return {
      gameId: '',
      data: '',
      blueCardsRemaining: undefined,
      redCardsRemaining: undefined
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
    }
  }
}


</script>

<style lang="stylus" scoped>
  
  .container 
    max-width 95%
    margin: 0 auto
  
  .game 
    max-width: 1200px
    margin: 0 auto
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 1rem

</style>