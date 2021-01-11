<template>
  <div>
    <form action="">
      <label for="game">Enter a name for your game: </label>
      <input v-model="gameName" type="text" id="game" placeholder="Ex: my-super-fun-game">
    </form>
    <button @click="setupGame()">Create new game</button>
    <!-- <button @click="addProp('penis')">Add penis</button> -->
    <p>{{ data.username }}</p>
  </div>
</template>


<script>
import { db } from '@/db'
import { wordList } from '@/service-wordlist'

export default {
  name: 'recent',
  data() {
    return {
      gameName: '',
      data: '',
      gameId: undefined,
      cardList: undefined
    }
  },
  computed: {
  },
  created: function () {
    this.getGameInfo()
    const list = new wordList
    this.cardList = list.cardList
  },
  methods: {
    addProp: function (prop) {
      // From the docs:
      // Write the new post's data simultaneously in the posts list and the user's post list.
      // var updates = {};
      // updates['/posts/' + newPostKey] = postData;
      // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
      // return firebase.database().ref().update(updates);
      const updates = { username: prop}
      return db.ref(this.gameId).update(updates)
    },
    generateHash: function () {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      const numOfChars = 6
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
      console.log(this.gameId)
    },
    getGameInfo: function () {
      if(db.ref(this.gameId)) {
        const currentGame = db.ref(this.gameId)
        currentGame.on('value', (snapshot) => {
          this.data = snapshot.val()
        })
      }
    },
    setupGame: function () {
      this.setGameId()
      db.ref(this.gameId).set({
        players: [{dummy : 'dummy'}],
        cardList: this.cardList
      })
      // this.getGameInfo()
      const path = '/play/' + this.gameId
      this.$router.push({ path })
    }
  }
}
// reference: https://firebase.google.com/docs/database/web/read-and-write
</script>

