<template>
  <div class="game-container">
    <h1>This is your game page</h1>
    <h2>Send other players this link so they can join the game:</h2>
    <h2>https://code-names/play/{{ gameId }}</h2>
  </div>
</template>

<script>

export default {
  name: 'play',
  data() {
    return {
      gameId: ''
    }
  },
  created: function () {
    this.writeText()
  },
  methods: {
    writeText () {
      this.gameId = this.$route.params.game
    }
  }
}


</script>

<style lang="stylus" scoped>
</style>