<template>
    <button>
      <slot>Submit</slot>
    </button>
</template>

<script>
export default {
  name: 'base-button'
}
</script>

<style lang="stylus">

  button 
    font-family Avenir, Helvetica, Arial, sans-serif
    font-size: 1rem
    padding: 1rem
    background-color: #ebeaea
    color: rgba(0,0,0,0.85)
    border: none
    border-radius:8px
    box-shadow: 6px 6px 12px rgba(0,0,0,0.2)

</style>