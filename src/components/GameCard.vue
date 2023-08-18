<template>
  <!-- you are here -->
  <button 
    :class="[
      'card-container',
      {'solved': isSolved}, 
      role,
      {'spymaster': isSpymaster},
      {'no-cursor': (isSpymaster || isSolved || gameIsOver)}
    ]"
    @click="revealCard()"
    :disabled="(isSpymaster || isSolved || gameIsOver)">
    <p class="word">{{ word }}</p>
  </button>
</template>

<script>
export default {
  name: 'game-card',
  props: {
    role: String,
    word: String,
    isSolved: Boolean,
    isSpymaster: Boolean,
    gameIsOver: String
  },
  data() {
    return {
    }
  },
  methods: {
    revealCard() {
      this.$emit('revealCard')
    }
  }
}
</script>

<style lang="stylus" scoped>

  .card-container 
    max-width: 200px
    box-shadow: 3px 5px 8px rgba(0,0,0,0.2)
    border-radius: 8px
    height: 100px
    // border: 1px solid rgba(166, 166, 166, 0.15)
    // border: 2px solid rgba(0,0,0,0.3)

  .word
    display: inline-block
    text-transform: uppercase
    font-size: 1.2rem
    font-weight: bold
    padding: 1rem 0
    margin: 0

  .assassin 
    &.solved,
    &.solved.spymaster
      background-color rgba(33, 19, 13, 1)
      color: white
      border: none

    &.spymaster 
      background-color rgba(33, 19, 13, 0.5)
      color: rgb(198, 198, 198)
      border: 3px solid rgb(198, 198, 198)

  .red
    &.solved
    &.solved.spymaster
      background-color rgba(210, 67, 51, 1)
      color: rgb(44, 62, 80)
      color: white
      border: none
      
    &.spymaster 
      background-color rgba(210, 67, 51, 0.3)
      color: rgb(44, 62, 80)
      color: rgba(210, 67, 51, 1)
      background-color: white
      border: 3px solid rgba(210, 67, 51, 1)

  .blue 
    &.solved,
    &.solved.spymaster
      background-color: rgba(37, 150, 190, 1)
      color: white
      border: none

    &.spymaster 
      background-color: rgba(37, 150, 190, 0.3)
      color: rgb(44, 62, 80)
      color: rgba(37, 150, 190, 1)
      background-color: white
      border: 3px solid rgba(37, 150, 190, 1)

  .civilian 
    &.solved,
    &.solved.spymaster
      background-color: rgba(128, 128, 128, 1)
      color: white
      border: none

    &.spymaster
      background-color: rgba(128, 128, 128, 0.3)
      color: rgb(44, 62, 80)
      color: rgba(128, 128, 128, 1)
      background-color: white
      border: 3px solid rgba(128, 128, 128, 1)


  .red,
  .blue,
  .civilian,
  .assassin
      background-color: rgb(235, 234, 234)
      // border: 3px solid lightgrey 
      color: rgba(0,0,0,0.9)
      cursor: pointer
      // padding-bottom 2px

</style>