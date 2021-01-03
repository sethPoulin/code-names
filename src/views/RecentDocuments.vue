<template>
  <div>
    <h1>{{ documents['test'] }}</h1>
    <button @click="writeUserData(game, 'poopoohead', 'seth@seth.com')">Add item</button>
    <form action="">
      <label for="game">Enter a name for your game: </label>
      <input v-model="game" type="text" id="game" placeholder="Game name">
    </form>
    <p>{{ data.arrays }}</p>
  </div>
</template>


<script>
import { db } from '@/db'

export default {
  name: 'recent',
  data() {
    return {
      documents: '',
      game: '',
      data: ''
    }
  },
  created: function () {
    this.getGameInfo
  },
  methods: {
    writeUserData: function (gameName, name, email) {
      console.log('clicked')
      db.ref(gameName).set({
        username: name,
        emails: {
          one: name,
          two: name,
          three: name
        },
        arrays: [
          name, email, email
        ]
      })
      this.getGameInfo()
    },
    getGameInfo: function () {
      const games = db.ref(this.game)
      games.on('value', (snapshot) => {
        this.data = snapshot.val()
      })
    }
  }
}
</script>